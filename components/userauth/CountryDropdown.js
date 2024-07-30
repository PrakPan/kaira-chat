import { useEffect, useRef } from "react";

const CountryCodeDropdown = (props) => {
  const ref = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        props.onClose();
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed z-[1900] w-[90%] md:w-[40%] h-[80%] bg-white border-2 rounded-md overflow-auto drop-shadow-2xl shadow-2xl"
    >
      {props.ExtensionOptions}
    </div>
  );
};

export default CountryCodeDropdown;
