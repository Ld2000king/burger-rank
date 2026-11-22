// Data layer. Firebase (shared between friends) when firebase-config.js is filled in,
// otherwise a local, single-device fallback with the same interface.
import { firebaseConfig } from "./firebase-config.js";

const FB = "https://www.gstatic.com/firebasejs/10.12.2/";
const CODE_ABC = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const newCode = () => Array.from({ length: 6 }, () => CODE_ABC[(Math.random() * CODE_ABC.length) | 0]).join("");
export const rid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const ls = {
  get(k, d) { try { const v = localStorage.getItem("bunrank:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("bunrank:" + k, JSON.stringify(v)); } catch {} },
};
// Groups this device belongs to (ids only).
export const myGroupIds = {
  get: () => ls.get("groups", []),
  add(id) { const g = this.get(); if (!g.includes(id)) ls.set("groups", [...g, id]); },
  remove(id) { ls.set("groups", this.get().filter(x => x !== id)); },
};
export class JoinError extends Error {}

/* ---------- local fallback (one device) ---------- */
function localBackend() {
  let db = { groups: {}, codes: {} };
  let idb;
  const subs = new Map();
  const open = () => idb || (idb = new Promise((res, rej) => { const r = indexedDB.open("bunrank-groups", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const load = async () => { try { const d = await open(); db = await new Promise(res => { const q = d.transaction("kv").objectStore("kv").get("db"); q.onsuccess = () => res(q.result || db); q.onerror = () => res(db); }); } catch {} };
  const save = async () => { try { const d = await open(); d.transaction("kv", "readwrite").objectStore("kv").put(db, "db"); } catch {} };
  const snap = gid => { const g = db.groups[gid]; if (!g) return null; return { group: g.info, members: Object.values(g.members), places: Object.values(g.places), ratings: Object.values(g.ratings) }; };
  const fire = gid => (subs.get(gid) || []).forEach(cb => setTimeout(() => cb(snap(gid)), 0));
  const uid = ls.get("localUid", null) || (() => { const u = "local-" + rid(); ls.set("localUid", u); return u; })();
  return {
    kind: "local", uid,
    async init() { await load(); return uid; },
    async createGroup(name, me) {
      let code = newCode(); while (db.codes[code]) code = newCode();
      const id = rid();
      db.groups[id] = { info: { id, name, code, createdBy: uid, createdAt: Date.now() }, members: { [uid]: { id: uid, name: me, joinedAt: Date.now() } }, places: {}, ratings: {} };
      db.codes[code] = id; await save(); myGroupIds.add(id); return id;
    },
    async joinByCode(code, me) {
      const id = db.codes[code.toUpperCase()]; if (!id) throw new JoinError("not-found");
      db.groups[id].members[uid] = { id: uid, name: me, joinedAt: Date.now() }; await save(); myGroupIds.add(id); fire(id); return id;
    },
    async groupInfo(id) { return db.groups[id]?.info || null; },
    watchGroup(id, cb) { const l = subs.get(id) || []; l.push(cb); subs.set(id, l); setTimeout(() => cb(snap(id)), 0); return () => subs.set(id, (subs.get(id) || []).filter(x => x !== cb)); },
    async setMyName(id, name) { const m = db.groups[id]?.members[uid]; if (m) { m.name = name; await save(); fire(id); } },
    async savePlace(id, p) { db.groups[id].places[p.id] = p; await save(); fire(id); },
    async saveRating(id, r) { db.groups[id].ratings[r.id] = r; await save(); fire(id); },
    async deletePlace(id, pid) { const g = db.groups[id]; delete g.places[pid]; for (const k of Object.keys(g.ratings)) if (g.ratings[k].pid === pid) delete g.ratings[k]; await save(); fire(id); },
    async leaveGroup(id) { const g = db.groups[id]; if (g) delete g.members[uid]; await save(); myGroupIds.remove(id); fire(id); },
  };
}

/* ---------- Firebase (shared) ---------- */
async function firebaseBackend() {
  const [{ initializeApp }, A, F] = await Promise.all([import(FB + "firebase-app.js"), import(FB + "firebase-auth.js"), import(FB + "firebase-firestore.js")]);
  const app = initializeApp(firebaseConfig);
  let fs;
  try { fs = F.initializeFirestore(app, { localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() }) }); } catch { fs = F.getFirestore(app); }
  const auth = A.getAuth(app);
  const d = (...p) => F.doc(fs, ...p), c = (...p) => F.collection(fs, ...p);
  const list = s => s.docs.map(x => ({ ...x.data(), id: x.id }));
  const be = {
    kind: "firebase", uid: null,
    async init() {
      const user = await new Promise((res, rej) => { const un = A.onAuthStateChanged(auth, u => { if (u) { un(); res(u); } }); A.signInAnonymously(auth).catch(rej); });
      be.uid = user.uid; return user.uid;
    },
    async createGroup(name, me) {
      let code = newCode();
      for (let i = 0; i < 5 && (await F.getDoc(d("codes", code))).exists(); i++) code = newCode();
      const id = rid();
      await F.setDoc(d("groups", id), { name, code, createdBy: be.uid, createdAt: Date.now() });
      await F.setDoc(d("groups", id, "members", be.uid), { name: me, joinedAt: Date.now() });
      await F.setDoc(d("codes", code), { gid: id });
      myGroupIds.add(id); return id;
    },
    async joinByCode(code, me) {
      const s = await F.getDoc(d("codes", code.toUpperCase()));
      if (!s.exists()) throw new JoinError("not-found");
      const id = s.data().gid;
      await F.setDoc(d("groups", id, "members", be.uid), { name: me, joinedAt: Date.now() });
      myGroupIds.add(id); return id;
    },
    async groupInfo(id) { const s = await F.getDoc(d("groups", id)); return s.exists() ? { ...s.data(), id } : null; },
    watchGroup(id, cb) {
      const st = { group: null, members: [], places: [], ratings: [] }, got = new Set();
      const emit = () => { if (got.size === 4) cb({ ...st }); };
      const err = () => cb(null);
      const uns = [
        F.onSnapshot(d("groups", id), s => { st.group = s.exists() ? { ...s.data(), id } : null; got.add("g"); emit(); }, err),
        F.onSnapshot(c("groups", id, "members"), s => { st.members = list(s); got.add("m"); emit(); }, err),
        F.onSnapshot(c("groups", id, "places"), s => { st.places = list(s); got.add("p"); emit(); }, err),
        F.onSnapshot(c("groups", id, "ratings"), s => { st.ratings = list(s); got.add("r"); emit(); }, err),
      ];
      return () => uns.forEach(u => u());
    },
    async setMyName(id, name) { await F.setDoc(d("groups", id, "members", be.uid), { name }, { merge: true }); },
    async savePlace(id, p) { const { id: pid, ...rest } = p; await F.setDoc(d("groups", id, "places", pid), rest); },
    async saveRating(id, r) { const { id: k, ...rest } = r; await F.setDoc(d("groups", id, "ratings", k), rest); },
    async deletePlace(id, pid) {
      const mine = await F.getDocs(F.query(c("groups", id, "ratings"), F.where("pid", "==", pid), F.where("uid", "==", be.uid)));
      await Promise.all(mine.docs.map(x => F.deleteDoc(x.ref)));
      await F.deleteDoc(d("groups", id, "places", pid));
    },
    async leaveGroup(id) { await F.deleteDoc(d("groups", id, "members", be.uid)); myGroupIds.remove(id); },
  };
  return be;
}

export async function createBackend() {
  if (firebaseConfig && firebaseConfig.apiKey) {
    try { const be = await firebaseBackend(); await be.init(); return be; }
    catch (e) { console.warn("Firebase unavailable, using this device only", e); }
  }
  const be = localBackend(); await be.init(); return be;
}
