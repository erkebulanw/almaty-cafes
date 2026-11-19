// Public API: the café list is a real HTTP resource (/api/cafes.json),
// which the service worker caches. Added/deleted cafés are stored locally on top of it.
const LOCAL_KEY = "almaty_cafes_local_v2";
const API_URL = `${import.meta.env.BASE_URL}api/cafes.json`;

export const DISTRICTS = ["Almaly", "Bostandyk", "Medeu", "Auezov", "Alatau", "Zhetysu", "Turksib", "Nauryzbay"];
export const TYPES = ["Coffee shop", "Bakery", "Restaurant", "Co-working café"];

export class OfflineError extends Error {
  constructor() {
    super("You are offline and this data has not been saved on your device yet.");
    this.name = "OfflineError";
  }
}

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { added: parsed.added ?? [], deleted: parsed.deleted ?? [] };
    }
  } catch {
    /* corrupted storage -> start empty */
  }
  return { added: [], deleted: [] };
}

function writeLocal(state) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
}

async function loadAll(signal) {
  let res;
  try {
    res = await fetch(API_URL, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new OfflineError();
  }
  if (!res.ok) throw new Error(`Server error (${res.status}). Please try again.`);
  const list = await res.json();
  const { added, deleted } = readLocal();
  return {
    cafes: [...added, ...list.filter((c) => !deleted.includes(c.id))],
    fromCache: res.headers.get("x-from-cache") === "1",
  };
}

const SORTS = {
  "rating-desc": (a, b) => b.rating - a.rating,
  "rating-asc": (a, b) => a.rating - b.rating,
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  newest: (a, b) => b.createdAt - a.createdAt,
};

export async function getCafes({ search = "", district = "all", type = "all", sort = "rating-desc", page = 1, pageSize = 12 }, signal) {
  const { cafes, fromCache } = await loadAll(signal);
  const q = search.trim().toLowerCase();
  const filtered = cafes
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
    fromCache,
  };
}

export async function getCafe(id, signal) {
  const { cafes, fromCache } = await loadAll(signal);
  const cafe = cafes.find((c) => c.id === Number(id));
  if (!cafe) throw new Error("This café does not exist or was deleted.");
  return { ...cafe, fromCache };
}

export async function addCafe(data) {
  const state = readLocal();
  const id = Math.max(1000, ...state.added.map((c) => c.id)) + 1;
  const cafe = { ...data, id, createdAt: Date.now() };
  writeLocal({ ...state, added: [cafe, ...state.added] });
  return cafe;
}

export async function deleteCafe(id) {
  const n = Number(id);
  const state = readLocal();
  writeLocal({
    added: state.added.filter((c) => c.id !== n),
    deleted: state.deleted.includes(n) ? state.deleted : [...state.deleted, n],
  });
}