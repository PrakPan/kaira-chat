import DateComponent from "./DateComponent";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EnterPassenger from "../tailoredform/slidetwo/EnterPassenger";
import Pax from "../tailoredform/slidetwo/pax/Pax";
import Preferences from "../tailoredform/slidetwo/preferences/Index";
import Buttons from "./Buttons";
import useMediaQuery from "../../hooks/useMedia";
import { useDispatch } from "react-redux";
import setItinerary  from "../../store/actions/itinerary";
import { openNotification } from "../../store/actions/notification";

const Settings = ({setShowSettings, isHotelsPresent, handleApply}) => {
  const dispatch = useDispatch();
  const itinerary = useSelector(state => state.Itinerary);
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize states with values from itinerary
  const [addHotels, setAddHotels] = useState(itinerary?.add_hotels ?? isHotelsPresent);
  const [addFlights, setAddFlights] = useState(itinerary?.add_flights ?? false);
  const [addActivityTransfers, setAddActivityTransfers] = useState(
    itinerary?.add_transfers_and_activities ?? false
  );
  
  const [roomConfiguration, setRoomConfiguration] = useState(
    itinerary?.hotels_config?.room_configuration || []
  );
  
  const [numberOfAdults, setNumberOfAdults] = useState(
    itinerary?.number_of_adults || 1
  );
  
  const [numberOfChildren, setNumberOfChildren] = useState(
    itinerary?.number_of_children || 0
  );
  
  const [numberOfInfants, setNumberOfInfants] = useState(
    itinerary?.number_of_infants || 0
  );

  const selectedPreferencesItinerary = useSelector(
      (state) => state.tailoredInfoReducer.slideOne.selectedPreferences
    ) || [];
  
  const [selectedPreferences, setSelectedPreferences] = useState(
    itinerary?.experience_filters || selectedPreferencesItinerary || []
  );

  // Initialize dates
  const [date, setDate] = useState({
    type: "fixed",
    start_date: itinerary?.start_date ? new Date(itinerary.start_date) : null,
    end_date: itinerary?.end_date ? new Date(itinerary.end_date) : null,
    month: "",
    duration: ""
  });

  // Update states if itinerary changes
  useEffect(() => {
    if (itinerary) {
      setAddHotels(itinerary?.add_hotels ?? isHotelsPresent);
      setAddFlights(itinerary?.add_flights ?? false);
      setAddActivityTransfers(itinerary?.add_transfers_and_activities ?? false);
      setRoomConfiguration(itinerary?.hotels_config?.room_configuration || []);
      setNumberOfAdults(itinerary?.number_of_adults || 1);
      setNumberOfChildren(itinerary?.number_of_children || 0);
      setNumberOfInfants(itinerary?.number_of_infants || 0);
      setSelectedPreferences(itinerary?.experience_filters || []);
      
      if (itinerary?.start_date && itinerary?.end_date) {
        setDate({
          type: "fixed",
          start_date: new Date(itinerary.start_date),
          end_date: new Date(itinerary.end_date),
          month: "",
          duration: ""
        });
      }
    }
  }, [itinerary, isHotelsPresent]);

  const handleSetSelectedPreferences = (preference) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  }

const handleApplyDates = (dates) => {
  setDate({
    type: dates.dateType || dates.type, 
    start_date: dates.start ? new Date(dates.start) : null, 
    end_date: dates.end ? new Date(dates.end) : null,
    month: dates.month || "",
    duration: dates.duration || ""
  });
};





  const handleCancel = () => {
    setShowSettings(false);
  }

  const handleUpdate = () => {
    setIsLoading(true);
    const req = {
      date: {
        start_date: date.start_date.toISOString().split("T")[0],
        end_date: date.end_date.toISOString().split("T")[0],
      },
      passengers: {
        number_of_adults: numberOfAdults,
        number_of_children: numberOfChildren,
        number_of_infants: numberOfInfants,
      },
      add_hotels: addHotels,
      add_flights: addFlights,
      add_transfers_and_activities: addActivityTransfers,
      room_configuration: roomConfiguration,
      experience_filters: selectedPreferences,
    }

    
    handleApply(req)
      .then((res) => {
        dispatch(openNotification({
          type: "success",
          text: "Itinerary updated successfully",
          heading: "Success!",
        }));
        setShowSettings(false); // Close settings after successful update
      })
      .catch((err) => {
        console.log("error is:", err);
        dispatch(openNotification({
          type: "error",
          text: "Something went wrong",
          heading: "Error!",
        }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className={`flex flex-col gap-[24px] md:max-w-[537px]`}>
      <div className="Heading1SB font-semibold">Update Your Trip Preferences</div>

      <DateComponent 
        settings={true} 
        handleApplyDates={handleApplyDates} 
        setDate={setDate} 
        date={date}
      />

      <div>
        <div className="Body1M_16 mb-[12px]">Pick Your Inclusions</div>
        <div className="grid grid-cols-3 justify-between items-center">

           <label
            htmlFor="add-activities-transfers"
            className="flex items-center gap-2 p-2 rounded-md w-fit cursor-pointer"
          >
            <input
              id="add-activities-transfers"
              type="checkbox"
              checked={addActivityTransfers}
              onChange={(e) => setAddActivityTransfers(e.target.checked)}
              className="focus:outline-none cursor-pointer"
            />
            <div className="Body2R_14">Activities & Transfers</div>
          </label>


          <label
            htmlFor="add-flights"
            className="flex items-center gap-2 p-2 rounded-md w-fit cursor-pointer justify-self-center"
          >
            <input
              id="add-flights"
              type="checkbox"
              checked={addFlights}
              onChange={(e) => setAddFlights(e.target.checked)}
              className="focus:outline-none cursor-pointer"
            />
            <div className="Body2R_14">Flights</div>
          </label>


          <label
            htmlFor="add-hotels"
            className="flex items-center gap-2 p-2 rounded-md w-fit cursor-pointer"
          >
            <input
              id="add-hotels"
              type="checkbox"
              checked={addHotels}
              onChange={(e) => setAddHotels(e.target.checked)}
              className="focus:outline-none cursor-pointer"
            />
            <div className="Body2R_14">Hotels</div>
          </label>

          
         
        </div>
      </div>

      {!addHotels ? (
        <EnterPassenger
          roomConfiguration={roomConfiguration}
          setRoomConfiguration={setRoomConfiguration}
          groupType={itinerary?.group_type}
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
          <div className="Body1M_16 mb-[8px]">Travellers and Rooms</div>
          <Pax
            numberOfAdults={numberOfAdults}
            setNumberOfAdults={setNumberOfAdults}
            numberOfChildren={numberOfChildren}
            setNumberOfChildren={setNumberOfChildren}
            numberOfInfants={numberOfInfants}
            setNumberOfInfants={setNumberOfInfants}
            roomConfiguration={roomConfiguration}
            setRoomConfiguration={setRoomConfiguration}
            groupType={itinerary?.group_type}
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
          />
        </div>
      </div>

      <div className={`${isDesktop ? "flex justify-between w-full" : "w-full"}`}>
        <Buttons 
          handleCancel={handleCancel} 
          handleUpdate={handleUpdate} 
          isLoading={isLoading}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default Settings;