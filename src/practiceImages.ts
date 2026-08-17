const STORAGE_PREFIX = "fitly_practice_image:";
const CHANGE_EVENT = "practice-images-changed";

export function getImage(key: string): string | null {
  return localStorage.getItem(STORAGE_PREFIX + key);
}

export function setImage(key: string, dataUrl: string) {
  localStorage.setItem(STORAGE_PREFIX + key, dataUrl);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function removeImage(key: string) {
  localStorage.removeItem(STORAGE_PREFIX + key);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function onImagesChanged(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}
