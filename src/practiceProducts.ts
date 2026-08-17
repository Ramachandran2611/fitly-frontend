import type { Product } from "./types";

const PRODUCTS_KEY = "fitly_practice_products";
const OVERRIDES_KEY = "fitly_practice_overrides";
const DELETED_KEY = "fitly_practice_deleted";
const CHANGE_EVENT = "practice-products-changed";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function notifyChanged() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getPracticeProducts(): Product[] {
  return readJson<Product[]>(PRODUCTS_KEY, []);
}

export function addPracticeProduct(product: Product) {
  const next = [product, ...getPracticeProducts()];
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next));
  notifyChanged();
}

function isPracticeProduct(id: number): boolean {
  return getPracticeProducts().some((p) => p.id === id);
}

export function getOverrides(): Record<number, Product> {
  return readJson<Record<number, Product>>(OVERRIDES_KEY, {});
}

export function getDeletedIds(): number[] {
  return readJson<number[]>(DELETED_KEY, []);
}

// Saves an edit for `product.id`. If it's a practice-added product, the
// stored copy is updated directly; otherwise the edit is kept as an
// override layered on top of the real (backend-fetched) product.
export function saveProductEdit(product: Product) {
  if (isPracticeProduct(product.id)) {
    const next = getPracticeProducts().map((p) => (p.id === product.id ? product : p));
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next));
  } else {
    const overrides = getOverrides();
    overrides[product.id] = product;
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  }
  notifyChanged();
}

export function deleteProduct(id: number) {
  if (isPracticeProduct(id)) {
    const next = getPracticeProducts().filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next));
  } else {
    const deleted = getDeletedIds();
    if (!deleted.includes(id)) {
      localStorage.setItem(DELETED_KEY, JSON.stringify([...deleted, id]));
    }
  }

  const overrides = getOverrides();
  if (overrides[id]) {
    delete overrides[id];
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  }

  notifyChanged();
}

// Applies stored overrides on top of freshly-fetched backend products and
// drops any that were deleted from the practice page.
export function applyPracticeEdits(products: Product[]): Product[] {
  const overrides = getOverrides();
  const deleted = new Set(getDeletedIds());
  return products
    .filter((p) => !deleted.has(p.id))
    .map((p) => overrides[p.id] ?? p);
}

export function findProduct(query: string, backendProducts: Product[]): Product | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const pool = applyPracticeEdits([...getPracticeProducts(), ...backendProducts]);
  const byId = pool.find((p) => String(p.id) === trimmed);
  if (byId) return byId;

  const lower = trimmed.toLowerCase();
  return pool.find((p) => p.name.toLowerCase().includes(lower)) ?? null;
}

export function onPracticeProductsChanged(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
