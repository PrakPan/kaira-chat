import { useRouter } from "next/router";

export const useHandleClose = () => {
  const router = useRouter();

  return () => {
    router.push(`/itinerary/${router?.query?.id}`, undefined, {
      scroll: false,
    });
  };
};
