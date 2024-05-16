function retrieveValue(key) {
  const uri = window.location.pathname; // Get the current URI

  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MyDatabase", 1);

    request.onerror = function (event) {
      reject("Error opening database");
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["MyObjectStore"], "readonly");
      const objectStore = transaction.objectStore("MyObjectStore");
      const storagePoint = `${uri}_${key}`;

      const getRequest = objectStore.get(storagePoint);

      getRequest.onerror = function (event) {
        reject("Error retrieving data");
      };

      getRequest.onsuccess = function (event) {
        const storedData = event.target.result;

        if (storedData && storedData.expirationTime > Date.now()) {
          resolve(storedData.value);
        } else {
          resolve(null);
        }
      };

      transaction.oncomplete = function () {
        db.close();
      };
    };
  });
}
