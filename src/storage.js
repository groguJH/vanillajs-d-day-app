const STORAGE_KEY = "saved-date";

export function getSavedDate() {
  return localStorage.getItem(STORAGE_KEY);
}

export function saveDate(dateString) {
  localStorage.setItem(STORAGE_KEY, dateString);
}

export function clearSavedDate() {
  localStorage.removeItem(STORAGE_KEY);
}
