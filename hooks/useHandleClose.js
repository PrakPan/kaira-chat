import { useRouter } from "next/router";

export const useHandleClose = () => {
  const router = useRouter();

  return () => {
    router.push(router.pathname, undefined, {
      scroll: false,
    });
  };
};
