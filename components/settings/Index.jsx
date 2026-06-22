import DateComponent from "./DateComponent";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EnterPassenger from "../tailoredform/slidetwo/EnterPassenger";
import Pax from "../tailoredform/slidetwo/pax/Pax";
import Preferences from "../tailoredform/slidetwo/preferences/Index";
import Buttons from "./Buttons";
import { SectionLabel, InclusionChip } from "./FormUI";
import useMediaQuery from "../../hooks/useMedia";
import { useDispatch } from "react-redux";
import { openNotification } from "../../store/actions/notification";
import { togglePreference } from "../../store/actions/slideOneActions";


const parseDateString = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};


const Settings = ({setShowSettings, isHotelsPresent, handleApply, maxAdults=false, maxRooms=false}) => {
  const dispatch = useDispatch();
  const itinerary = useSelector(state => state.Itinerary);
  const isDomestic = itinerary?.destination_type === "Domestic";
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize states with values from itinerary
  const [addHotels, setAddHotels] = useState(itinerary?.add_hotels ?? isHotelsPresent);
  const [addFlights, setAddFlights] = useState(itinerary?.add_flights ?? false);
  const [addActivityTransfers, setAddActivityTransfers] = useState(
    itinerary?.add_transfers_and_activities ?? false
  );
  const [addVisa, setAddVisa] = useState(itinerary?.visa ?? false);
  const [addEsim, setAddEsim] = useState(itinerary?.esim ?? false);

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
    setAddVisa(itinerary?.visa ?? false);
    setAddEsim(itinerary?.esim ?? false);
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

  // Keep traveller counts in sync with the room configuration. Pax (used when
  // addHotels is true) only writes back to roomConfiguration on Done — it does
  // NOT call the numberOf* setters, so without this effect the payload sent to
  // handleApply carries stale passenger totals. Pax rooms don't track infants,
  // so only fold infants in when the rooms actually carry them (EnterPassenger).
  useEffect(() => {
    if (!roomConfiguration || roomConfiguration.length === 0) return;

    let adultsTotal = 0;
    let childrenTotal = 0;
    let infantsTotal = 0;
    let roomsHaveInfants = false;

    for (const room of roomConfiguration) {
      adultsTotal += room?.adults || 0;
      childrenTotal += room?.children || 0;
      if (room?.infants !== undefined) {
        roomsHaveInfants = true;
        infantsTotal += room?.infants || 0;
      }
    }

    setNumberOfAdults(adultsTotal);
    setNumberOfChildren(childrenTotal);
    if (roomsHaveInfants) setNumberOfInfants(infantsTotal);
  }, [roomConfiguration]);

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
    visa: isDomestic ? false : addVisa,
    esim: isDomestic ? false : addEsim,
    room_configuration: roomConfiguration,
    // experience_filters: selectedPreferences,
  }

  handleApply(req)
    .then(() => {
      dispatch(openNotification({
        type: "success",
        text: "Itinerary updated successfully",
        heading: "Success!",
      }));
      setShowSettings(false);
    })
    .catch((err) => {
      console.log("error is:", err);
      dispatch(openNotification({
        type: "error",
        text: err?.response?.data?.errors?.[0]?.detail?.[0] || err?.response?.data?.errors?.[0]?.message?.[0] || "Something went wrong",
        heading: "Error!",
      }));
    })
    .finally(() => {
      setIsLoading(false);
    });
}





  const handleCancel = () => {
    setShowSettings(false);
  }

  const inclusions = [
    {
      id: "add-activities-transfers",
      label: "Activities & Transfers",
      checked: addActivityTransfers,
      set: setAddActivityTransfers,
    },
    { id: "add-flights", label: "Flights", checked: addFlights, set: setAddFlights },
    { id: "add-hotels", label: "Hotels", checked: addHotels, set: setAddHotels },
    ...(isDomestic
      ? []
      : [
          { id: "add-visa", label: "Visa", checked: addVisa, set: setAddVisa },
          { id: "add-esim", label: "eSIM", checked: addEsim, set: setAddEsim },
        ]),
  ];

  return (
    <div
      style={{
        borderRadius: 20,
        overflow: "hidden",
        background:
          "#fafafa",
      }}
    >
      {/* yellow top strip — matches BotLoginModal */}
      <div
        style={{
          height: 6,
          background: "linear-gradient(90deg,#FFE600,#F2D700)",
        }}
      />
      <div className={`flex flex-col gap-4 md:max-w-[537px] z-[9999] px-3 py-4 md:!px-5 md:!py-5`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div
              style={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: isDesktop ? 28 : 24,
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                color: "#0B1220",
              }}
            >
              Update your{" "}
              <em
                style={{
                  fontFamily: "'Instrument Serif', 'Times New Roman', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  letterSpacing: "-0.015em",
                }}
              >
                trip
              </em>{" "}
              preferences
            </div>
            <p style={{ fontSize: 13, color: "#5C5A55", marginTop: 4 }}>
              Adjust dates, travellers and inclusions — I'll reprice it for you.
            </p>
          </div>

          <button
            onClick={handleCancel}
            aria-label="Close"
            className="flex-shrink-0 grid place-items-center transition-colors"
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              border: "1px solid #E6E1D2",
              background: "#FFFFFF",
              color: "#5C5A55",
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      <DateComponent
        settings={true} 
        handleApplyDates={handleApplyDates} 
        setDate={setDate} 
        date={date}
      />

      <div>
        <SectionLabel>Pick your inclusions</SectionLabel>
        <div className="flex flex-wrap gap-2 mt-[2px]">
          {inclusions.map((opt) => (
            <InclusionChip key={opt.id} opt={opt} />
          ))}
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
          isTailored={maxAdults}
        />
      ) : (
        <div>
          <SectionLabel>Travellers and rooms</SectionLabel>
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
            maxRooms={maxRooms}
          />
        </div>
      )}

      {/* <div>
        <SectionLabel>Choose your experience</SectionLabel>
        <div className="mt-[10px]">
          <Preferences
            tailoredFormModal={false}
            selectedPreferences={selectedPreferences}
            setSelectedPreferences={handleSetSelectedPreferences}
          />
        </div>
      </div> */}

      <div className={`${isDesktop ? "flex justify-between w-full" : "w-full"}`}>
        <Buttons
          handleCancel={handleCancel}
          handleUpdate={handleUpdate}
          isLoading={isLoading}
          isEdit={true}
        />
      </div>
      </div>
    </div>
  );
};

export default Settings;