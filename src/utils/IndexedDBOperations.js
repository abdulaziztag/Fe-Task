export const openIndexedDB = (dbName, version) => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(dbName, version);

    openRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains("orders")) {
        db.createObjectStore("orders", { autoIncrement: true });
      }
    };

    openRequest.onsuccess = (event) => {
      resolve(event.target.result);
    };

    openRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const getSetting = (db, key) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("settings", "readonly");
    const store = transaction.objectStore("settings");
    const request = store.get(key);

    request.onsuccess = () => {
      resolve(request.result ? request.result.value : null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const putSetting = (db, key, value) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("settings", "readwrite");
    const store = transaction.objectStore("settings");
    const request = store.put({ key, value });

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};
