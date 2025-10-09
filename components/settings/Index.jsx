import DateComponent from "./DateComponent";
import { useState } from "react";
import { useSelector } from "react-redux";
import EnterPassenger from "../tailoredform/slidetwo/EnterPassenger";
import Pax from "../tailoredform/slidetwo/pax/Pax";
import Preferences from "../tailoredform/slidetwo/preferences/Index";
import Buttons from "./Buttons";
import useMediaQuery from "../../hooks/useMedia";
const Settings = () => {
    const isDesktop = useMediaQuery("(min-width:767px)");
    const [roomConfiguration,setRoomConfiguration] = useState(useSelector((state) => state.Itinerary.hotels_config.room_configuration));
    const [numberOfAdults,setNumberOfAdults] = useState(useSelector((state) => state.Itinerary.number_of_adults));
    const [numberOfChildren,setNumberOfChildren] = useState(useSelector((state) => state.Itinerary.number_of_children));
    const [numberOfInfants,setNumberOfInfants] = useState(useSelector((state) => state.Itinerary.number_of_infants));
    const [selectedPreferences,setSelectedPreferences] = useState(useSelector((state) => state.Itinerary.selected_preferences));
  return (
    <div className={`flex flex-col gap-[24px] max-w-[537px] p-[20px] ${isDesktop ? 'max-w-[537px]' : 'max-w-[100%]'}`}>

        <div className="Heading2SB font-semibold">Edit Your Trips Details</div>

        <DateComponent />

        <EnterPassenger 
        roomConfiguration={roomConfiguration}
        setRoomConfiguration={setRoomConfiguration}
        groupType={useSelector((state) => state.Itinerary.group_type)}
        numberOfAdults={numberOfAdults}
        numberOfChildren={numberOfChildren}
        numberOfInfants={numberOfInfants}
        setNumberOfAdults={setNumberOfAdults}
        setNumberOfChildren={setNumberOfChildren}
        setNumberOfInfants={setNumberOfInfants}
        />

         <div>
        <div className="Body2R_14 mb-[8px]">Room Configuration</div>
        <Pax
          numberOfAdults={numberOfAdults}
          setNumberOfAdults={setNumberOfAdults}
          numberOfChildren={numberOfChildren}
          setNumberOfChildren={setNumberOfChildren}
          numberOfInfants={numberOfInfants}
          setNumberOfInfants={setNumberOfInfants}
          roomConfiguration={roomConfiguration}
          setRoomConfiguration={setRoomConfiguration}
          groupType={useSelector((state) => state.Itinerary.group_type)}
        />
      </div>

      <div>
      <div className="Body1M_16">Choose your experience</div>
        <div className="mt-[12px]">
          <Preferences
            tailoredFormModal={false}
            selectedPreferences={selectedPreferences}
            setSelectedPreferences={setSelectedPreferences}
          ></Preferences>
        </div>
      </div>

      <div className="flex justify-end">
        <Buttons />
      </div>
    </div>
  )
}

export default Settings