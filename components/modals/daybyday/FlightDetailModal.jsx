import React from "react";
import { Logo } from "../flights/new-flight-searched/LogoContainer";
import { Heading, Text } from "../flights/SectionOne";
import { IoMdClose } from "react-icons/io";
import { FlightSegment } from "../../../containers/itinerary/TransfersContainer/FlightDetail";

const FlightDetailModal = ({ segments ,fareRule,setShowDetails,name}) => {
    const fareRules=fareRule?.fareRuleDetail
    const fareRulesLoading=false
  
    return (
      <div className="relative flex flex-col gap-4 bg-gray-100 p-2 rounded-md">
        <div className="flex flex-col gap-2">
          <Heading>
            <div className="flex flex-row items-center gap-2">
              <IoMdClose
                className="hover-pointer"
                onClick={() => setShowDetails((prev) => !prev)}
                style={{ fontSize: "2rem" }}
              ></IoMdClose>
              <Text>Back To Itinerary</Text>
            </div>
          </Heading>
        </div>
        <div className="font-[Poppins] text-[32px] font-[700] flex gap-2 items-center bg-gray-100 p-2">
              {name}
            </div>
        <div className="flex flex-col gap-2">
          <div className="w-fit py-2 text-lg font-bold">Flight Details</div>
  
          <FlightSegment segments={segments} />
        </div>
  
        {fareRulesLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-4 border-t-[#F8E000] rounded-full animate-spin"></div>
          </div>
        )  : (
          <div className="flex flex-col">
            <div className="w-fit py-2 mb-2 text-lg font-bold">
              Fare Details and Rules
            </div>
  
            <div
              dangerouslySetInnerHTML={{
                __html: fareRules,
              }}
              className="flex flex-col gap-1 text-sm"
            ></div>
          </div>
        )}
      </div>
    );
  };
  
  
export default FlightDetailModal