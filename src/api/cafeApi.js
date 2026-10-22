// Simulated async API: Promises + delays + JSON + localStorage.
const KEY = "almaty_cafes_v1";

export const DISTRICTS = ["Almaly", "Bostandyk", "Medeu", "Auezov", "Alatau", "Zhetysu", "Turksib", "Nauryzbay"];
export const TYPES = ["Coffee shop", "Bakery", "Restaurant", "Co-working café"];

const FIRST = ["Apple", "Steppe", "Tau", "Nomad", "Silk", "Altyn", "Kok", "Arba", "Zeren", "Tulpar", "Baiterek", "Shanyrak"];
const SECOND = ["Roasters", "Corner", "House", "Garden", "Table", "Kitchen", "Lab", "Terrace", "Bakehouse", "Point"];
const DESCRIPTIONS = [
  "Quiet spot with big windows, good for reading and slow mornings.",
  "Busy at lunch, famous for its fresh pastries and filter coffee.",
  "Cozy place with live music on weekends and a small book shelf.",
  "Fast Wi-Fi, many power outlets and long opening hours for students.",
  "Family-run kitchen serving seasonal dishes and local tea blends.",
  "Modern interior, specialty beans and a view of the mountains.",
];

// Deterministic pseudo-random generator so the seed data is always the same.
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateSeed() {
  const rnd = mulberry32(2026);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  return Array.from({ length: 120 }, (_, i) => ({
    id: i + 1,
    name: `${FIRST[i % FIRST.length]} ${SECOND[Math.floor(i / FIRST.length) % SECOND.length]}`,
    district: pick(DISTRICTS),
    type: pick(TYPES),
    rating: Math.round((3 + rnd() * 2) * 10) / 10,
    price: 1 + Math.floor(rnd() * 3),
    wifi: rnd() > 0.35,
    description: pick(DESCRIPTIONS),
    createdAt: 1700000000000 + i * 86400000,
  }));
}

function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupted storage -> reseed */
  }
  const seed = generateSeed();
  save(seed);
  return seed;
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}
const wait = (signal) => delay(300 + Math.random() * 400, signal);

const SORTS = {
  "rating-desc": (a, b) => b.rating - a.rating,
  "rating-asc": (a, b) => a.rating - b.rating,
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  newest: (a, b) => b.createdAt - a.createdAt,
};

export async function getCafes({ search = "", district = "all", type = "all", sort = "rating-desc", page = 1, pageSize = 12 }, signal) {
  await wait(signal);
  const q = search.trim().toLowerCase();
  const filtered = load()
    .filter((c) => (district === "all" || c.district === district) && (type === "all" || c.type === type))
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    .sort(SORTS[sort] ?? SORTS["rating-desc"]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  return {
    items: filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    total: filtered.length,
    page: safePage,
    totalPages,
  };
}

export async function getCafe(id, signal) {
  await wait(signal);
  const cafe = load().find((c) => c.id === Number(id));
  if (!cafe) throw new Error("This café does not exist or was deleted.");
  return cafe;
}

export async function addCafe(data, signal) {
  await wait(signal);
  const list = load();
  const cafe = { ...data, id: Math.max(0, ...list.map((c) => c.id)) + 1, createdAt: Date.now() };
  save([cafe, ...list]);
  return cafe;
}

export async function deleteCafe(id, signal) {
  await wait(signal);
  save(load().filter((c) => c.id !== Number(id)));
}