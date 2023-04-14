import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

const DropdownWrapper = ({ children }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownAnimation = useSpring({
    height: showDropdown ? 'auto' : '0px',
    opacity: showDropdown ? 1 : 0,
    transform: showDropdown ? 'translateY(0)' : 'translateY(-10px)',
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
    <div className="relative">
      <button
        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Toggle Dropdown
      </button>
      <animated.div
        style={dropdownAnimation}
        className="absolute top-10 left-0 right-0 bg-white border border-gray-300 rounded-md overflow-hidden z-10"
      >
        {children}
      </animated.div>
    </div>
  );
};

export default DropdownWrapper;
