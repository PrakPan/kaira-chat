export default function openTailoredModal(router, page_id, destination, type) {
  if (page_id && destination && type) {
    router.replace(
      {
        query: {
          ...router.query,
          "tailored-travel": true,
          page_id: page_id,
          destination: destination,
          type: type,
        },
      },
      undefined,
      { scroll: false, shallow: true }
    );
  } else if (page_id && destination) {
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
      { scroll: false, shallow: true }
    );
  } else {
    router.replace(
      {
        query: { ...router.query, "tailored-travel": true },
      },
      undefined,
      { scroll: false, shallow: true }
    );
  }
}

export function closeTailoredModal(router) {
  delete router.query["tailored-travel"];
  delete router.query["page_id"];
  delete router.query["destination"];
  // Don't delete the type parameter as it's needed for dynamic route interpolation
  // router?.query["type"] && delete router.query["type"]
  
  // Use the asPath to preserve the actual URL structure
  const cleanPath = router.asPath.split('?')[0]; // Remove query parameters
  router.push(cleanPath, undefined, { scroll: false, shallow: true });
}
