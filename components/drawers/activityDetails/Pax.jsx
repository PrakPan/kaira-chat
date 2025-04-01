import React, { useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoPerson } from "react-icons/io5";

export const Pax = ({ setShowPax, pax, setPax, showPax }) => {
  const ref = useRef(null);
  const [adults, setAdults] = useState(pax.adults ? pax.adults : 1);
  const [children, setChildren] = useState(pax.children ? pax.children : 0);

  const handleMinus = (type) => {
    switch (type) {
      case "adult":
        setAdults((prev) => {
          if (prev > 1) {
            return prev - 1;
          }
          return prev;
        });
        break;
      case "children":
        setChildren((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        });
        break;
      default:
        break;
    }
  };

  const handlePlus = (type) => {
    switch (type) {
      case "adult":
        setAdults((prev) => prev + 1);
        break;
      case "children":
        setChildren((prev) => prev + 1);
        break;
      default:
        break;
    }
  };

  const handleClose = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setShowPax(false);
    }
  };

  const handleDone = () => {
    setPax((prev) => ({
      ...prev,
      adults,
      children,
    }));

    setShowPax(false);
  };

  return (
    <div>
      <div className="font-[poppins] relative w-fit h-fit flex flex-row items-center gap-2 rounded-lg cursor-pointer ">
        <div
          onClick={() => setShowPax((prev) => !prev)}
          className="flex items-center bg-[#F5F5F5] px-[16px] py-[8px] rounded-[4px]"
        >
          <div className="text-[14px] font-medium">Travellers Details</div>
          <div className="text-[14px] font-medium">&nbsp;|&nbsp;</div>
          <div className="flex">
            <div className="text-[10px] font-medium">
              {adults} Adults and {children} Children
            </div>
            <IoIosArrowDown />
          </div>
        </div>

        {showPax && (
          <>
            <div onClick={handleClose}>
              <div
                ref={ref}
                className="absolute top-full left-2 right-2 md:right-5 md:left-auto bg-white shadow-2xl drop-shadow-3xl p-3 rounded-lg space-y-5 text-sm  w-[241px] max-[583px]:hidden"
              >
                <div className=" ">
                  <div className="flex justify-between gap-1 w-full">
                    <div>
                      <div className="text-[14px] font-medium">Adults</div>
                      <div className="text-[10px]">12+ Years</div>{" "}
                    </div>
                    <div className="flex flex-row items-center gap-2 border-2 border-[#E4E4E4] rounded-full rounded-full px-[10px] py-[5px]">
                      <FaMinus
                        onClick={() => handleMinus("adult")}
                        className="cursor-pointer"
                        size={9.33}
                        color="#0000EE"
                      />
                      <div className="text-[12px] px-2 py-1 rounded-md">
                        {adults}
                      </div>
                      <FaPlus
                        onClick={() => handlePlus("adult")}
                        className="cursor-pointer"
                        size={9.33}
                        color="#0000EE"
                      />
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className="flex justify-between gap-1">
                    <div>
                      <div className="text-[14px] font-medium">Children</div>
                      <div className="text-[10px]">0-12 Years</div>
                    </div>
                    <div className="flex flex-row items-center gap-2 border-2 border-[#E4E4E4] rounded-full px-[10px] py-[5px]">
                      <FaMinus
                        onClick={() => handleMinus("children")}
                        className="cursor-pointer"
                        size={9.33}
                        color="#0000EE"
                      />
                      <div className=" px-2 py-1 rounded-md text-[12px]">
                        {children}
                      </div>
                      <FaPlus
                        onClick={() => handlePlus("children")}
                        className="cursor-pointer"
                        size={9.33}
                        color="#0000EE"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-t-white pt-2 flex justify-end">
                  <button
                    onClick={handleDone}
                    className="bg-black text-white py-2 px-4 rounded-lg border-2 transition-all border-black  hover:text-white w-full"
                    >
                    Submit
                  </button>
                </div>
              </div>
            </div>

            <div
              ref={ref}
              className="min-[583px]:hidden fixed bottom-0 bg-white w-full px-[15px] py-[16px] flex flex-col gap-2"
              autoFocus
              tabIndex={-1}
            >
              <div className="font-[14px] font-semibold border-b-[1px] border-black">
                Travellers Details
              </div>
              <div className="flex justify-between gap-1 w-full">
                <div>
                  <div className="text-[14px] font-medium">Adults</div>
                  <div className="text-[10px]">12+ Years</div>{" "}
                </div>
                <div className="flex flex-row items-center gap-2 border-2 border-[#E4E4E4] rounded-full rounded-full px-[10px] py-[5px]">
                  <FaMinus
                    onClick={() => handleMinus("adult")}
                    className="cursor-pointer"
                    size={9.33}
                    color="#0000EE"
                  />
                  <div className="text-[12px] px-2 py-1 rounded-md">
                    {adults}
                  </div>
                  <FaPlus
                    onClick={() => handlePlus("adult")}
                    className="cursor-pointer"
                    size={9.33}
                    color="#0000EE"
                  />
                </div>
              </div>

              <div className="">
                <div className="flex justify-between gap-1">
                  <div>
                    <div className="text-[14px] font-medium">Children</div>
                    <div className="text-[10px]">0-12 Years</div>
                  </div>
                  <div className="flex flex-row items-center gap-2 border-2 border-[#E4E4E4] rounded-full px-[10px] py-[5px]">
                    <FaMinus
                      onClick={() => handleMinus("children")}
                      className="cursor-pointer"
                      size={9.33}
                      color="#0000EE"
                    />
                    <div className=" px-2 py-1 rounded-md text-[12px]">
                      {children}
                    </div>
                    <FaPlus
                      onClick={() => handlePlus("children")}
                      className="cursor-pointer"
                      size={9.33}
                      color="#0000EE"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="w-full border-2 border-black rounded-lg"
                  onClick={() => setShowPax(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDone}
                  className="bg-black text-white py-2 px-4 rounded-lg border-2 transition-all border-black  hover:text-white w-full"
                >
                  Submit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
