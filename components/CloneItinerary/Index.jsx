import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EnterPassenger from "../tailoredform/slidetwo/EnterPassenger";
import Pax from "../tailoredform/slidetwo/pax/Pax";
import Preferences from "../tailoredform/slidetwo/preferences/Index";
import useMediaQuery from "../../hooks/useMedia";
import { useDispatch } from "react-redux";
import setItinerary  from "../../store/actions/itinerary";
import { openNotification } from "../../store/actions/notification";
import { togglePreference } from "../../store/actions/slideOneActions";
import Buttons from "../settings/Buttons";
import DateComponent from "../settings/DateComponent";
import { Body2R_14 } from "../new-ui/Body";
import SelectedDestination from "../tailoredform/slideone/destinations/selecteddestination/Index";
import { useRouter } from "next/router";
import { setCloneItineraryDrawer } from "../../store/actions/cloneItinerary";


const parseDateString = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};


const CloneItinerary = ({isHotelsPresent, handleApply}) => {
  const dispatch = useDispatch();
  const itinerary = useSelector(state => state.Itinerary);
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const initialInputId = Date.now();
  const [startingLocation, setStartingLocation] = useState(false);
  const [showCities, setShowCities] = useState(false);
  const [showSearchStarting, setShowSearchStarting] = useState(false);
    const [destination, setDestination] = useState(
    router.query.destination 
  );
  const {id} = useSelector(state=>state.auth);

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

  const selectedPreferences = useSelector(
  (state) => state.tailoredInfoReducer.slideOne.selectedPreferences
) || [];


useEffect(() => {
  if (itinerary?.experience_filters && itinerary.experience_filters.length > 0) {
    const currentPrefs = selectedPreferences;
    itinerary.experience_filters.forEach(pref => {
      if (!currentPrefs.includes(pref)) {
        dispatch(togglePreference(pref));
      }
    });
  }
}, []);

  // Initialize dates
  const [date, setDate] = useState({
  type: "fixed",
  start_date: itinerary?.start_date ? parseDateString(itinerary.start_date) : null,
  end_date: itinerary?.end_date ? parseDateString(itinerary.end_date) : null,
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
    
    if (itinerary?.start_date && itinerary?.end_date) {
      setDate({
        type: "fixed",
        start_date: parseDateString(itinerary.start_date),
        end_date: parseDateString(itinerary.end_date),
        month: "",
        duration: ""
      });
    }
  }
}, [itinerary, isHotelsPresent]);

  const handleSetSelectedPreferences = (preference) => {
  dispatch(togglePreference(preference));
}

const handleApplyDates = (dates) => {
  setDate({
    type: dates.dateType || dates.type, 
    start_date: dates.start instanceof Date ? dates.start : (dates.start ? parseDateString(dates.start) : null),
    end_date: dates.end instanceof Date ? dates.end : (dates.end ? parseDateString(dates.end) : null),
    month: dates.month || "",
    duration: dates.duration || ""
  });
};

const handleUpdate = () => {
  setIsLoading(true);
  
  // Format date for API
  const formatDateForAPI = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const req = {
    date: {
      start_date: formatDateForAPI(date.start_date),
      end_date: formatDateForAPI(date.end_date),
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
      dispatch(setCloneItineraryDrawer(false));
    })
    .catch((err) => {
      console.log("error is:", err);
      dispatch(openNotification({
        type: "error",
        text: err?.response?.data?.errors[0]?.message?.[0] || "Something went wrong",
        heading: "Error!",
      }));
    })
    .finally(() => {
      setIsLoading(false);
    });
}





  const handleCancel = () => {
    dispatch(setCloneItineraryDrawer(false));
  }

  return (
    <div className={`flex flex-col gap-[24px] md:max-w-[537px]`}>
      <div className="Heading1SB font-semibold">Clone this Itinerary</div>

      <div className="flex flex-col gap-[4px]">
        <Body2R_14>Start Location</Body2R_14>
        <SelectedDestination
          startingLocation={startingLocation}
          setStartingLocation={setStartingLocation}
          showSearchStarting={showSearchStarting}
          setShowSearchStarting={setShowSearchStarting}
          setShowCities={setShowCities}
          selectlocation
          destination={destination}
          CITIES={null}
          openCities={() => setShowCities(true)}
          setDestination={setDestination}
        ></SelectedDestination>
        {/* {props.errors.startLocation !== null && (
          <p className="mt-1 text-sm text-red-600 font-medium">
            {props.errors.startLocation}
          </p>
        )} */}
      </div>

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

export default CloneItinerary;