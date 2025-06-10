import { useEffect, useState, useRef } from "react";
import { connect, useSelector } from "react-redux";

import ItineraryCity from "../../components/itinerary/itineraryCity";
import CityItem from "./VerticalLayout";
import media from "../../components/media";
import BookingModal from "../../components/modals/bookingupdated/Index";
import { format } from "date-fns";
import { CONTENT_SERVER_HOST } from "../../services/constants";
import * as ga from "../../services/ga/Index";

const CITY_COLOR_CODES = [
  "#359EBF", // shade of blue
  "#F0C631", // shade of yellow
  "#BF3535", // shade of red
  "#47691e", // shade of green
  "#cc610a", // shade of orange
  "#008080", // shade of teal
  "#7d5e7d", // shade of purple
];

const DaybyDay = ({
  transferBookings,
  width,
  setItinerary,
  activityBookings,
  setActivityBookings,
  itinerary,
  loadbookings,
  payment,
  setStayBookings,
  _updateFlightBookingHandler,
  _updatePaymentHandler,
  getPaymentHandler,
  _updateTaxiBookingHandler,
  setShowLoginModal,
  ...props
}) => {
  console.log("transfer bookings is:", transferBookings);
  const itineraryDaybyDay = useSelector((state) => state.Itinerary);
  const stayBookings = useSelector((state) => state.Stays);
  const [selectedBooking, setSelectedBooking] = useState({
    id: null,
    name: null,
  });
  const [showDetails, setShowDetails] = useState(false);
  const [AddHotel, setAddHotel] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [images, setImages] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingFunData, setBookingFunData] = useState(null);
  const [dates, setDates] = useState({ check_in: "", check_out: "" });
  const [showFilter, setshowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
    const transferBooking = useSelector(
      (state) => state.TransferBookings
    )?.transferBookings;

  let isPageWide = media("(min-width: 768px)");
  console.log("Inside DaybyDay Itinerary", itinerary);
  const cityRefs = useRef({});
  let startCity = itineraryDaybyDay?.start_city;
  let endCity = itineraryDaybyDay?.end_city;

  useEffect(() => {
    let array = [];
    if (itineraryDaybyDay?.cities) {
      for (const city of itineraryDaybyDay?.cities) {
        array.push({
          id: city.id,
          name: city.city.name,
          duration: city.duration,
        });
      }
    }
  }, [itineraryDaybyDay]);

  const _setImagesHandler = (images) => {
    setImages(images);
  };

  const _changeBookingHandler = (
    name,
    itinerary_id,
    tailored_id,
    accommodation,
    id,
    check_in,
    check_out,
    pax,
    city,
    cityId,
    room_type,
    itinerary_name,
    cost,
    costings_breakdown,
    images,
    clickType
  ) => {
    {
      process.env.NODE_ENV === "production" &&
        !CONTENT_SERVER_HOST.includes("dev") &&
        ga.event({
          action: "Itinerary-bookings-acc_change",
          params: { name: name },
        });
    }

    setSelectedBooking({
      ...selectedBooking,
      name: name,
      itinerary_id: itinerary_id,
      accommodation: accommodation,
      id: id,
      tailored_id: tailored_id,
      check_in: format(new Date(check_in), "yyyy-MM-dd").replaceAll("-", "/"),
      check_out: format(new Date(check_out), "yyyy-MM-dd").replaceAll("-", "/"),
      pax: pax,
      city: city,
      cityId: cityId,
      room_type: room_type,

      itinerary_name: itinerary_name,
      cost: Math.round(cost),
      costings_breakdown: costings_breakdown,
      images: images,
      clickType: clickType,
    });
    props.setShowBookingModal(true);
  };

  function handleClickAc(i, data, city_id, clickType) {
    console.log("Inside DayByDay",stayBookings[i]);
    let name = stayBookings[i]?.["name"];
    let itinerary_id = stayBookings[i]?.["itinerary_id"];
    let itinerary_name = stayBookings[i]?.["itinerary_name"];
    let accommodation = stayBookings[i]?.["accommodation"];
    let tailored_id = stayBookings[i]?.["tailored_itinerary"];
    let user_rating = stayBookings[i]?.star_category;
    let number_of_reviews = stayBookings[i]?.user_ratings_total;
    let id = stayBookings[i]?.["id"];
    let check_in = stayBookings[i]?.["check_in"];
    let check_out = stayBookings[i]?.["check_out"];
    let pax = {
      number_of_adults: stayBookings[i]?.["number_of_adults"],
      number_of_children: stayBookings[i]?.["number_of_children"],
      number_of_infants: stayBookings[i]?.["number_of_infants"],
    };
    let city = stayBookings[i]?.["city_name"];
    let cityId =
      stayBookings[i]?.city?.id || stayBookings[i]?.city_id || city_id;
    let room_type = stayBookings[i]?.["room"];
    _changeBookingHandler(
      name,
      itinerary_id,
      tailored_id,
      accommodation,
      id,
      check_in,
      check_out,
      pax,
      city,
      cityId,
      room_type,
      user_rating,
      number_of_reviews,
      itinerary_name,
      clickType
    );
    data.clickType = clickType;
    setCurrentBooking(data);
    props.setShowBookingModal(true);
  }

  function handleClick(i, id, data, city_id) {
    let check_in = props?.itineraryFilter.check_in;
    let check_out = props?.itineraryFilter.check_out;
    setDates({ check_in, check_out });

    setBookingId(id);
    setCurrentBooking(data);
    setBookingFunData({ index: i, booking: data, city_id: city_id });
    setShowDetails(true);
  }
  console.log("component show modal1 is:",props?.showBookingModal)

   const parseDate = (dateString) => {
      if (!dateString) return null;
      return new Date(dateString);
    };

   const sortByCheckIn = (bookings) => {
    return [...bookings].sort((a, b) => {
      const dateA = parseDate(a.check_in);
      const dateB = parseDate(b.check_in);
      return dateA - dateB;
    });
  };

  return (
    <>
      <div
        className={`flex flex-col gap-3 mt-5 ${
          !isPageWide ? "max-w-fit" : "max-w-[54vw]"
        }`}
      >
        <h1 className="text-[#262626] text-3xl font-bold cursor-pointer group transition duration-300 max-w-fit">
          Day By Day Itinerary
          <span className="mt-1 block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
        </h1>

        {/* to navigate between cities in frontend */}
        {/* <CityNavigation cities={cities} cityRefs={cityRefs} /> */}

        <div className="flex flex-col">
          <CityItem
            setShowLoginModal={setShowLoginModal}
            key={startCity?.place_id}
            city={startCity?.city_name}
            pinColour={CITY_COLOR_CODES[0 % 7]}
            onClick={() => alert(`Clicked`)}
            downPresent={false}
            upPresent={false}
            width={width}
            length={itineraryDaybyDay?.cities?.length}
            oCityData={startCity}
            dCityData={itineraryDaybyDay?.cities?.[0]}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            _updateTaxiBookingHandler={_updateTaxiBookingHandler}
            _updatePaymentHandler={_updatePaymentHandler}
            getPaymentHandler={getPaymentHandler}
          />
          <CityItem
            setShowLoginModal={setShowLoginModal}
            loadbookings={loadbookings}
            key={2}
            bookingIdToDelete={
              startCity?.gmaps_place_id +
              ":" +
              itineraryDaybyDay?.cities?.[0]?.id
            }
            city={
              transferBookings?.intercity?.[
                startCity?.gmaps_place_id +
                  ":" +
                  itineraryDaybyDay?.cities?.[0]?.id
              ]?.name
            }
             booking={transferBookings?.intercity?.[
                startCity?.gmaps_place_id +
                  ":" +
                  itineraryDaybyDay?.cities?.[0]?.id
              ]}
            duration={
              transferBookings?.intercity?.[
                startCity?.gmaps_place_id +
                  ":" +
                  itineraryDaybyDay?.cities?.[0]?.id
              ]?.duration
            }
            booking_type={
              transferBookings?.intercity?.[
                startCity?.gmaps_place_id +
                  ":" +
                  itineraryDaybyDay?.cities?.[0]?.id
              ]?.booking_type
            }
            airportBookings = {transferBooking?.airport[itineraryDaybyDay?.cities?.[0]?.id] || []}
            transfer_type={
              transferBookings?.intercity?.[
                startCity?.gmaps_place_id +
                  ":" +
                  itineraryDaybyDay?.cities?.[0]?.id
              ]?.transfer_type
            }
            pinColour={CITY_COLOR_CODES[0 % 7]}
            onClick={() => alert(`Clicked`)}
            downPresent={true}
            upPresent={true}
            booking_id={
              transferBookings?.intercity?.[
                startCity?.gmaps_place_id +
                  ":" +
                  itineraryDaybyDay?.cities?.[0]?.id
              ]?.id
            }
            width={width}
            length={itineraryDaybyDay?.cities?.length}
            origin_city_id={startCity?.gmaps_place_id || startCity?.city_id}
            destination_city_id={itineraryDaybyDay?.cities?.[0]?.city?.id}
            origin_city_name={startCity?.city_name}
            destination_city_name={itineraryDaybyDay?.cities?.[0]?.city?.name}
            setBookingId={setBookingId}
            oCityData={startCity}
            dCityData={itineraryDaybyDay?.cities?.[0]}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            _updatePaymentHandler={_updatePaymentHandler}
            _updateTaxiBookingHandler={_updateTaxiBookingHandler}
            getPaymentHandler={getPaymentHandler}
          />
          {itineraryDaybyDay?.cities?.map((city, index) => {
            var idMapping =
              city?.id + ":" + itineraryDaybyDay?.cities?.[index + 1]?.id;

            let sourceKey = city?.id;
           let airportBookings = [
            ...(transferBooking?.airport[sourceKey]?.filter((booking) => booking?.is_airport_drop) || []),
            ...(transferBooking?.airport?.[itineraryDaybyDay?.cities?.[index + 1]?.id]?.filter((booking) => booking?.is_airport_pickup) || [])
           ];

            let intracityBookings = transferBooking?.intracity[sourceKey] || [];

            if(airportBookings?.length > 0){
               airportBookings= sortByCheckIn(airportBookings);
            }
            if(intracityBookings?.length > 0){
               intracityBookings= sortByCheckIn(intracityBookings);
            }
           
            return (
              <>
                <ItineraryCity
                  mercuryItinerary={props?.mercuryItinerary}
                  key={city.id}
                  city={city}
                  cityRefs={cityRefs}
                  setItinerary={setItinerary}
                  activityBookings={activityBookings}
                  setActivityBookings={setActivityBookings}
                  setBookingId={setBookingId}
                  idMapping={transferBookings?.intercity?.[idMapping]?.id}
                  setShowDetails={setShowDetails}
                  setShowLoginModal={setShowLoginModal}
                  handleClickAc={handleClickAc}
                  index={index}
                  intracityBookings={intracityBookings}
                  _updateFlightBookingHandler={_updateFlightBookingHandler}
                 _updateTaxiBookingHandler={_updateTaxiBookingHandler}
                _updatePaymentHandler={_updatePaymentHandler}
                getPaymentHandler={getPaymentHandler}

                />
                {index != itineraryDaybyDay?.cities?.length - 1 && (
                  <div>
                    <CityItem
                      setShowLoginModal={setShowLoginModal}
                      mercury
                      loadbookings={loadbookings}
                      bookingIdToDelete={idMapping}
                      key={city.id}
                      city={transferBookings?.intercity?.[idMapping]?.name}
                      sourceKey={sourceKey}
                      airportBookings={airportBookings}
                      intracityBookings={intracityBookings}
                      duration={
                        transferBookings?.intercity?.[idMapping]?.duration
                      }
                      booking_type={
                        transferBookings?.intercity?.[idMapping]?.booking_type
                      }
                      transfer_type={
                        transferBookings?.intercity?.[idMapping]?.transfer_type
                      }
                      pinColour={CITY_COLOR_CODES[index % 7]}
                      onClick={() => alert(`Clicked`)}
                      upPresent={true}
                      downPresent={true}
                      booking={transferBookings?.intercity?.[idMapping]}
                      booking_id={transferBookings?.intercity?.[idMapping]?.id}
                      width={width}
                      length={itineraryDaybyDay?.cities?.length}
                      origin={city?.id}
                      destination={itineraryDaybyDay?.cities?.[index + 1]?.id}
                      origin_city_id={city?.city?.id}
                      destination_city_id={
                        itineraryDaybyDay?.cities?.[index + 1]?.city?.id
                      }
                      origin_city_name={city?.city?.name}
                      destination_city_name={
                        itineraryDaybyDay?.cities?.[index + 1]?.city?.name
                      }
                      setBookingId={setBookingId}
                      oCityData={itineraryDaybyDay?.cities?.[index]}
                      dCityData={itineraryDaybyDay?.cities?.[index + 1]}
                      selectedBooking={selectedBooking}
                      setSelectedBooking={setSelectedBooking}
                      _updateFlightBookingHandler={_updateFlightBookingHandler}
                      _updateTaxiBookingHandler={_updateTaxiBookingHandler}
                      _updatePaymentHandler={_updatePaymentHandler}
                      getPaymentHandler={getPaymentHandler}

                    />
                  </div>
                )}
              </>
            );
          })}
          <CityItem
            setShowLoginModal={setShowLoginModal}
            key={endCity?.gmaps_place_id}
            loadbookings={loadbookings}
            // airportBookings={transferBooking?.airport[itineraryDaybyDay?.cities?.[
            //       itineraryDaybyDay?.cities?.length - 1
            //     ]?.id] ? sortByCheckIn(transferBooking?.airport[itineraryDaybyDay?.cities?.[
            //       itineraryDaybyDay?.cities?.length - 1
            //     ]?.id]) : [] }

const airportBookings = {[
  ...(transferBooking?.airport?.[endCity?.gmaps_place_id] || []),
  ...(transferBooking?.airport?.[itineraryDaybyDay?.cities?.[itineraryDaybyDay?.cities?.length - 1]?.id] || [])
]}
            intracityBookings={transferBooking?.intracity[itineraryDaybyDay?.cities?.[
                  itineraryDaybyDay?.cities?.length - 1
                ]?.id] ? sortByCheckIn(transferBooking?.intracity[itineraryDaybyDay?.cities?.[
                  itineraryDaybyDay?.cities?.length - 1
                ]?.id]) :  []}
            city={
              transferBookings?.intercity?.[
                itineraryDaybyDay?.cities?.[
                  itineraryDaybyDay?.cities?.length - 1
                ]?.id +
                  ":" +
                  endCity?.gmaps_place_id
              ]?.name
            }
            booking_type={
              transferBookings?.intercity?.[
                itineraryDaybyDay?.cities?.[
                  itineraryDaybyDay?.cities?.length - 1
                ]?.id +
                  ":" +
                  endCity?.gmaps_place_id
              ]?.booking_type
            }
            transfer_type={
              transferBookings?.intercity?.[
                itineraryDaybyDay?.cities?.[
                  itineraryDaybyDay?.cities?.length - 1
                ]?.id +
                  ":" +
                  endCity?.gmaps_place_id
              ]?.transfer_type
            }
            duration={
              transferBookings?.intercity?.[
                itineraryDaybyDay?.cities?.[
                  itineraryDaybyDay?.cities?.length - 1
                ]?.id +
                  ":" +
                  endCity?.gmaps_place_id
              ]?.duration
            }
            pinColour={CITY_COLOR_CODES[0 % 7]}
            onClick={() => alert(`Clicked`)}
            upPresent={true}
            downPresent={true}
            booking_id={
              transferBookings?.intercity?.[
                itineraryDaybyDay?.cities?.[
                  itineraryDaybyDay?.cities?.length - 1
                ]?.id +
                  ":" +
                  endCity?.gmaps_place_id
              ]?.id
            }
            width={width}
            length={itineraryDaybyDay?.cities?.length}
            origin_city_id={
              itineraryDaybyDay?.cities?.[itineraryDaybyDay?.cities?.length - 1]
                ?.city?.id
            }
            destination_city_id={endCity?.gmaps_place_id}
            origin_city_name={
              itineraryDaybyDay?.cities?.[itineraryDaybyDay?.cities?.length - 1]
                ?.city?.name
            }
            destination_city_name={endCity?.city_name}
            setBookingId={setBookingId}
            oCityData={itineraryDaybyDay?.cities?.[itineraryDaybyDay?.cities?.length - 1]}
            dCityData={endCity}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            _updateTaxiBookingHandler={_updateTaxiBookingHandler}
            _updatePaymentHandler={_updatePaymentHandler}
            getPaymentHandler={getPaymentHandler}
          />
          <CityItem
            setShowLoginModal={setShowLoginModal}
            key={endCity?.place_id}
            city={endCity?.city_name}
            pinColour={CITY_COLOR_CODES[0 % 7]}
            onClick={() => alert(`Clicked`)}
            downPresent={false}
            upPresent={false}
            width={width}
            length={itineraryDaybyDay?.cities?.length}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            _updateTaxiBookingHandler={_updateTaxiBookingHandler}
            _updatePaymentHandler={_updatePaymentHandler}
            getPaymentHandler={getPaymentHandler}
          />
        </div>
      </div>
      <BookingModal
        mercury
        showFilter={showFilter}
        setshowFilter={setshowFilter}
        setShowLoginModal={setShowLoginModal}
        payment={payment}
        plan={stayBookings}
        _setImagesHandler={_setImagesHandler}
        getPaymentHandler={getPaymentHandler}
        _updateStayBookingHandler={props._updateStayBookingHandler}
        tailored_id={
          stayBookings && stayBookings[0]
            ? stayBookings[0]["tailored_itinerary"]
            : null
        }
        _updatePaymentHandler={_updatePaymentHandler}
        _updateBookingHandler={props?._updateBookingHandler}
        selectedBooking={selectedBooking}
        setShowBookingModal={props?.setShowBookingModal}
        currentBooking={currentBooking}
        showBookingModal={props?.showBookingModal}
        setHideBookingModal={props?.setHideBookingModal}
        AddHotel={AddHotel}
        _GetInTouch={props._GetInTouch}
        handleClick={handleClick}
        stayBookings={stayBookings}
        setStayBookings={setStayBookings}
        itineraryDaybyDay={itineraryDaybyDay}
        onHide={()=>{}}
      ></BookingModal>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    itineraryDaybyDay: state.ItineraryDaybyDay,
  };
};

export default connect(mapStateToPros)(DaybyDay);
