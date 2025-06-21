import React, { useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import ButtonYellow from "../../ButtonYellow";
import Button from "../../ui/button/Index";

export const Pax = ({ pax, setPax, combo }) => {
  const refDesktop = useRef(null);
  const refMobile = useRef(null);

  const [showPax, setShowPax] = useState(false);
  const [showPaxMobile, setShowPaxMobile] = useState(false);

  const [adults, setAdults] = useState(pax.adults || 1);
  const [children, setChildren] = useState(pax.children || 0);
  const [infants, setInfants] = useState(pax.infants || 0);

 

  const handleMinus = (type) => {
    if (type === "adult" && adults > 1) setAdults((prev) => prev - 1);
    if (type === "children" && children > 0) setChildren((prev) => prev - 1);
    if (type === "infants" && children > 0) setInfants((prev) => prev - 1);
  };

  const handlePlus = (type) => {
    if (type === "adult") setAdults((prev) => prev + 1);
    if (type === "children") setChildren((prev) => prev + 1);
    if (type === "infants") setInfants((prev) => prev + 1);
  };

  const handleDone = () => {
    combo ?  setPax({ 
      adults, 
      children,
      infants,
      number_of_adults: adults,
      number_of_children: children,
      number_of_infants: infants || 0
    }) 
    :
    setPax({ 
      adults, 
      children,
      infants,
      number_of_adults: adults,
      number_of_children: children,
    }) 
    ;
    setShowPax(false);
    setShowPaxMobile(false);
  };

   useEffect(() => {
    const handleClickOutside = (event) => {
      if (refDesktop.current && !refDesktop.current.contains(event.target)) {
        setShowPax(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refMobile.current && !refMobile.current.contains(event.target)) {
        setShowPaxMobile(false);

      }
    };

    if (showPaxMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPaxMobile]);

  return (
    <div className={`relative w-fit h-fit flex flex-row items-center gap-2 rounded-lg cursor-pointer ${combo ?'' :`z-[10]` }`}>
      <div
        onClick={() => {
          setShowPax((prev) => !prev);
        }}
        className="flex items-center bg-[#F5F5F5] px-[16px] py-[8px] rounded-[4px]"
      >
        <div className="text-[10px] md:text-[14px] font-medium">Travellers</div>
        <div className="text-[10px] md:text-[14px] font-medium">&nbsp;|&nbsp;</div>
        <div className="flex">
          <div className="text-[10px] font-medium">
           { combo ? `${adults} A, ${children} C and ${infants} I` :`${adults} Adults and ${children} Children` }
          </div>
          <IoIosArrowDown />
        </div>
      </div>

      {showPax && (
        <div
          ref={refDesktop}
          className="absolute top-full left-2 right-2 bg-white shadow-2xl drop-shadow-3xl p-3 rounded-lg space-y-5 text-sm w-[105%]"
        >
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

          {combo && <div className="flex justify-between gap-1">
            <div>
              <div className="text-[14px] font-medium">Infants</div>
              <div className="text-[10px]"> {`<2 years`}</div>
            </div>
            <div className="flex items-center gap-2 border-2 border-[#E4E4E4] rounded-full px-[10px] py-[5px]">
              <FaMinus
                onClick={() => handleMinus("infants")}
                size={9.33}
                className="cursor-pointer"
                color="#0000EE"
              />
              <div className="text-[12px]">{infants}</div>
              <FaPlus
                onClick={() => handlePlus("infants")}
                size={9.33}
                className="cursor-pointer"
                color="#0000EE"
              />
            </div>
          </div>}

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
              onclick={() => handleDone()}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
