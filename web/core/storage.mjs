/** JSON local-storage wrapper with an in-memory fallback for restricted browsers. */
export function createStorage(storage) {
  const fallback = Object.create(null);

  return {
    get(key) {
      try {
        const value = storage.getItem(key);
        if (value !== null) return JSON.parse(value);
      } catch {}
      return Object.hasOwn(fallback, key) ? fallback[key] : null;
    },
    set(key, value) {
      fallback[key] = value;
      try { storage.setItem(key, JSON.stringify(value)); } catch {}
    },
    remove(key) {
      delete fallback[key];
      try { storage.removeItem(key); } catch {}
    },
  };
}
