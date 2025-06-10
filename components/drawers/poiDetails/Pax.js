import React, { useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Button from "../../ui/button/Index";

export const Pax = ({ pax, setPax }) => {
  const ref = useRef(null);

  const [showPax, setShowPax] = useState(false);
  const [adults, setAdults] = useState(pax.adults || 1);
  const [children, setChildren] = useState(pax.children || 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowPax(false);
      }
    };

    if (showPax) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPax]);

  const handleMinus = (type) => {
    if (type === "adult" && adults > 1) setAdults((prev) => prev - 1);
    if (type === "children" && children > 0) setChildren((prev) => prev - 1);
  };

  const handlePlus = (type) => {
    if (type === "adult") setAdults((prev) => prev + 1);
    if (type === "children") setChildren((prev) => prev + 1);
  };

  const handleDone = () => {
    setPax({ adults, children });
    setShowPax(false);
  };

  return (
    <div className="relative w-fit h-fit flex flex-row items-center gap-2 rounded-lg cursor-pointer z-[10]">
      <div
        onClick={() => setShowPax((prev) => !prev)}
        className="flex items-center bg-[#F5F5F5] px-[16px] py-[8px] rounded-[4px]"
      >
        <div className="text-[10px] md:text-[14px] font-medium">Travellers Details</div>
        <div className="text-[10px] md:text-[14px] font-medium">&nbsp;|&nbsp;</div>
        <div className="flex items-center gap-1">
          <div className="text-[10px] font-medium">
            {adults} Adults and {children} Children
          </div>
          <IoIosArrowDown />
        </div>
      </div>

      {showPax && (
        <div
          ref={ref}
          className="absolute top-full left-2 right-2 md:right-5 md:left-auto bg-white shadow-2xl drop-shadow-3xl p-3 rounded-lg space-y-5 text-sm w-[241px]"
        >
          {/* Adults */}
          <div className="flex justify-between gap-1 w-full">
            <div>
              <div className="text-[14px] font-medium">Adults</div>
              <div className="text-[10px]">12+ Years</div>
            </div>
            <div className="flex items-center gap-2 border-2 border-[#E4E4E4] rounded-full px-[10px] py-[5px]">
              <FaMinus
                onClick={() => handleMinus("adult")}
                size={9.33}
                className="cursor-pointer"
                color="#0000EE"
              />
              <div className="text-[12px]">{adults}</div>
              <FaPlus
                onClick={() => handlePlus("adult")}
                size={9.33}
                className="cursor-pointer"
                color="#0000EE"
              />
            </div>
          </div>

          {/* Children */}
          <div className="flex justify-between gap-1">
            <div>
              <div className="text-[14px] font-medium">Children</div>
              <div className="text-[10px]">0-12 Years</div>
            </div>
            <div className="flex items-center gap-2 border-2 border-[#E4E4E4] rounded-full px-[10px] py-[5px]">
              <FaMinus
                onClick={() => handleMinus("children")}
                size={9.33}
                className="cursor-pointer"
                color="#0000EE"
              />
              <div className="text-[12px]">{children}</div>
              <FaPlus
                onClick={() => handlePlus("children")}
                size={9.33}
                className="cursor-pointer"
                color="#0000EE"
              />
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-4 flex justify-end">
            <Button
              fontSize="1rem"
              width={"auto"}
              padding="0.5rem 2rem"
              fontWeight="500"
              margin="0"
              borderRadius="5px"
              borderWidth="1px"
              bgColor="#f7e700"
              onclick={handleDone}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
