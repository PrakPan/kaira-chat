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
  router.push(router, undefined, { scroll: false, shallow: true });
}
