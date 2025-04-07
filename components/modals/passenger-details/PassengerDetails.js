import React, { useState } from "react";
import ButtonYellow from "../../ButtonYellow";
import LeadPaxDetails from "./LeadPaxDetails";
import OtherPassengers from "./OtherPassengers";
import { useSelector } from "react-redux";
import Image from "next/image";
const PassengerDetails = () => {
  const itinerary = useSelector((state) => state.Itinerary);

  const [input, setInput] = useState({
    title: "Mr",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    passportNumber: "",
    passportExpiryDate: "",
  });
  const [adults, setAdults] = useState(() =>
    Array.from({ length: itinerary.number_of_adults }, () => ({
      title: "Mr",
      firstName: "",
      lastName: "",
      gender: "",
    }))
  );

  const [children, setChildren] = useState(
    Array.from({ length: itinerary.number_of_adults }, () => ({
      title: "Mr",
      firstName: "",
      lastName: "",
      gender: "",
    }))
  );

  console.log("itinerary passengers are:", itinerary);

  const [page, setPage] = useState(1);

  return (
    <>
      <div className="rounded-[12px] p-[40px] border border-[#F2EDED]">
        {page == 1 && (
          <>
            <LeadPaxDetails input={input} setInput={setInput} />
            <div className="flex justify-end mt-4">
              {itinerary.number_of_adults > 1 ||
              itinerary.number_of_children > 0 ? (
                <ButtonYellow onClick={() => setPage(2)}>Next</ButtonYellow>
              ) : (
                <ButtonYellow>Submit</ButtonYellow>
              )}
            </div>
          </>
        )}
        {page == 2 && (
          <>
            <div id="group-type" className="mb-4">
              <div className="font-medium text-[16px] mb-4">Group Type</div>
              <div className="flex gap-4 ">
                <div id="adult-image" className="flex flex-col items-center relative">
                  <Image
                    src="/couple.svg"
                    width={"41"}
                    height={"41"}
                    alt="adult-svg"
                  />
                  <div className="text-[12px]">Adults</div>
                  <div className="text-[10px] text-[#8E8E8E]">Age: {">"}12years</div>
                <div className="absolute w-4 h-4 flex items-center justify-center rounded-full text-white text-[10px] bg-red-500 -top-2 -right-2">{itinerary?.number_of_adults}</div>
                </div>

                <div id="children-image"  className="flex flex-col items-center relative">
                  <Image
                    src="/children.svg"
                    width={"41"}
                    height={"41"}
                    alt="children-svg"
                  />
                  <div className="text-[12px]">Children</div>
                  <div className="text-[10px] text-[#8E8E8E]">Age: {"<="}12years</div>
                  <div className="absolute w-4 h-4 flex items-center justify-center rounded-full text-white text-[10px] bg-red-500 -top-2 -right-2">{itinerary?.number_of_children}</div>
                </div>

                <div id="infant-image"  className="flex flex-col items-center relative">
                  <Image
                    src="/baby.svg"
                    width={"41"}
                    height={"41"}
                    alt="baby-svg"
                  />
                  <div className="text-[12px]">Infants</div>
                  <div className="text-[10px] text-[#8E8E8E]">Age: 1 to 5 years</div>
                  <div className="absolute w-4 h-4 flex items-center justify-center rounded-full text-white text-[10px] bg-red-500 -top-2 -right-2">{itinerary?.number_of_infants}</div>
                </div>
              </div>
            </div>
            <div className="text-[16px] text-[#8E8E8E] font-medium mb-2 text-black">
              Basic Information of other travellers
            </div>
            {itinerary.number_of_adults.length - 1 > 0 && (
              <>
                <div className="text-[#8E8E8E]">
                  <div className="text-[14px] font-medium">ADULT</div>
                </div>
                {Array.from(
                  { length: itinerary.number_of_adults - 1 },
                  (_, index) => (
                    <OtherPassengers
                      input={adults}
                      setInput={setAdults}
                      index={index}
                    />
                  )
                )}
              </>
            )}

            {itinerary.number_of_children > 0 && (
              <>
                <div className="text-[#8E8E8E]">
                  <div className="text-[14px] font-medium">CHILDREN</div>
                </div>
                {Array.from(
                  { length: itinerary.number_of_children },
                  (_, index) => (
                    <OtherPassengers
                      input={children}
                      setInput={setChildren}
                      index={index}
                    />
                  )
                )}
              </>
            )}
            <div className="flex justify-end mt-4">
              <ButtonYellow>Submit</ButtonYellow>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PassengerDetails;
