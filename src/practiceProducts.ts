import type { Product } from "./types";

const STORAGE_KEY = "fitly_practice_products";
const CHANGE_EVENT = "practice-products-changed";

export function getPracticeProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

export function addPracticeProduct(product: Product) {
  const existing = getPracticeProducts();
  const next = [product, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function onPracticeProductsChanged(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
