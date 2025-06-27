import React, { useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
<<<<<<< HEAD
import ButtonYellow from "../../ButtonYellow";
import Button from "../../ui/button/Index";

export const Pax = ({ pax, setPax }) => {
  const refDesktop = useRef(null);
  const refMobile = useRef(null);

  const [showPaxDesktop, setShowPaxDesktop] = useState(false);
  const [showPaxMobile, setShowPaxMobile] = useState(false);

=======
import Button from "../../ui/button/Index";

export const Pax = ({ pax, setPax }) => {
  const ref = useRef(null);

  const [showPax, setShowPax] = useState(false);
>>>>>>> d6698f8bec35d092714a44e3d6350afb31b747de
  const [adults, setAdults] = useState(pax.adults || 1);
  const [children, setChildren] = useState(pax.children || 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
<<<<<<< HEAD
      if (refDesktop.current && !refDesktop.current.contains(event.target)) {
        setShowPaxDesktop(false);
      }
    };

    if (showPaxDesktop) {
=======
      if (ref.current && !ref.current.contains(event.target)) {
        setShowPax(false);
      }
    };

    if (showPax) {
>>>>>>> d6698f8bec35d092714a44e3d6350afb31b747de
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
<<<<<<< HEAD
  }, [showPaxDesktop]);

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
=======
  }, [showPax]);
>>>>>>> d6698f8bec35d092714a44e3d6350afb31b747de

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
<<<<<<< HEAD
    setShowPaxDesktop(false);
    setShowPaxMobile(false);
  };

  return (
    <div className=" relative w-fit h-fit flex flex-row items-center gap-2 rounded-lg cursor-pointer z-[10]">
      <div
        onClick={() => {
          if (window.innerWidth >= 583) {
            setShowPaxDesktop((prev) => !prev);
            setShowPaxMobile(false);
          } else {
            setShowPaxMobile((prev) => !prev);
            setShowPaxDesktop(false);
          }
        }}
        className="flex items-center bg-[#F5F5F5] px-[16px] py-[8px] rounded-[4px]"
      >
        <div className="text-[14px] font-medium">Travellers Details</div>
        <div className="text-[14px] font-medium">&nbsp;|&nbsp;</div>
        <div className="flex">
=======
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
>>>>>>> d6698f8bec35d092714a44e3d6350afb31b747de
          <div className="text-[10px] font-medium">
            {adults} Adults and {children} Children
          </div>
          <IoIosArrowDown />
        </div>
      </div>

<<<<<<< HEAD
      {showPaxDesktop && (
        <div
          ref={refDesktop}
          className="absolute top-full left-2 right-2 md:right-5 md:left-auto bg-white shadow-2xl drop-shadow-3xl p-3 rounded-lg space-y-5 text-sm w-[241px] max-[583px]:hidden"
        >
=======
      {showPax && (
        <div
          ref={ref}
          className="absolute top-full left-2 right-2 md:right-5 md:left-auto bg-white shadow-2xl drop-shadow-3xl p-3 rounded-lg space-y-5 text-sm w-[241px]"
        >
          {/* Adults */}
>>>>>>> d6698f8bec35d092714a44e3d6350afb31b747de
          <div className="flex justify-between gap-1 w-full">
            <div>
              <div className="text-[14px] font-medium">Adults</div>
              <div className="text-[10px]">12+ Years</div>
            </div>
            <div className="flex items-center gap-2 border-2 border-[#E4E4E4] rounded-full px-[10px] py-[5px]">
<<<<<<< HEAD
              <FaMinus onClick={() => handleMinus("adult")} size={9.33} className="cursor-pointer" color="#0000EE" />
              <div className="text-[12px]">{adults}</div>
              <FaPlus onClick={() => handlePlus("adult")} size={9.33} className="cursor-pointer" color="#0000EE" />
            </div>
          </div>

=======
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
>>>>>>> d6698f8bec35d092714a44e3d6350afb31b747de
          <div className="flex justify-between gap-1">
            <div>
              <div className="text-[14px] font-medium">Children</div>
              <div className="text-[10px]">0-12 Years</div>
            </div>
            <div className="flex items-center gap-2 border-2 border-[#E4E4E4] rounded-full px-[10px] py-[5px]">
<<<<<<< HEAD
              <FaMinus onClick={() => handleMinus("children")} size={9.33} className="cursor-pointer" color="#0000EE" />
              <div className="text-[12px]">{children}</div>
              <FaPlus onClick={() => handlePlus("children")} size={9.33} className="cursor-pointer" color="#0000EE" />
            </div>
          </div>

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

      {showPaxMobile && (
        <div
          ref={refMobile}
          className="min-[583px]:hidden fixed bottom-0 bg-white w-full px-[15px] py-[16px] flex flex-col gap-2"
        >
          <div className="font-[14px] font-semibold border-b-[1px] border-black">Travellers Details</div>

          <div className="flex justify-between gap-1 w-full">
            <div>
              <div className="text-[14px] font-medium">Adults</div>
              <div className="text-[10px]">12+ Years</div>
            </div>
            <div className="flex items-center gap-2 border-2 border-[#E4E4E4] rounded-full px-[10px] py-[5px]">
              <FaMinus onClick={() => handleMinus("adult")} size={9.33} className="cursor-pointer" color="#0000EE" />
              <div className="text-[12px]">{adults}</div>
              <FaPlus onClick={() => handlePlus("adult")} size={9.33} className="cursor-pointer" color="#0000EE" />
            </div>
          </div>

          <div className="flex justify-between gap-1">
            <div>
              <div className="text-[14px] font-medium">Children</div>
              <div className="text-[10px]">0-12 Years</div>
            </div>
            <div className="flex items-center gap-2 border-2 border-[#E4E4E4] rounded-full px-[10px] py-[5px]">
              <FaMinus onClick={() => handleMinus("children")} size={9.33} className="cursor-pointer" color="#0000EE" />
              <div className="text-[12px]">{children}</div>
              <FaPlus onClick={() => handlePlus("children")} size={9.33} className="cursor-pointer" color="#0000EE" />
            </div>
          </div>

          <div className="flex gap-2">
            <button className="w-full border-2 border-black rounded-lg" onClick={() => setShowPaxMobile(false)}>
              Cancel
            </button>
            <button
              onClick={handleDone}
              className="bg-black text-white py-2 px-4 rounded-lg border-2 transition-all border-black w-full"
            >
              Submit
            </button>
=======
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
>>>>>>> d6698f8bec35d092714a44e3d6350afb31b747de
          </div>
        </div>
      )}
    </div>
  );
};
