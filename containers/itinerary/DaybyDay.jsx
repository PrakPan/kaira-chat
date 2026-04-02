import { useEffect, useState, useRef } from "react";
import { connect, useSelector } from "react-redux";

import ItineraryCity from "../../components/itinerary/itineraryCity";
import CityItem from "./VerticalLayout";
import media from "../../components/media";
import BookingModal from "../../components/modals/bookingupdated/Index";
import { format } from "date-fns";
import { CONTENT_SERVER_HOST } from "../../services/constants";
import * as ga from "../../services/ga/Index";
import { useRouter } from "next/router";

const CITY_COLOR_CODES = [
  "#359EBF", // shade of blue
  "#F0C631", // shade of yellow
  "#BF3535", // shade of red
  "#47691e", // shade of green
  "#cc610a", // shade of orange
  "#008080", // shade of teal
  "#7d5e7d", // shade of purple
];

let availableColors = [...CITY_COLOR_CODES];
let usedColors = [];

const getCityColor = (index) => {
  if (availableColors.length === 0) {
    availableColors = [...CITY_COLOR_CODES];
    usedColors = [];
  }
  if (typeof index !== "number" || isNaN(index) || index < 0) {
    index = 0;
  }
  const color = availableColors[index % availableColors.length];
  usedColors.push(color);
  availableColors = availableColors.filter(c => c !== color);
  return color;
};

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
  index,
  setShowSettings,
  setShowCityDrawer,
  isDraft,
  showPins,
  ...props
}) => {
  const router = useRouter()
  const itineraryDaybyDay = useSelector((state) => state.Itinerary);
  const stay = useSelector((state) => state.Stays);
  const stayBookings = useSelector((state) => state.Stays);
  const [selectedBooking, setSelectedBooking] = useState({
    id: null,
    name: null,
  });
  const transferBooking = useSelector(
    (state) => state.TransferBookings
  )?.transferBookings;
  const Itinerary = useSelector(state=>state.Itinerary)

  let isPageWide = media("(min-width: 768px)");
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

  function handleClickAc(i, data, city_id, itinerary_city_id, clickType) {
    let id = stayBookings[i]?.["id"];
    let cityId =
      stayBookings[i]?.city?.id || stayBookings[i]?.city_id || city_id;
    router.push(
      {
        pathname: router.asPath.split('?')[0],
        query: {
          drawer: "changeHotelBooking",
          clickType: clickType,
          itineraryCityId: itinerary_city_id,
          booking_id: id,
          check_in: stayBookings[i]["check_in"],
          check_out: stayBookings[i]["check_out"],
          hotel_duration: stayBookings[i]?.duration,
          city_id: cityId,
          city_name: stayBookings[i]["city_name"],
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
    data.clickType = clickType;
  }


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
        className={`flex flex-col gap-3 mt-4xl max-ph:mt-lg ${!isPageWide ? "" : "max-w-[51vw]"
          }`}
      >

        <div className="flex flex-col">
          <CityItem
            setShowLoginModal={setShowLoginModal}
            key={startCity?.place_id || 1}
            city={startCity?.city_name}
            onClick={() => alert(`Clicked`)}
            downPresent={false}
            upPresent={false}
            width={width}
            length={itineraryDaybyDay?.cities?.length}
            oCityData={startCity}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            _updateTaxiBookingHandler={_updateTaxiBookingHandler}
            _updatePaymentHandler={_updatePaymentHandler}
            getPaymentHandler={getPaymentHandler}
            fromChat={props.fromChat}
            isDraft={isDraft}
            showPins={showPins}
          />
          <CityItem
            setShowLoginModal={setShowLoginModal}
            showPins={showPins}
            loadbookings={loadbookings}
            hotelName={startCity?.city_name}
            sourceGmaps={startCity?.gmaps_place_id}
            destinationHotelName={stay?.[0]?.name ? stay?.[0]?.name : null}
            sourceLat={startCity?.latitude}
            sourceLong={startCity?.longitude}
            destinationLat={stay?.[0] ? stay?.[0]?.lat : null}
            destinationLong={stay?.[0] ? stay?.[0]?.long : null}
            destinationGmaps={stay?.[0] ? stay?.[0]?.city_gmaps_place_id || itineraryDaybyDay?.cities?.[0]?.city?.gmaps_place_id: itineraryDaybyDay?.cities?.[0]?.city?.gmaps_place_id}
            key={2}
            date_of_journey={Itinerary?.start_date}
            pinColour={getCityColor(index)}
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
            booking={
              transferBookings?.intercity?.[
              startCity?.gmaps_place_id +
              ":" +
              itineraryDaybyDay?.cities?.[0]?.id
              ]
            }
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
            airportBookings={sortByCheckIn([
              ...(transferBooking?.airport?.[
                itineraryDaybyDay?.cities?.[0]?.id
              ]?.filter((book) => book?.is_airport_pickup) || []),
              ...(transferBooking?.airport?.[startCity?.gmaps_place_id]?.filter(
                (book) =>
                  book?.is_airport_drop &&
                  book?.check_in?.split(" ")[0] <=
                  itineraryDaybyDay?.cities?.[0]?.start_date
              ) || []),
            ])}
            transfer_type={
              transferBookings?.intercity?.[
                startCity?.gmaps_place_id +
                ":" +
                itineraryDaybyDay?.cities?.[0]?.id
              ]?.transfer_type
            }
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
            origin_city_name={transferBookings?.intercity?.[
              startCity?.gmaps_place_id +
              ":" +
              itineraryDaybyDay?.cities?.[0]?.id
            ]?.transfer_details?.source?.name || startCity?.city_name}
            destination_city_name={transferBookings?.intercity?.[
              startCity?.gmaps_place_id +
              ":" +
              itineraryDaybyDay?.cities?.[0]?.id
            ]?.transfer_details?.destination?.name || itineraryDaybyDay?.cities?.[0]?.city?.name}
            // setBookingId={setBookingId}
            oCityData={startCity}
            dCityData={itineraryDaybyDay?.cities?.[0]}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            _updatePaymentHandler={_updatePaymentHandler}
            _updateTaxiBookingHandler={_updateTaxiBookingHandler}
            getPaymentHandler={getPaymentHandler}
            firstCity={true}
            fromChat={props.fromChat}
            isDraft={isDraft}
          />
          {itineraryDaybyDay?.cities?.map((city, index) => {
            var idMapping =
              city?.id + ":" + itineraryDaybyDay?.cities?.[index + 1]?.id;

            const cityHotels = stay?.filter(hotel =>
              hotel?.itinerary_city_id === city?.id
            ) || [];

            const totalDuration = city?.duration;

            let sourceKey = city?.id;
            let airportBookings = [
              ...(transferBooking?.airport[sourceKey]?.filter(
                (booking) => booking?.is_airport_drop
              ) || []),
              ...(transferBooking?.airport?.[
                itineraryDaybyDay?.cities?.[index + 1]?.id
              ]?.filter((booking) => booking?.is_airport_pickup) || []),
            ];

            let intracityBookings = transferBooking?.intracity[sourceKey] || [];

            if (airportBookings?.length > 0) {
              airportBookings = sortByCheckIn(airportBookings);
            }
            if (intracityBookings?.length > 0) {
              intracityBookings = sortByCheckIn(intracityBookings);
            }



            return (
              <div key={city.id}>    
                <ItineraryCity
                  mercuryItinerary={props?.mercuryItinerary}
                  key={`itinerary-city-${city.id}`}
                  nextCity={ itineraryDaybyDay?.cities?.[index + 1]}
                  city={city}
                  cityRefs={cityRefs}
                  setItinerary={setItinerary}
                  activityBookings={activityBookings}
                  setActivityBookings={setActivityBookings}

                  idMapping={transferBookings?.intercity?.[idMapping]?.id}
                  setShowLoginModal={setShowLoginModal}
                  handleClickAc={handleClickAc}
                  index={index}
                  cityHotels={cityHotels}
                  totalDuration={totalDuration}
                  itinerary_city_id={city?.id}
                  intracityBookings={intracityBookings}
                  _updateFlightBookingHandler={_updateFlightBookingHandler}
                  _updateTaxiBookingHandler={_updateTaxiBookingHandler}
                  _updatePaymentHandler={_updatePaymentHandler}
                  getPaymentHandler={getPaymentHandler}
                  setShowSettings={setShowSettings}
                  setShowCityDrawer={setShowCityDrawer}
                  isDraft={isDraft}
                />
                {index != itineraryDaybyDay?.cities?.length - 1 && (
                  <div>
                    <CityItem
                      setShowLoginModal={setShowLoginModal}
                      mercury
                      check_in={stay?.[index] ? stay?.[index]?.check_in : null}
                      check_out={stay?.[index] ? stay?.[index]?.check_out : null}
                      hotelName={stay?.[index]?.name ? stay?.[index]?.name : null}
                      sourceGmaps={stay?.[index] ? stay?.[index]?.city_gmaps_place_id || city?.city?.gmaps_place_id : city?.city?.gmaps_place_id}
                      destinationGmaps={stay?.[index + 1] ? stay?.[index + 1]?.city_gmaps_place_id || itineraryDaybyDay?.cities?.[index + 1]?.city?.gmaps_place_id: itineraryDaybyDay?.cities?.[index + 1]?.city?.gmaps_place_id}
                      sourceLat={stay?.[index] ? stay?.[index]?.lat : null}
                      sourceLong={stay?.[index] ? stay?.[index]?.long : null}
                      destinationLat={stay?.[index + 1] ? stay?.[index + 1]?.lat : null}
                      destinationLong={stay?.[index + 1] ? stay?.[index + 1]?.long : null}
                      destinationHotelName={stay?.[index + 1]?.name ? stay?.[index + 1]?.name : null}
                      loadbookings={loadbookings}
                      bookingIdToDelete={idMapping}
                      key={city.id}
                      lat={startCity?.latitude}
                      long={startCity?.longitude}
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
                      pinColour={getCityColor(index)}
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
                      origin_city_name={transferBookings?.intercity?.[idMapping]?.transfer_details?.source?.name || city?.city?.name}
                      destination_city_name={
                        transferBookings?.intercity?.[idMapping]?.transfer_details?.destination?.name || itineraryDaybyDay?.cities?.[index + 1]?.city?.name
                      }

                      oCityData={itineraryDaybyDay?.cities?.[index]}
                      dCityData={itineraryDaybyDay?.cities?.[index + 1]}
                      selectedBooking={selectedBooking}
                      setSelectedBooking={setSelectedBooking}
                      _updateFlightBookingHandler={_updateFlightBookingHandler}
                      _updateTaxiBookingHandler={_updateTaxiBookingHandler}
                      _updatePaymentHandler={_updatePaymentHandler}
                      getPaymentHandler={getPaymentHandler}
                      fromChat={props.fromChat}
                    />
                  </div>
                )}
              </div>
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
            hotelName={stay?.[itineraryDaybyDay?.cities?.length - 1]?.name ? stay?.[itineraryDaybyDay?.cities?.length - 1]?.name : null}
            sourceGmaps={stay?.[itineraryDaybyDay?.cities?.length - 1] ? stay?.[itineraryDaybyDay?.cities?.length - 1]?.city_gmaps_place_id : itineraryDaybyDay?.cities?.[itineraryDaybyDay?.cities?.length - 1]?.city?.gmaps_place_id}
            sourceLat={stay?.[itineraryDaybyDay?.cities?.length - 1] ? stay?.[itineraryDaybyDay?.cities?.length - 1]?.lat : null}
            sourceLong={stay?.[itineraryDaybyDay?.cities?.length - 1] ? stay?.[itineraryDaybyDay?.cities?.length - 1]?.long : null}
            destinationLat={endCity?.latitude}
            destinationLong={endCity?.longitude}
            destinationGmaps={endCity?.gmaps_place_id}
            destinationHotelName={endCity?.city_name}
            airportBookings={sortByCheckIn([
              ...(transferBooking?.airport?.[endCity?.gmaps_place_id]?.filter(
                (booking) =>
                  booking?.is_airport_pickup &&
                  booking?.check_in?.split?.(" ")?.[0] >=
                  itineraryDaybyDay?.cities?.[
                    itineraryDaybyDay?.cities?.length - 1
                  ]?.start_date
              ) || []),
              ...(transferBooking?.airport?.[
                itineraryDaybyDay?.cities?.[
                  itineraryDaybyDay?.cities?.length - 1
                ]?.id
              ]?.filter((book) => book?.is_airport_drop) || []),
            ])}
            intracityBookings={
              transferBooking?.intracity[
                itineraryDaybyDay?.cities?.[
                  itineraryDaybyDay?.cities?.length - 1
                ]?.id
              ]
                ? sortByCheckIn(
                  transferBooking?.intracity[
                  itineraryDaybyDay?.cities?.[
                    itineraryDaybyDay?.cities?.length - 1
                  ]?.id
                  ]
                )
                : []
            }
            city={
              transferBookings?.intercity?.[
                itineraryDaybyDay?.cities?.[
                  itineraryDaybyDay?.cities?.length - 1
                ]?.id +
                ":" +
                endCity?.gmaps_place_id
              ]?.name
            }
            booking={transferBookings?.intercity?.[
              itineraryDaybyDay?.cities?.[
                itineraryDaybyDay?.cities?.length - 1
              ]?.id +
              ":" +
              endCity?.gmaps_place_id
            ]}
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
            pinColour={getCityColor(index)}
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
              transferBookings?.intercity?.[
                itineraryDaybyDay?.cities?.[
                  itineraryDaybyDay?.cities?.length - 1
                ]?.id +
                ":" +
                endCity?.gmaps_place_id
              ]?.transfer_details?.source?.name || itineraryDaybyDay?.cities?.[itineraryDaybyDay?.cities?.length - 1]
                ?.city?.name
            }
            destination_city_name={transferBookings?.intercity?.[
              itineraryDaybyDay?.cities?.[
                itineraryDaybyDay?.cities?.length - 1
              ]?.id +
              ":" +
              endCity?.gmaps_place_id
            ]?.transfer_details?.destination?.name || endCity?.city_name}
            // setBookingId={setBookingId}
            oCityData={
              itineraryDaybyDay?.cities?.[itineraryDaybyDay?.cities?.length - 1]
            }
            dCityData={endCity}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            _updateTaxiBookingHandler={_updateTaxiBookingHandler}
            _updatePaymentHandler={_updatePaymentHandler}
            getPaymentHandler={getPaymentHandler}
            lastCity={true}
            date_of_journey={Itinerary?.end_date}
            fromChat={props.fromChat}
            isDraft={isDraft}
            showPins={showPins}
          />
          <CityItem
            setShowLoginModal={setShowLoginModal}
            key={endCity?.place_id}
            city={endCity?.city_name}
            pinColour={getCityColor(index)}
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
            isLast={true}
            fromChat={props.fromChat}
            isDraft={isDraft}
            showPins={showPins}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    itineraryDaybyDay: state.ItineraryDaybyDay,
  };
};

export default connect(mapStateToPros)(DaybyDay);
