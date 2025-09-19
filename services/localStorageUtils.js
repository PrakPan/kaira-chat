export function setWithExpiry(key, value, ttl) {
  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };

  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) {
    return null;
  }

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (e) {
    return null;
  }
}


export function cleanExpiredLocalStorage() {
  if (typeof window === 'undefined') return; 

  Object.keys(localStorage).forEach((key) => {
    const itemStr = localStorage.getItem(key);
    try {
      const item = JSON.parse(itemStr);
      if (item && item.expiry && new Date().getTime() > item.expiry) {
        localStorage.removeItem(key);
      }
    } catch (e) {
    }
  });
}

