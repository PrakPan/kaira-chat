import { useState, useEffect } from "react";

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    const updateMatches = () => {
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
    };

    updateMatches();

    const listener = () => {
      updateMatches();
    };

    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query, matches]);

  return matches;
}
