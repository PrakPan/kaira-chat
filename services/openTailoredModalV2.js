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
  const { ["tailored-travel"]: _, ...restQuery } = router.query;

  router.replace(
    {
      pathname: router.pathname,
      query: restQuery,
    },
    undefined,
    { shallow: true, scroll: false }
  );
}

