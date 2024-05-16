export default function openTailoredModal(router, page_id, destination) {
  if (page_id && destination)
    router.replace(
      {
        query: {
          ...router.query,
          "tailored-travel": true,
          page_id: page_id,
          destination: destination,
        },
      },
      undefined,
      { scroll: false }
    );
  else
    router.replace(
      {
        query: { ...router.query, "tailored-travel": true },
      },
      undefined,
      { scroll: false }
    );

  // else console.log(router , 'routerrouter')
}

export function closeTailoredModal(router, id) {
  delete router.query["tailored-travel"];
  delete router.query["page_id"];
  delete router.query["destination"];
  router.push(`/itinerary/${id}`, undefined, { scroll: false });
}
