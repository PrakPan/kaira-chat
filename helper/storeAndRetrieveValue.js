export function storeAndRetrieveValue(key, value) {
  const uri = window.location.pathname; // Get the current URI

  // Generate a unique storage point based on the URI and the key
  const storagePoint = `${uri}_${key}`;

  if (value) {
    // Store the key-value pair with a timestamp
    const data = {
      value: value,
      timestamp: Date.now(),
    };
    localStorage.setItem(storagePoint, JSON.stringify(data));

    // Delete the item after 15 minutes
    setTimeout(() => {
      localStorage.removeItem(storagePoint);
    }, 15 * 60 * 1000); // 15 minutes in milliseconds
  }

  // Retrieve the value based on the key
  const storedData = JSON.parse(localStorage.getItem(storagePoint));
  if (storedData) {
    return storedData.value;
  }

  // Return null if the key-value pair doesn't exist
  return null;
}
