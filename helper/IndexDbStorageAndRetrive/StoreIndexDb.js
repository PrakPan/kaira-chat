function storeValue(key, value) {
  const uri = window.location.pathname; // Get the current URI

  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyDatabase', 1);

    request.onerror = function (event) {
      reject('Error opening database');
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore('MyObjectStore', {
        keyPath: 'storagePoint',
      });
      objectStore.createIndex('storagePoint', 'storagePoint', { unique: true });
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['MyObjectStore'], 'readwrite');
      const objectStore = transaction.objectStore('MyObjectStore');
      const storagePoint = `${uri}_${key}`;
      const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes in milliseconds

      const data = {
        storagePoint: storagePoint,
        value: value,
        expirationTime: expirationTime,
      };

      const addRequest = objectStore.add(data);

      addRequest.onerror = function (event) {
        reject('Error storing data');
      };

      addRequest.onsuccess = function (event) {
        resolve(value);
      };

      transaction.oncomplete = function () {
        db.close();
      };
    };
  });
}

/// how to use
// Store the key-value pair
// storeAndRetrieveValue(key, value)
//   .then(() => {
//     console.log('Value stored successfully');
//   })
//   .catch(error => {
//     console.error('Error storing value:', error);
//   });
