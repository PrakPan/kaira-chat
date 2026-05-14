import { useEffect } from "react";
import { useRouter } from "next/router";

const Itinerary = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const { id, ...rest } = router.query;
    if (id) {
      router.replace({ pathname: `/chat/${id}`, query: rest });
    }
  }, [router.isReady, router.query.id]);

  return null;
};

export default Itinerary;
