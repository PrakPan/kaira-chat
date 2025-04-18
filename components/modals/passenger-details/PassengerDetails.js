import React, { useState } from "react";
import ButtonYellow from "../../ButtonYellow";
import LeadPaxDetails from "./LeadPaxDetails";
import OtherPassengers from "./OtherPassengers";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Steps from "./steps";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import { openNotification } from "../../../store/actions/notification";
const PassengerDetails = () => {
  const router = useRouter();
  const itinerary = useSelector((state) => state.Itinerary);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    title: "Mr",
    first_name: "",
    last_name: "",
    gender: "male",
    dob: "",
    email: "",
    contact_number: "",
    is_lead: true,
    type: "adult",
    passport_number: "",
    passport_expiry: "",
    passport_issue_date: "",
  });
  const [adults, setAdults] = useState(() =>
    Array.from({ length: itinerary.number_of_adults - 1 }, () => ({
      title: "Mr",
      first_name: "",
      last_name: "",
      gender: "male",
      type: "adult",
      is_lead: false,
    }))
  );

  const [children, setChildren] = useState(
    Array.from({ length: itinerary.number_of_children }, () => ({
      title: "Mr",
      first_name: "",
      last_name: "",
      gender: "",
      type: "child",
      is_lead: false,
    }))
  );

  const [page, setPage] = useState(1);

  const handleSubmit = async () => {
    try {
      await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/reprice/bookings`
      );
      await axios.post(
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/guests/bookings/add/`,
        {
          guests: [input, ...adults, ...children],
        }
      );
      dispatch(openNotification({
        type: "success",
        text: "Passengers Added Successfuly",
        heading: "Success!",
      }))
    } catch (error) {
      dispatch(openNotification({
        type: "error",
        text: `${error.response?.data?.errors[0]?.message[0]}`,
        heading: "Error!",
      }))
    }
  };

  return (
    <>
      <div>
        <Steps
          page={page}
          nextPage={
            itinerary.number_of_adults > 1 || itinerary.number_of_children > 0
          }
        />
      </div>
      <div className="flex justify-center">
        <div className="rounded-[12px] p-[40px] border border-[#F2EDED] max-w-[868px]">
          {page == 1 && (
            <>
              <LeadPaxDetails input={input} setInput={setInput} />
              <div className="flex justify-end mt-4">
                {itinerary.number_of_adults > 1 ||
                itinerary.number_of_children > 0 ? (
                  <ButtonYellow onClick={() => setPage(2)}>Next</ButtonYellow>
                ) : (
                  <ButtonYellow className="!px-[6px]" onClick={handleSubmit}>
                    Submit
                  </ButtonYellow>
                )}
              </div>
            </>
          )}
          {page == 2 && (
            <>
              <div className="text-[24px] font-bold border-b border-gray-200 mb-4">
                Add Traveller Details
              </div>
              <div id="group-type" className="mb-4">
                <div className="font-medium text-[16px] mb-4">Group Type</div>
                <div className="flex gap-4 ">
                  <div
                    id="adult-image"
                    className="flex flex-col items-center relative"
                  >
                    <Image
                      src="/couple.svg"
                      width={"41"}
                      height={"41"}
                      alt="adult-svg"
                    />
                    <div className="text-[12px]">Adults</div>
                    <div className="text-[10px] text-[#8E8E8E]">
                      Age: {">"}12years
                    </div>
                    <div className="absolute w-4 h-4 flex items-center justify-center rounded-full text-white text-[10px] bg-red-500 -top-2 -right-2">
                      {itinerary?.number_of_adults}
                    </div>
                  </div>

                  <div
                    id="children-image"
                    className="flex flex-col items-center relative"
                  >
                    <Image
                      src="/children.svg"
                      width={"41"}
                      height={"41"}
                      alt="children-svg"
                    />
                    <div className="text-[12px]">Children</div>
                    <div className="text-[10px] text-[#8E8E8E]">
                      Age: {"<="}12years
                    </div>
                    <div className="absolute w-4 h-4 flex items-center justify-center rounded-full text-white text-[10px] bg-red-500 -top-2 -right-2">
                      {itinerary?.number_of_children}
                    </div>
                  </div>

                  <div
                    id="infant-image"
                    className="flex flex-col items-center relative"
                  >
                    <Image
                      src="/baby.svg"
                      width={"41"}
                      height={"41"}
                      alt="baby-svg"
                    />
                    <div className="text-[12px]">Infants</div>
                    <div className="text-[10px] text-[#8E8E8E]">
                      Age: 1 to 5 years
                    </div>
                    <div className="absolute w-4 h-4 flex items-center justify-center rounded-full text-white text-[10px] bg-red-500 -top-2 -right-2">
                      {itinerary?.number_of_infants}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[16px] text-[#8E8E8E] font-medium mb-2 text-black">
                Basic Information of other travellers
              </div>
              {itinerary.number_of_adults - 1 > 0 && (
                <>
                  {Array.from(
                    { length: itinerary.number_of_adults - 1 },
                    (_, index) => (
                      <>
                        <div className="text-[#8E8E8E]">
                          <div className="text-[14px] font-medium mb-[12px] mt-[29px]">
                            ADULT {index + 1}
                          </div>
                        </div>
                        <OtherPassengers
                          input={adults}
                          setInput={setAdults}
                          index={index}
                        />
                      </>
                    )
                  )}
                </>
              )}

              {itinerary.number_of_children > 0 && (
                <>
                  {Array.from(
                    { length: itinerary.number_of_children },
                    (_, index) => (
                      <>
                        <div className="text-[#8E8E8E] mt-4">
                          <div className="text-[14px] font-medium  mb-[12px] mt[29px]">
                            CHILD {index + 1}
                          </div>
                        </div>
                        <OtherPassengers
                          input={children}
                          setInput={setChildren}
                          index={index}
                        />
                      </>
                    )
                  )}
                </>
              )}
              <div className="flex justify-end mt-4">
                <ButtonYellow onClick={handleSubmit} primary={true}>
                  Submit
                </ButtonYellow>
              </div>
            </>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default PassengerDetails;
