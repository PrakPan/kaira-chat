import DateComponent from "./DateComponent";
import { useState } from "react";
import { useSelector } from "react-redux";
import EnterPassenger from "../tailoredform/slidetwo/EnterPassenger";
import Pax from "../tailoredform/slidetwo/pax/Pax";
import Preferences from "../tailoredform/slidetwo/preferences/Index";
import Buttons from "./Buttons";
import useMediaQuery from "../../hooks/useMedia";
const Settings = ({setShowSettings, isHotelsPresent,handleApply}) => {
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [roomConfiguration, setRoomConfiguration] = useState(
    useSelector((state) => state.Itinerary?.hotels_config?.room_configuration)
  );
  const [numberOfAdults, setNumberOfAdults] = useState(
    useSelector((state) => state.Itinerary.number_of_adults)
  );
  const [numberOfChildren, setNumberOfChildren] = useState(
    useSelector((state) => state.Itinerary.number_of_children)
  );
  const [numberOfInfants, setNumberOfInfants] = useState(
    useSelector((state) => state.Itinerary.number_of_infants)
  );
  const [selectedPreferences, setSelectedPreferences] = useState(
    useSelector((state) => state.Itinerary.selected_preferences)||[]
  );
  const handleSetSelectedPreferences=(preference)=>{
    if(selectedPreferences.includes(preference)){
      setSelectedPreferences(selectedPreferences.filter((p) => p !== preference));
    }
    else{
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  }
  const startDateString = useSelector((state)=>state.Itinerary.start_date);
  const endDateString = useSelector((state)=>state.Itinerary.end_date);

  const [date, setDate] = useState({
    type: "fixed",
    start_date: startDateString ? new Date(startDateString) : null,
    end_date: endDateString ? new Date(endDateString) : null,
    month: "",
    duration: ""
  });

  const handleApplyDates = (dates) => {
    setDate({
      ...date,
      start_date: dates.start,
      end_date: dates.end
    });
  }
  const handleCancel = () => {
    setShowSettings(false);
  }
  const handleUpdate = () => {
    const req={
      date:{
      start_date:date.start_date.toISOString().split("T")[0],
      end_date:date.end_date.toISOString().split("T")[0],
      },
      passengers:{
        number_of_adults:numberOfAdults,
        number_of_children:numberOfChildren,
        number_of_infants:numberOfInfants,
      },
      room_configuration:roomConfiguration,
      selected_preferences:selectedPreferences,
      }
      handleApply(req);
    }
  
  return (
    <div
      className={`flex flex-col gap-[24px] md:max-w-[537px]`}
    >
      <div className="Heading1SB font-semibold">Edit Your Trips Details</div>

      <DateComponent settings={true} handleApplyDates={handleApplyDates} setDate={setDate} date={date}/>

      {!isHotelsPresent ? (
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
          settings={true}
        />
      ) : (
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
      )}
      <div>
        <div className="Body1M_16">Choose your experience</div>
        <div className="mt-[12px]">
          <Preferences
            tailoredFormModal={false}
            selectedPreferences={selectedPreferences}
            setSelectedPreferences={handleSetSelectedPreferences}
          ></Preferences>
        </div>
      </div>

      <div className={`${isDesktop ? "flex justify-end" : "w-full"}`}>
        <Buttons handleCancel={handleCancel} handleUpdate={handleUpdate} />
      </div>
    </div>
  );
};

export default Settings;
