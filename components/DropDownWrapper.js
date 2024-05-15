import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { RiArrowDropDownLine } from "react-icons/ri";

const DropdownWrapper = ({ children, Dhead }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownAnimation = useSpring({
    height: showDropdown ? "auto" : "0px",
    opacity: showDropdown ? 1 : 0,
    transform: showDropdown ? "translateY(0)" : "translateY(-10px)",
    config: { mass: 1, tension: 210, friction: 20 },
    onChange: (props) => {
      if (props.opacity === 1 && !showDropdown) {
        setShowDropdown(true);
      } else if (props.opacity === 0 && showDropdown) {
        setShowDropdown(false);
      }
    },
  });

  return (
    <div className="relative max-w-max">
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex flex-row  items-center max-w-max px-4   py-2 bg-gray-300 rounded-md hover:bg-gray-400"
      >
        <button className=" focus:outline-none">{Dhead}</button>
        <RiArrowDropDownLine></RiArrowDropDownLine>
      </div>

      <animated.div
        style={dropdownAnimation}
        className=" absolute z-[100] top-10 left-0 right-0 bg-white border border-gray-300 rounded-md overflow-hidden "
      >
        <div className="flex flex-col justify-center items-center">
          {children}
        </div>
      </animated.div>
    </div>
  );
};

export default DropdownWrapper;
