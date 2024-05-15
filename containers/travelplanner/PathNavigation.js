import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IoMdArrowDropright } from "react-icons/io";
import media from "../../components/media";

export default function PathNavigation(props) {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [link, setlink] = useState([]);

  useEffect(() => {
    setlink(props?.path?.split("/"));
  }, [props?.path]);

  const pathHanlder = async (e) => {
    if (e.target.id === "destinations") {
      await router.push("/destinations");
    } else {
      let path = "";
      for (let i = 0; i <= e.target.id; i++) {
        path += "/" + link[i];
      }

      await router.push(path);
    }
  };

  const capitalizeFirstLetter = (string) => {
    const words = string.split("_");
    const newString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return newString;
  };

  return (
    <div className={`${!isPageWide && "ml-3"} mt-[3.5rem] text-sm text-blue`}>
      {link && link.length ? (
        <>
          <span>
            <span
              id={"destinations"}
              onClick={pathHanlder}
              className="cursor-pointer hover:underline"
            >
              All Destinations
            </span>
            <IoMdArrowDropright className="inline" />
          </span>
          {link.map((value, index) => (
            <span key={index}>
              <span
                id={index}
                onClick={pathHanlder}
                className="cursor-pointer hover:underline"
              >
                {capitalizeFirstLetter(value)}
              </span>
              {index < link.length - 1 && (
                <IoMdArrowDropright className="inline" />
              )}
            </span>
          ))}
        </>
      ) : null}
    </div>
  );
}
