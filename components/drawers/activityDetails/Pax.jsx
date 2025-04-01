import React, { useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

export const Pax = ({ setShowPax, pax, setPax, showPax }) => {
  const ref = useRef(null);
  //console.log(pax);
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
   // console.log("pax is:",adults,children)

    setShowPax(false);
  };

  return (
    <div className="relative w-fit h-fit border-2 flex flex-row items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:border-black">
      <IoPerson onClick={() => setShowPax((prev) => !prev)} className="text-2xl" />

      <div
        onClick={() => setShowPax((prev) => !prev)}
        className="flex flex-col"
      >
        <div className="text-sm">Travelers</div>
        <div>
          {adults + children} {adults + children > 1 ? "travelers" : "traveler"}
        </div>
      </div>
      {showPax && (
        <div onClick={handleClose} className="fixed inset-0 z-50">
          <div
            ref={ref}
            className="absolute top-[270px] md:top-[240px] left-2 right-2 md:right-5 md:left-auto bg-neutral-100 shadow-2xl drop-shadow-3xl p-3 rounded-lg space-y-5 text-sm"
          >
            <div className="flex flex-col gap-1">
              <div>Adults (12y +)</div>
              <div className="flex flex-row items-center gap-2">
                <FaMinus
                  onClick={() => handleMinus("adult")}
                  className="cursor-pointer"
                />
                <div className="bg-white px-2 py-1 rounded-md">{adults}</div>
                <FaPlus
                  onClick={() => handlePlus("adult")}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-1">
                <div>Children (2y - 12y)</div>
                <div className="flex flex-row items-center gap-2">
                  <FaMinus
                    onClick={() => handleMinus("children")}
                    className="cursor-pointer"
                  />
                  <div className="bg-white px-2 py-1 rounded-md">
                    {children}
                  </div>
                  <FaPlus
                    onClick={() => handlePlus("children")}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="border-t-2 border-t-white pt-2">
              <button
                onClick={handleDone}
                className="bg-[#F8E000] py-2 px-4 rounded-lg border-2 transition-all border-black hover:bg-black hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
