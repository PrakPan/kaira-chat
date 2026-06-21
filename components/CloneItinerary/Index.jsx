import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EnterPassenger from "../tailoredform/slidetwo/EnterPassenger";
import Pax from "../tailoredform/slidetwo/pax/Pax";
import Preferences from "../tailoredform/slidetwo/preferences/Index";
import useMediaQuery from "../../hooks/useMedia";
import { useDispatch } from "react-redux";
import setItinerary from "../../store/actions/itinerary";
import { openNotification } from "../../store/actions/notification";
import { togglePreference } from "../../store/actions/slideOneActions";
import Buttons from "../settings/Buttons";
import DateComponent from "../settings/DateComponent";
import { SectionLabel, InclusionChip } from "../settings/FormUI";
import { Body2R_14 } from "../new-ui/Body";
import SelectedDestination from "../tailoredform/slideone/destinations/selecteddestination/Index";
import { useRouter } from "next/router";
import { setCloneItineraryDrawer } from "../../store/actions/cloneItinerary";
import axios from "axios";
import { MERCURY_HOST } from "../../services/constants";

const parseDateString = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Map an itinerary's start/end city object → the shape SelectedDestination uses.
// Handles both the mercury (start_city / start_location) and bot field names.
const cityToLocation = (c) => {
  if (!c) return null;
  const place_id = c.gmaps_place_id || c.place_id || null;
  const name = c.city_name || c.name || c.text || null;
  if (!place_id && !name) return null;
  return {
    name,
    place_id,
    lat: c.latitude ?? c.lat ?? null,
    long: c.longitude ?? c.long ?? null,
    country: c.country ?? null,
    currency: c.currency ?? null,
    country_code: c.country_code ?? null,
  };
};

const CloneItinerary = ({
  isHotelsPresent = false,
  // Bot/chat reuse: explicit source itinerary id (the bot has no router.query.id),
  // an end-location picker, and callbacks so the caller can keep the user in-page
  // (poll + skeleton) instead of the default hard redirect.
  sourceItineraryId,
  showEndLocation = false,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const itinerary = useSelector((state) => state.Itinerary);
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const initialInputId = Date.now();

  // Default the start/end location to the OPENED itinerary's locations (not the
  // viewer's current location). End falls back to start when the itinerary has
  // no distinct end location.
  const itineraryStartLoc = cityToLocation(
    itinerary?.start_city || itinerary?.start_location
  );
  const itineraryEndLoc =
    cityToLocation(itinerary?.end_city || itinerary?.end_location) ||
    itineraryStartLoc;

  const [startingLocation, setStartingLocation] = useState(
    itineraryStartLoc || false
  );
  const [showCities, setShowCities] = useState(false);
  const [showSearchStarting, setShowSearchStarting] = useState(false);
  const [destination, setDestination] = useState(router.query.destination);
  // End location (optional, shown only when showEndLocation is true).
  // const [endingLocation, setEndingLocation] = useState(itineraryEndLoc || false);
  // const [showEndCities, setShowEndCities] = useState(false);
  // const [showSearchEnding, setShowSearchEnding] = useState(false);
  // const [endDestination, setEndDestination] = useState(null);
  const { id } = useSelector((state) => state.auth);
  const sourceId = sourceItineraryId || router.query.id;

  // Initialize states with values from itinerary
  const [addHotels, setAddHotels] = useState(
    itinerary?.add_hotels ?? isHotelsPresent
  );
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

  const selectedPreferences =
    useSelector(
      (state) => state.tailoredInfoReducer.slideOne.selectedPreferences
    ) || [];

  useEffect(() => {
    if (
      itinerary?.experience_filters &&
      itinerary.experience_filters.length > 0
    ) {
      const currentPrefs = selectedPreferences;
      itinerary.experience_filters.forEach((pref) => {
        if (!currentPrefs.includes(pref)) {
          dispatch(togglePreference(pref));
        }
      });
    }
  }, []);

  // Initialize dates
  const [date, setDate] = useState({
    type: "fixed",
    start_date: itinerary?.start_date
      ? parseDateString(itinerary.start_date)
      : null,
    end_date: itinerary?.end_date ? parseDateString(itinerary.end_date) : null,
    month: "",
    duration: "",
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
          duration: "",
        });
      }
    }
  }, [itinerary, isHotelsPresent]);

  const handleSetSelectedPreferences = (preference) => {
    dispatch(togglePreference(preference));
  };

  const handleApplyDates = (dates) => {
    setDate({
      type: dates.dateType || dates.type,
      start_date:
        dates.start instanceof Date
          ? dates.start
          : dates.start
          ? parseDateString(dates.start)
          : null,
      end_date:
        dates.end instanceof Date
          ? dates.end
          : dates.end
          ? parseDateString(dates.end)
          : null,
      month: dates.month || "",
      duration: dates.duration || "",
    });
  };

  // Format date for API
  const formatDateForAPI = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleUpdate = () => {
    setIsLoading(true);

    if (!startingLocation?.place_id) {
      dispatch(
        openNotification({
          type: "error",
          text: "Please select a start location",
          heading: "Error!",
        })
      );
      setIsLoading(false);
      return;
    }

    if (!date.start_date || !date.end_date) {
      dispatch(
        openNotification({
          type: "error",
          text: "Please select valid dates",
          heading: "Error!",
        })
      );
      setIsLoading(false);
      return;
    }

    const req = {
      itinerary_id: sourceId,
      start_location: startingLocation?.place_id || null,
      // End location is intentionally kept the same as the start location.
      end_location: startingLocation?.place_id || null,
      currency: startingLocation?.currency || "INR",
      dates: {
        type:"fixed",
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
      visa: addVisa,
      esim: addEsim,
      room_configuration: roomConfiguration,
      // experience_filters: selectedPreferences,
    };

    axios
      .post(`${MERCURY_HOST}/api/v1/itinerary/get-my-itinerary/`, req, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        const newItineraryId = res.data?.itinerary_id;

        if (newItineraryId) {
          dispatch(
            openNotification({
              type: "success",
              text: "Creating your new itinerary...",
              heading: "Success!",
            })
          );

          if (onSuccess) {
            // Caller keeps the user in-page (e.g. bot: skeleton + status poll).
            onSuccess(newItineraryId);
          } else {
            // Default: close the clone drawer and hard-redirect.
            dispatch(setCloneItineraryDrawer(false));
            window.location.href = `/itinerary/${newItineraryId}`;
          }
        } else {
          throw new Error("No itinerary ID returned");
        }
      })
      .catch((err) => {
        console.log("error is:", err);
        dispatch(
          openNotification({
            type: "error",
            text:
              err?.response?.data?.errors?.[0]?.detail?.[0] ||
              "Something went wrong",
            heading: "Error!",
          })
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    dispatch(setCloneItineraryDrawer(false));
  };

  const inclusions = [
    {
      id: "add-activities-transfers",
      label: "Activities & Transfers",
      checked: addActivityTransfers,
      set: setAddActivityTransfers,
    },
    { id: "add-flights", label: "Flights", checked: addFlights, set: setAddFlights },
    { id: "add-hotels", label: "Hotels", checked: addHotels, set: setAddHotels },
    { id: "add-visa", label: "Visa", checked: addVisa, set: setAddVisa },
    { id: "add-esim", label: "eSIM", checked: addEsim, set: setAddEsim },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "85vh",
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
          flexShrink: 0,
        }}
      />

      {/* header */}
      <div
        style={{ flexShrink: 0, padding: "20px 20px 12px" }}
        className="flex items-start justify-between gap-3"
      >
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
            Craft a{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', 'Times New Roman', serif",
                fontStyle: "italic",
                fontWeight: 400,
                letterSpacing: "-0.015em",
              }}
            >
              similar
            </em>{" "}
            trip
          </div>
          <p style={{ fontSize: 13, color: "#5C5A55", marginTop: 4 }}>
            Tweak the start, dates and travellers — I'll build your own editable copy.
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

      {/* scrollable body */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "12px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div className="flex flex-col gap-[6px]">
          <SectionLabel>Start Location</SectionLabel>
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
        </div>

        {/* {showEndLocation && (
          <div className="flex flex-col gap-[6px]">
            <SectionLabel>End Location</SectionLabel>
            <SelectedDestination
              startingLocation={endingLocation}
              setStartingLocation={setEndingLocation}
              showSearchStarting={showSearchEnding}
              setShowSearchStarting={setShowSearchEnding}
              setShowCities={setShowEndCities}
              selectlocation
              destination={endDestination}
              CITIES={null}
              openCities={() => setShowEndCities(true)}
              setDestination={setEndDestination}
            ></SelectedDestination>
          </div>
        )} */}

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
      </div>

      {/* sticky footer */}
      <div
        style={{
          flexShrink: 0,
          borderTop: "1px solid #EFEAD9",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          padding: "14px 20px",
        }}
      >
        <Buttons
          handleCancel={handleCancel}
          handleUpdate={handleUpdate}
          isLoading={isLoading}
          isEdit={true}
          updateLabel="Clone Itinerary"
        />
      </div>
    </div>
  );
};

export default CloneItinerary;
