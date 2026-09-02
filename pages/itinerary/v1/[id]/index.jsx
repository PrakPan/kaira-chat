import { useEffect } from "react";
import { useRouter } from "next/router";

// Archived V1 itineraries render through the same view as everything else now.
//
// This page used to mount the retired V1 layout (IndexsV2/Index -> ArchiveMenuV1).
// The archive was exported straight out of Mercury's own itinerary structure, so
// once the few dropped fields are filled back in (lib/v1Itinerary ->
// adaptV1ToMercuryShape) it renders in the normal /chat view — ItineraryContainer
// picks the archive up whenever Mercury reports the itinerary as version "v1".
//
// Redirecting rather than mounting the chat shell here keeps one implementation
// of that screen instead of two that can drift, and matches what
// pages/itinerary/[id]/index.js already does. Links customers already hold keep
// working; they just land on /chat/<id>.
const ItineraryV1 = () => {
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

export default ItineraryV1;
