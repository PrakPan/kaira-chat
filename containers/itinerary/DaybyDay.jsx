import { useEffect, useState, useRef } from "react";
import { connect, useSelector } from "react-redux";

import ItineraryCity from "../../components/itinerary/itineraryCity";
import CityItem from "./VerticalLayout";
import media from "../../components/media";
import Drawer from "../../components/ui/Drawer";
import AccommodationModal from "../../components/modals/accommodation/Index";

const CITY_COLOR_CODES = [
  "#359EBF", // shade of blue
  "#F0C631", // shade of yellow
  "#BF3535", // shade of red
  "#47691e", // shade of green
  "#cc610a", // shade of orange
  "#008080", // shade of teal
  "#7d5e7d", // shade of purple
];

const DaybyDay = ({ transferBookings ,width,setItinerary,activityBookings,setActivityBookings,itinerary, loadbookings, payment, stayBookings, setStayBookings}) => {
  const itineraryDaybyDay=useSelector((state)=>state.Itinerary)
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

  let isPageWide = media("(min-width: 768px)");
  console.log("Inside DaybyDay Itinerary",itinerary);
  const cityRefs = useRef({});
  let startCity = itineraryDaybyDay?.start_city;
  let endCity = itineraryDaybyDay?.end_city;

  useEffect(() => {
    let array = [];

    for (const city of itineraryDaybyDay?.cities) {
      array.push({
        id: city.id,
        name: city.city.name,
        duration: city.duration,
      });
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
        check_in: format(new Date(check_in), "dd-MM-yyyy").replaceAll("-", "/"),
        check_out: format(new Date(check_out), "dd-MM-yyyy").replaceAll("-", "/"),
        pax: pax,
        city: city,
        cityId: cityId,
        room_type: room_type,
  
        itinerary_name: itinerary_name,
        cost: Math.round(cost),
        costings_breakdown: costings_breakdown,
        images: images,
        clickType:clickType
      });
      // props.setShowBookingModal();
    };
  
    function handleClickAc(i, data, city_id,clickType) {
      // let name = props.stayBookings[i]?.["name"];
      // let itinerary_id = props.stayBookings[i]["itinerary_id"];
      // let itinerary_name = props.stayBookings[i]["itinerary_name"];
      // let accommodation = props.stayBookings[i]["accommodation"];
      // let tailored_id = props.stayBookings[i]["tailored_itinerary"];
      // let user_rating = props.stayBookings[i]?.star_category;
      // let number_of_reviews = props.stayBookings[i]?.user_ratings_total;
      // let id = props.stayBookings[i]["id"];
      // let check_in = props.stayBookings[i]["check_in"];
      // let check_out = props.stayBookings[i]["check_out"];
      // let pax = {
      //   number_of_adults: props.stayBookings[i]["number_of_adults"],
      //   number_of_children: props.stayBookings[i]["number_of_children"],
      //   number_of_infants: props.stayBookings[i]["number_of_infants"],
      // };
      // let city = props.stayBookings[i]["city_name"];
      // let cityId = city_id;
      // let room_type = props.stayBookings[i]["room"];
      // _changeBookingHandler(
      //   name,
      //   itinerary_id,
      //   tailored_id,
      //   accommodation,
      //   id,
      //   check_in,
      //   check_out,
      //   pax,
      //   city,
      //   cityId,
      //   room_type,
      //   user_rating,
      //   number_of_reviews,
      //   itinerary_name,
      //   clickType
      // );
      // data.clickType=clickType
      // setCurrentBooking(data);
      // props.setShowBookingModal();
    }
  
    // function  handleClick(i, id, data, city_id) {
    //   let check_in = itineraryFilter.check_in;
    //   let check_out = itineraryFilter.check_out;
    //   setDates({ check_in, check_out });
  
    //   setBookingId(id);
    //   setCurrentBooking(data);
    //   setBookingFunData({ index: i, booking: data, city_id: city_id });
    //   setShowDetails(true);
    // }

  return (
    <>
    <div className={`flex flex-col gap-3 mt-5 ${!isPageWide ? "max-w-fit" : "max-w-[54vw]"}`}>
      <h1 className="text-[#262626] text-3xl font-bold cursor-pointer group transition duration-300 max-w-fit">
        Day By Day Itinerary
        <span className="mt-1 block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </h1>

      {/* to navigate between cities in frontend */}
      {/* <CityNavigation cities={cities} cityRefs={cityRefs} /> */}

      <div className="flex flex-col">
        <CityItem
          key={startCity?.place_id}
          city={startCity?.city_name}
          pinColour={CITY_COLOR_CODES[0 % 7]}
          onClick={() => alert(`Clicked`)}
          downPresent={false}
          upPresent={false}
          width={width}
          length={itineraryDaybyDay?.cities?.length}
        />
        <CityItem
          loadbookings={loadbookings}
          key={startCity?.gmaps_place_id}
          bookingIdToDelete={startCity?.gmaps_place_id + ":" + itineraryDaybyDay?.cities[0]?.id}
          city={
            transferBookings?.intercity?.[
              startCity?.gmaps_place_id + ":" + itineraryDaybyDay?.cities[0]?.id
            ]?.name
          }
          duration={
            transferBookings?.intercity?.[
              startCity?.gmaps_place_id + ":" + itineraryDaybyDay?.cities[0]?.id
            ]?.duration
          }
          booking_type={
            transferBookings?.intercity?.[
              startCity?.gmaps_place_id + ":" + itineraryDaybyDay?.cities[0]?.id
            ]?.booking_type
          }
          pinColour={CITY_COLOR_CODES[0 % 7]}
          onClick={() => alert(`Clicked`)}
          downPresent={true}
          upPresent={true}
          booking_id={transferBookings?.intercity?.[
            startCity?.gmaps_place_id + ":" + itineraryDaybyDay?.cities[0]?.id
          ]?.id}
          width={width}
          length={itineraryDaybyDay?.cities?.length}
          origin_city_id={startCity?.gmaps_place_id || startCity?.city_id}
          destination_city_id={itineraryDaybyDay?.cities[0]?.city?.id}
          origin_city_name={startCity?.city_name}
          destination_city_name={itineraryDaybyDay?.cities[0]?.city?.name}
          setBookingId={setBookingId}
        />
        {itineraryDaybyDay?.cities.map((city, index) => {
          var idMapping =
            city?.id + ":" + itineraryDaybyDay?.cities[index + 1]?.id;
          return (
            <>
              <ItineraryCity key={city.id} city={city} cityRefs={cityRefs} setItinerary={setItinerary} activityBookings={activityBookings} setActivityBookings={setActivityBookings} setBookingId={setBookingId} idMapping={transferBookings?.intercity?.[idMapping]?.id} setShowDetails={setShowDetails} />
              {index != itineraryDaybyDay?.cities.length - 1 && (
                <div>
                  <CityItem
                    mercury
                    loadbookings={loadbookings}
                    bookingIdToDelete={idMapping}
                    key={city.id}
                    city={transferBookings?.intercity?.[idMapping]?.name}
                    duration={
                      transferBookings?.intercity?.[idMapping]?.duration
                    }
                    booking_type={
                      transferBookings?.intercity?.[idMapping]?.booking_type
                    }
                    pinColour={CITY_COLOR_CODES[index % 7]}
                    onClick={() => alert(`Clicked`)}
                    upPresent={true}
                    downPresent={true}
                    booking_id={transferBookings?.intercity?.[idMapping]?.id}
                    width={width}
                    length={itineraryDaybyDay?.cities?.length}
                    origin_city_id={city?.city?.id}
                    destination_city_id={itineraryDaybyDay?.cities[index + 1]?.city?.id}
                    origin_city_name={city?.city?.name}
                    destination_city_name={itineraryDaybyDay?.cities[index + 1]?.city?.name}
                    setBookingId={setBookingId}
                  />
                </div>
              )}
            </>
          );
        })}
        <CityItem
          key={endCity?.gmaps_place_id}
          loadbookings={loadbookings}
          city={
            transferBookings?.intercity?.[
              itineraryDaybyDay?.cities[itineraryDaybyDay?.cities.length - 1]
                ?.id +
                ":" +
                endCity?.gmaps_place_id
            ]?.name
          }
          booking_type={
            transferBookings?.intercity?.[
              itineraryDaybyDay?.cities[itineraryDaybyDay?.cities.length - 1]
                ?.id +
                ":" +
                endCity?.gmaps_place_id
            ]?.booking_type
          }
          pinColour={CITY_COLOR_CODES[0 % 7]}
          onClick={() => alert(`Clicked`)}
          upPresent={true}
          downPresent={true}
          booking_id={transferBookings?.intercity?.[
            itineraryDaybyDay?.cities[itineraryDaybyDay?.cities.length - 1]
              ?.id +
              ":" +
              endCity?.gmaps_place_id
          ]?.id}
          width={width}
          length={itineraryDaybyDay?.cities?.length}
          origin_city_id={itineraryDaybyDay?.cities[itineraryDaybyDay?.cities.length - 1]?.city?.id}
          destination_city_id={endCity?.gmaps_place_id}
          origin_city_name={itineraryDaybyDay?.cities[itineraryDaybyDay?.cities.length - 1]?.city?.name}
          destination_city_name={endCity?.city_name}
          setBookingId={setBookingId}
        />
        <CityItem
          key={endCity?.place_id}
          city={endCity?.city_name}
          pinColour={CITY_COLOR_CODES[0 % 7]}
          onClick={() => alert(`Clicked`)}
          downPresent={false}
          upPresent={false}
          width={width}
          length={itineraryDaybyDay?.cities?.length}
        />
      </div>
    </div>
    <AccommodationModal
            mercury
            _setImagesHandler={_setImagesHandler}
            onHide={() => setShowDetails(false)}
            id={bookingId}
            currentBooking={currentBooking}
            check_in={dates.check_in}
            check_out={dates.check_out}
            show={showDetails}
            payment={payment}
            plan={stayBookings}
            // BookingButton={
            //   !isDateOlderThanCurrent(props?.plan?.start_date) ? true : false
            // }
            bookingFunData={bookingFunData}
            BookingButtonFun={() =>
              handleClickAc(
                bookingFunData.index,
                bookingFunData.booking,
                bookingFunData.city_id
              )
            }
            provider={currentBooking?.source}
            setStayBookings={setStayBookings}
            setShowDetails={setShowDetails}
          ></AccommodationModal>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    itineraryDaybyDay: state.ItineraryDaybyDay,
  };
};

export default connect(mapStateToPros)(DaybyDay);
