import { useEffect } from "react";
import { useRouter } from "next/router";

function ScrollRestoration() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const saveScrollPos = (url) => {
      sessionStorage.setItem(`scroll-pos:${url}`, JSON.stringify({ x: window.scrollX, y: window.scrollY }));
    };

    const restoreScrollPos = (url) => {
      const pos = JSON.parse(sessionStorage.getItem(`scroll-pos:${url}`) || "null");
      if (pos) {
        requestAnimationFrame(() => {
          window.scrollTo(pos.x, pos.y);
        });
      }
    };

    router.events.on("routeChangeStart", saveScrollPos);
    router.events.on("routeChangeComplete", restoreScrollPos);

    return () => {
      router.events.off("routeChangeStart", saveScrollPos);
      router.events.off("routeChangeComplete", restoreScrollPos);
    };
  }, [router]);

  return null;
}

export default ScrollRestoration;
