const { useState, useEffect } = require("react");

const usePageLoaded = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => setIsLoaded(true), []);
  return isLoaded;
};

export default usePageLoaded;
