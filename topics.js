// Topics a group can rank. Each topic brings its own words and rating criteria.
// item / items: the thing being ranked (singular / plural). sub: optional extra detail field. dish: optional "what did you have" field.
const C = (...labels) => labels.map((label, i) => ({ id: "c" + (i + 1), label }));
export const TOPICS = [
  { id: "burger", emoji: "🍔", name: "המבורגרים", item: "מקום", items: "מקומות", sub: "עיר", dish: "מה אכלת?", ex: "מוזס", criteria: [["taste", "טעם"], ["patty", "קציצה"], ["bun", "לחמנייה"], ["toppings", "תוספות ורטבים"], ["value", "תמורה למחיר"]].map(([id, label]) => ({ id, label })) },
  { id: "pizza", emoji: "🍕", name: "פיצה", item: "מקום", items: "מקומות", sub: "עיר", dish: "מה הזמנת?", ex: "פיצה האט", criteria: C("טעם", "בצק", "רוטב וגבינה", "תוספות", "תמורה למחיר") },
  { id: "sushi", emoji: "🍣", name: "סושי", item: "מקום", items: "מקומות", sub: "עיר", dish: "מה הזמנת?", ex: "ג׳ירף", criteria: C("טעם", "טריות", "אורז", "מגוון", "תמורה למחיר") },
  { id: "coffee", emoji: "☕", name: "בתי קפה", item: "מקום", items: "מקומות", sub: "עיר", dish: "מה הזמנת?", ex: "ארומה", criteria: C("קפה", "אוכל", "אווירה", "שירות", "תמורה למחיר") },
  { id: "food", emoji: "🍽️", name: "מסעדות", item: "מקום", items: "מקומות", sub: "עיר", dish: "מה הזמנת?", ex: "שם המסעדה", criteria: C("אוכל", "שירות", "אווירה", "ניקיון", "תמורה למחיר") },
  { id: "movies", emoji: "🎬", name: "סרטים", item: "סרט", items: "סרטים", sub: "שנה", dish: "", ex: "אופנהיימר", criteria: C("עלילה", "משחק", "ויזואליה", "מוזיקה", "הנאה") },
  { id: "series", emoji: "📺", name: "סדרות", item: "סדרה", items: "סדרות", sub: "איפה צופים", dish: "", ex: "שטיסל", criteria: C("עלילה", "דמויות", "קצב", "סיום", "הנאה") },
  { id: "games", emoji: "🎮", name: "משחקים", item: "משחק", items: "משחקים", sub: "פלטפורמה", dish: "", ex: "FIFA", criteria: C("גיימפליי", "גרפיקה", "סיפור", "ממכר", "תמורה למחיר") },
  { id: "books", emoji: "📚", name: "ספרים", item: "ספר", items: "ספרים", sub: "סופר/ת", dish: "", ex: "הארי פוטר", criteria: C("עלילה", "כתיבה", "דמויות", "קצב", "הנאה") },
  { id: "trails", emoji: "🥾", name: "מסלולים", item: "מסלול", items: "מסלולים", sub: "אזור", dish: "", ex: "נחל עמוד", criteria: C("נוף", "רמת קושי", "צל ומים", "נגישות", "חוויה") },
];
export const CUSTOM = { id: "custom", emoji: "✨", name: "משהו אחר", item: "פריט", items: "פריטים", sub: "פרט נוסף", dish: "", ex: "", criteria: [] };

// Groups created before topics existed are burger groups.
export const topicOf = g => (g && g.topic) || TOPICS[0];

export function customTopic(name, labels) {
  const crit = labels.map(s => s.trim()).filter(Boolean).slice(0, 5);
  return { ...CUSTOM, name: name.trim(), criteria: C(...(crit.length ? crit : ["כללי"])) };
}
