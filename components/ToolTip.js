import React from "react";
import { useHover } from "../hooks/useHover";
import { useIntersectionObserver } from "../Hooks/useIntersection";
import { useWindowSize } from "../Hooks/useWindowSize";

const ToolTip = ({ children, data }) => {
  const [hoverRef, isHovered] = useHover();
  const { width, height } = useWindowSize();
  const [position, setRef] = useIntersectionObserver({
    threshold: [0, 0.5, 1],
  });

  return (
    <div className="relative" ref={hoverRef}>
      <div>
        {children}

        {true && (
          <div className="absolute z-30" ref={setRef}>
            <div
              className={`bg-white w-96 ${
                position.y > height - 180 && "-mt-56"
              }   m-2 p-4 drop-shadow-md`}
            >
              <div className="">
                <div className="text-lg">{data}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolTip;
