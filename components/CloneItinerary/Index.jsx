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
import { deriveRoomConfiguration } from "../tailoredform/utils/slideOneActions";
import Buttons from "../settings/Buttons";
import { SectionLabel, InclusionChip } from "../settings/FormUI";
import { Body2R_14 } from "../new-ui/Body";
import { useRouter } from "next/router";
import { setCloneItineraryDrawer } from "../../store/actions/cloneItinerary";
import axios from "axios";
import { MERCURY_HOST } from "../../services/constants";
import Image from "next/image";
import { StyledFigmaBox } from "../tailoredform/utils/ui";
import { getHumanDate } from "../../services/getHumanDate";
import ModalWithBackdrop from "../ui/ModalWithBackdrop";
import BottomModal from "../ui/LowerModal";
import AirbnbCalendarSingleMonth from "../calendar/SingleCalendar";
import { RxCross2 } from "react-icons/rx";

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
  const isDomestic = itinerary?.destination_type === "Domestic";
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
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

  // Start location is taken directly from the opened itinerary — there is no
  // picker. End location is intentionally kept the same as the start.
  const [startingLocation, setStartingLocation] = useState(
    itineraryStartLoc || false
  );
  const { id } = useSelector((state) => state.auth);
  const sourceId = sourceItineraryId || router.query.id;

  // Duration (in days) of the source itinerary — used to derive the new end
  // date from the picked start date so the trip length is preserved.
  const itineraryDurationDays =
    itinerary?.start_date && itinerary?.end_date
      ? Math.round(
          (parseDateString(itinerary.end_date) -
            parseDateString(itinerary.start_date)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  // Flights, hotels and activities & transfers are auto-selected on open.
  // Visa/eSIM keep whatever the itinerary had.
  const [addHotels, setAddHotels] = useState(true);
  const [addFlights, setAddFlights] = useState(true);
  const [addActivityTransfers, setAddActivityTransfers] = useState(true);
  const [addVisa, setAddVisa] = useState(itinerary?.add_visa ?? false);
  const [addEsim, setAddEsim] = useState(itinerary?.add_esim ?? false);

  const [roomConfiguration, setRoomConfiguration] = useState(
    deriveRoomConfiguration(itinerary)
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
      // Auto-mark flights, hotels and activities & transfers.
      setAddHotels(true);
      setAddFlights(true);
      setAddActivityTransfers(true);
      setStartingLocation(
        cityToLocation(itinerary?.start_city || itinerary?.start_location) ||
          false
      );
      setAddVisa(itinerary?.add_visa ?? false);
      setAddEsim(itinerary?.add_esim ?? false);
      setRoomConfiguration(deriveRoomConfiguration(itinerary));
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

  // Keep traveller counts in sync with the room configuration. Pax (used when
  // addHotels is true) only writes back to roomConfiguration on Done — it does
  // NOT call the numberOf* setters, so without this effect the payload sent to
  // the clone API carries stale passenger totals (e.g. number_of_adults: 10
  // while the rooms sum to 9). Pax rooms don't track infants, so only fold
  // infants in when the rooms actually carry them (EnterPassenger).
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
  };

  // Single-date picker: user picks only the start date; the end date is
  // derived from the source itinerary's duration so the trip length is kept.
  const handleSelectStartDate = (dates) => {
    const start =
      dates.start instanceof Date
        ? dates.start
        : dates.start
        ? parseDateString(dates.start)
        : null;

    if (!start) return;

    const end = new Date(start);
    end.setDate(end.getDate() + itineraryDurationDays);

    setDate({
      type: "fixed",
      start_date: start,
      end_date: end,
      month: "",
      duration: "",
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
      visa: isDomestic ? false : addVisa,
      esim: isDomestic ? false : addEsim,
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

  // Calendar body with a close button placed clear of the month-nav arrows.
  const calendarContent = (
    <div style={{ position: "relative", padding: "40px 4px 8px" }}>
      <button
        onClick={() => setShowCalendar(false)}
        aria-label="Close"
        className="grid place-items-center"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 32,
          height: 32,
          zIndex: 10,
        }}
      >
        <RxCross2 style={{ fontSize: "1.25rem", color: "#5C5A55" }} />
      </button>
      <AirbnbCalendarSingleMonth
        valueStart={date.start_date}
        valueEnd={null}
        onChangeDate={handleSelectStartDate}
        setShowCalendar={setShowCalendar}
        date={date}
        isNotForm={true}
      />
    </div>
  );

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
            Tweak the dates and travellers — I'll build your own editable copy.
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
          <SectionLabel>Start Date</SectionLabel>
          <div className="relative w-full">
            <StyledFigmaBox
              value={
                date.start_date
                  ? getHumanDate(
                      date.start_date instanceof Date
                        ? date.start_date
                            .toLocaleDateString("en-CA")
                            .split("-")
                            .reverse()
                            .join("/")
                        : date.start_date.split("-").reverse().join("/")
                    )
                  : ""
              }
              placeholder="Select a start date"
              className="cursor-pointer w-full pr-10 Body2M_14"
              onClick={() => setShowCalendar(true)}
              readOnly
            />
            <Image
              src="/calendar.svg"
              width={20}
              height={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              alt="calendar"
            />
          </div>
        </div>

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

      {/* single-date calendar — picks start date, end is derived from duration */}
      {isDesktop ? (
        <ModalWithBackdrop
          centered
          show={showCalendar}
          mobileWidth="100%"
          backdrop
          closeIcon={false}
          onHide={() => setShowCalendar(false)}
          borderRadius={"12px"}
          animation={false}
          paddingX="0px"
          paddingY="0px"
          backdropStyle={{
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(1px)",
          }}
        >
          {calendarContent}
        </ModalWithBackdrop>
      ) : (
        <BottomModal
          show={showCalendar}
          onHide={() => setShowCalendar(false)}
          width="100%"
          height="max-content"
          paddingX="20px"
          paddingY="20px"
        >
          <div className="flex justify-center w-full">
            <AirbnbCalendarSingleMonth
              valueStart={date.start_date}
              valueEnd={null}
              onChangeDate={handleSelectStartDate}
              setShowCalendar={setShowCalendar}
              date={date}
              isNotForm={true}
            />
          </div>
        </BottomModal>
      )}
    </div>
  );
};

export default CloneItinerary;
