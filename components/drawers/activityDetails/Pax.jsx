import React, { useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import ButtonYellow from "../../ButtonYellow";
import Button from "../../ui/button/Index";

export const Pax = ({ pax, setPax, combo,limit=null }) => {
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
    if (type === "adult") {
    if (!limit || adults < limit) {
      setAdults((prev) => prev + 1);
    }
  }
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
    <div className={`relative w-full h-fit flex flex-row items-center justify-between rounded-lg cursor-pointer ${combo ?'z-[14]' :`z-[14]` }`}>
      <div
        onClick={() => {
          setShowPax((prev) => !prev);
        }}
       className="flex items-center w-full bg-[#F9F9F9] py-[0.7rem] px-4 rounded-lg justify-between"
      >
        
        <div className="flex flex-row items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="12" viewBox="0 0 17 12" fill="none">
  <path d="M11.7524 6.8475C12.7799 7.545 13.4999 8.49 13.4999 9.75V12H16.4999V9.75C16.4999 8.115 13.8224 7.1475 11.7524 6.8475Z" fill="#ACACAC"/>
  <path d="M10.4999 6C12.1574 6 13.4999 4.6575 13.4999 3C13.4999 1.3425 12.1574 0 10.4999 0C10.1474 0 9.81744 0.0749998 9.50244 0.18C10.1249 0.9525 10.4999 1.935 10.4999 3C10.4999 4.065 10.1249 5.0475 9.50244 5.82C9.81744 5.925 10.1474 6 10.4999 6Z" fill="#ACACAC"/>
  <path d="M6 6C7.6575 6 9 4.6575 9 3C9 1.3425 7.6575 0 6 0C4.3425 0 3 1.3425 3 3C3 4.6575 4.3425 6 6 6ZM6 1.5C6.825 1.5 7.5 2.175 7.5 3C7.5 3.825 6.825 4.5 6 4.5C5.175 4.5 4.5 3.825 4.5 3C4.5 2.175 5.175 1.5 6 1.5Z" fill="#ACACAC"/>
  <path d="M6 6.75C3.9975 6.75 0 7.755 0 9.75V12H12V9.75C12 7.755 8.0025 6.75 6 6.75ZM10.5 10.5H1.5V9.7575C1.65 9.2175 3.975 8.25 6 8.25C8.025 8.25 10.35 9.2175 10.5 9.75V10.5Z" fill="#ACACAC"/>
</svg>
        <div className="text-sm text-[#212529] font-400 max-ph:hidden">Travellers</div>
        <div className="text-sm text-[#212529] font-400">&nbsp;|&nbsp;</div>
        <div className="flex">
          <div className="text-sm text-[#212529] font-400">
           {`${adults} Adults`}
            {/* , ${children} C and ${infants} I` :`${adults} Adults and ${children} Children` } */}
          
          </div>
          
        </div>
        </div>

        <IoIosArrowDown  />
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
