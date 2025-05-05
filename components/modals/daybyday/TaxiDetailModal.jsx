import React from "react";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import Image from "next/image";
import BackArrow from "../../ui/BackArrow";
import ImageLoader from "../../ImageLoader";
import { Generalbuttonstyle } from "../../ui/button/Generallinkbutton";
import ComboTaxi from "../taxis/ComboTaxi";
import { useState } from "react";

const BackText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const Text = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;


const TaxiDetailModal = ({
  data,
  setIsOpen,
  setHandleShow,
  handleDelete,
  loading,
  booking,
  type,
  isEmbedded
}) => {
  if (!data) return null;

  const {
    name,
    transfer_details,
    number_of_adults,
    number_of_children,
    source_address,
    destination_address,
    check_in,
    check_out,
  } = data;

  const [showTaxi,setShowTaxi]  = useState(false);
  console.log("Taxi Data",data);
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        weekday: "short",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

   const addMinutesToDate = (dateString, minutes) => {
    console.log("Date String", dateString);
    const date = new Date(dateString);
    console.log("date is:")
    date.setMinutes(date.getMinutes() + minutes);
    return formatDateTime(date.toISOString());
  };
  const departure = check_in || transfer_details?.start_datetime || transfer_details?.gozo?.start_date;
  const duration = transfer_details?.duration;
  const arrival = formatDateTime(check_out) || addMinutesToDate(departure, duration);
  const depart = formatDateTime(departure);

  const distance = transfer_details?.distance?.text || `${transfer_details?.distance?.value} km`;
  const duration_text = transfer_details?.duration?.text;
  const model = transfer_details?.quote?.taxi_category?.model_name;
  const fuelType = transfer_details?.quote?.taxi_category?.fuel_type;
  const luggageBags = transfer_details?.quote?.taxi_category?.bag_capacity;
  const seatCapacity = transfer_details?.quote?.taxi_category?.seating_capacity;

  return (
    !showTaxi ? <>
      <div className=" bg-gray-50 w-full h-full flex flex-col">
       { !isEmbedded && <div className="p-4 flex items-center justify-between">
          <BackArrow handleClick={() => setHandleShow(false)} />
        </div>}

        <div className="px-4 flex justify-between">
          <h1 className="text-xl font-bold text-gray-800 ">
            {loading ? (
              <div className="w-64 h-7 bg-gray-300 opacity-50 rounded"></div>
            ) : (
              `Taxi from ${source_address?.name} to ${destination_address?.name}`
            )}
          </h1>
          {!isEmbedded  && 
                  <div className="font-lexend flex justify-between items-start !m-0">
                {loading ? (
              <div className="w-16 h-5 bg-gray-300 opacity-50 rounded"></div>
            ) : (
              <>
              {/* <Text>{name}</Text> */}
                    <Generalbuttonstyle
                      borderRadius={"7px"}
                      fontSize={"1rem"}
                      padding={"7px 25px"}
                      onClick={()=>{setShowTaxi(true);console.log("")}}
                    >
                      Change
                    </Generalbuttonstyle>
                    </>
            )}
          </div>}
        </div>

        {/* Journey Card */}
        <div className="flex-1 px-4 pt-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm relative border border-gray-100">
            {/* Distance and Duration Banner */}
            <div className="relative flex justify-center items-center mb-6 mt-2">
              {/* Left dotted line */}
              <div className="absolute left-0 right-1/2 border-t border-dashed border-gray-300 h-0" style={{ marginRight: "20px" }}></div>
              
              {/* Distance and duration pill */}
              <div className="bg-gray-200 px-4 py-1 rounded-full text-sm">
                {loading ? (
                  <div className="w-24 h-4 bg-gray-300 opacity-50 rounded"></div>
                ) : (
                  `${distance} | ${duration_text}`
                )}
              </div>
              
              {/* Right dotted line */}
              <div className="absolute right-0 left-1/2 border-t border-dashed border-gray-300 h-0" style={{ marginLeft: "20px" }}></div>
              
              {/* Left pin circle */}
              <div className="absolute left-0 w-3 h-3 bg-gray-300 rounded-full"></div>
              
              {/* Right pin circle */}
              <div className="absolute right-0 w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>

            {/* Route Info */}
            <div className="flex justify-between mb-6">
              <div className="flex flex-col items-start">
                <div>
                  {loading ? (
                    <>
                      <div className="w-32 h-5 bg-gray-300 opacity-50 rounded mb-1"></div>
                      <div className="w-36 h-4 bg-gray-300 opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-lg">
                        {source_address?.name}
                      </p>
                      <p className="text-gray-600 text-sm flex flex-col sm:flex-row sm:gap-1">
  <span>{depart.time}</span>
  <span>{depart.date}</span>
</p>
                    </>
                  )}
                </div>
              </div>


              <div className="flex flex-col items-end">
                <div className="text-right">
                  {loading ? (
                    <>
                      <div className="w-32 h-5 bg-gray-300 opacity-50 rounded mb-1"></div>
                      <div className="w-36 h-4 bg-gray-300 opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      {destination_address?.name && <p className="font-bold text-lg">
                        {destination_address?.name}
                      </p>}
                      <p className="text-gray-600 text-sm flex flex-col sm:flex-row sm:gap-1">
  <span>{arrival.time ? arrival.time  : ""}</span>
  <span>{arrival.date ? arrival.date : ""}</span>
</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Taxi Details Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
  <p className="font-semibold text-gray-800 mb-4">
    {loading ? (
      <div className="w-24 h-5 bg-gray-300 opacity-50 rounded"></div>
    ) : (
      "TAXI DETAILS"
    )}
  </p>

  <div className="flex flex-col md:flex-row gap-4">
    <div className="w-full md:w-auto border border-gray-200 rounded-lg p-3 flex justify-center items-center" style={{ height: '140px' }}>
      {loading ? (
        <div className="w-full h-full bg-gray-300 opacity-50 rounded"></div>
      ) : (
        <div className="flex items-center justify-center  h-full">
          {data?.transfer_details?.quote?.taxi_category?.image ? (
            <ImageLoader
              className="object-contain max-w-full max-h-full"
              url={data?.transfer_details?.quote?.taxi_category?.image}
              leftalign
              height="auto"
              width="auto"
            />
          ) : (
            <Image 
              src="/taxi-default.jpg" 
              width={140}
              height={100}
              alt="Taxi" 
              className="object-contain max-h-full"
            />
          )}
        </div>
      )}
    </div>

    {/* Taxi Details Grid - Full width on mobile */}
    <div className="flex-1 w-full">
      <div className="grid grid-cols-2 gap-4">
        {/* Model */}
        {model && <div>
          <p className="text-gray-500 text-sm">Model</p>
          <p className="font-semibold text-gray-800">{loading ? <div className="w-20 h-5 bg-gray-300 opacity-50 rounded"></div> : model}</p>
        </div>}

        {/* Fuel Type */}
        {fuelType && <div>
          <p className="text-gray-500 text-sm">Fuel Type</p>
          <p className="font-semibold text-gray-800">{loading ? <div className="w-20 h-5 bg-gray-300 opacity-50 rounded"></div> : fuelType}</p>
        </div>}

        {/* Luggage Bags */}
        {luggageBags && <div>
          <p className="text-gray-500 text-sm">Luggage Bags</p>
          <p className="font-semibold text-gray-800">{loading ? <div className="w-10 h-5 bg-gray-300 opacity-50 rounded"></div> : luggageBags}</p>
        </div>}

        {/* Seat Capacity */}
        {seatCapacity && <div>
          <p className="text-gray-500 text-sm">Seat Capacity</p>
          <p className="font-semibold text-gray-800">{loading ? <div className="w-24 h-5 bg-gray-300 opacity-50 rounded"></div> : seatCapacity}</p>
        </div>}
      </div>
    </div>
  </div>
</div>
          </div>
        </div>

        {/* Delete Booking Button (Fixed) */}
        {handleDelete && type !== "combo" && (
          <div className="p-4 bg-white">
            <button
              className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center"
              onClick={() => handleDelete(booking)}
              disabled={loading}
            >
              <div style={{ position: "relative" }}>
                <div
                  className="flex gap-1 items-center text-white"
                  style={loading ? { visibility: "hidden" } : {}}
                >
                  <Image src="/delete.svg" width={20} height={20} alt="Delete icon" /> 
                  <div>Delete Booking</div>
                </div>
                {loading && (
                  <PulseLoader
                    style={{
                      position: "absolute",
                      top: "55%",
                      left: "50%",
                      transform: "translate(-50% , -50%)",
                    }}
                    size={12}
                    speedMultiplier={0.6}
                    color="#ffffff"
                  />
                )}
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  :
  <ComboTaxi
  key={data.id}
  edge={data?.edge}
  combo={false}
  // handleFlightSelect={handleFlightSelect}
  showTaxiModal={showTaxi}
  setShowComboTaxiModal={setShowTaxi}
  setHideTaxiModal={()=>setShowTaxi(false)}
  // setHideBookingModal={setHideBookingModal}
  // getPaymentHandler={getPaymentHandler}
  // _updatePaymentHandler={_updatePaymentHandler}
  // _updateFlightBookingHandler={
  //   _updateFlightBookingHandler
  // }
  // _updateBookingHandler={_updateBookingHandler}
  // alternates={alternates}
  // tailored_id={tailored_id}
   selectedBooking={data}
  itinerary_id={data?.itinerary_id}
  // selectedTransferHeading={selectedTransferHeading}
  // fetchData={fetchData}
  // setShowLoginModal={setShowLoginModal}
  // check_in={check_in}
  // _GetInTouch={_GetInTouch}
  // daySlabIndex={daySlabIndex}
  // elementIndex={elementIndex}
  // routeId={routeId}
  mercuryTransfer={data}
  // individual={individual}
  originCityId={data?.trips?.[0]?.origin?.city_id}
  destinationCityId={data?.trips?.[0]?.destination?.city_id}
  // isSelected={
  //   selectedModeIds[currentStep - 1] === option.id
  // }
  // onSelect={handleTaxiSelection}
  comboStartDate={data?.trips?.[0]?.start_date}
  comboStartTime={data?.trips?.[0]?.start_time}
  // // skipFetch={skipTaxiFetch}
  // onFilterApplied={handleFilterApplied}
  // dCityData={dCityData}
  // oCityData={oCityData}
/>

  );
};

// {
//   "id": "80f76f78-029a-4636-a930-9044ff6c6035",
//   "transfer_details": {
//       "gozo": {
//           "id": 5258143,
//           "dbo": {
//               "status": false
//           },
//           "payUrl": "https://www.gozocabs.com/bkpn/5258143/9ShYH/p/h9Nea",
//           "cabRate": {
//               "cab": {
//                   "id": 1,
//                   "type": "Compact (Value)",
//                   "image": "https://api.gozocabs.com/images/cabs/car-indica.jpg",
//                   "sClass": "Value",
//                   "category": "Compact",
//                   "isAssured": "0",
//                   "categoryId": "1",
//                   "bagCapacity": 2,
//                   "cabCategory": {
//                       "id": 1,
//                       "type": "Compact",
//                       "catRank": "1",
//                       "catClass": "Value",
//                       "scvmodel": "Compact (Value)",
//                       "scvParent": "0",
//                       "catClassRank": "2",
//                       "scvVehicleId": "1",
//                       "scvVehicleModel": "0",
//                       "scvVehicleServiceClass": "1"
//                   },
//                   "instructions": [
//                       "Diesel or Petrol Cabs only"
//                   ],
//                   "bigBagCapaCity": 1,
//                   "seatingCapacity": 4
//               },
//               "fare": {
//                   "gst": 222,
//                   "minPay": 1164,
//                   "promos": [],
//                   "gstRate": 5,
//                   "tollTax": 50,
//                   "baseFare": 4135,
//                   "discount": 0,
//                   "stateTax": 0,
//                   "dueAmount": 4657,
//                   "gozoCoins": 0,
//                   "airportFee": 0,
//                   "promoCoins": 0,
//                   "addOnCharge": 0,
//                   "advanceSlab": [
//                       {
//                           "label": "Pay (25%)",
//                           "value": 1164,
//                           "isSelected": 1,
//                           "percentage": 25
//                       },
//                       {
//                           "label": "Pay (50%)",
//                           "value": 2329,
//                           "isSelected": 0,
//                           "percentage": 50
//                       },
//                       {
//                           "label": "Full payment (100%)",
//                           "value": 4657,
//                           "isSelected": 0,
//                           "percentage": 100
//                       }
//                   ],
//                   "netBaseFare": 4135,
//                   "totalAmount": 4657,
//                   "addonCharges": [],
//                   "customerPaid": 0,
//                   "extraTimeCap": 30,
//                   "tollIncluded": 1,
//                   "vendorAmount": 3654,
//                   "minPayPercent": 25,
//                   "parkingCharge": 0,
//                   "extraPerKmRate": 15.5,
//                   "airportEntryFee": 0,
//                   "driverAllowance": 250,
//                   "extraPerMinRate": 2,
//                   "parkingIncluded": 0,
//                   "vendorCollected": 0,
//                   "additionalCharge": 0,
//                   "stateTaxIncluded": 1,
//                   "extraPerMinCharge": 2,
//                   "nightDropIncluded": 1,
//                   "nightPickupIncluded": 1,
//                   "airportChargeIncluded": 0
//               }
//           },
//           "cabType": 1,
//           "tripDesc": "One Way",
//           "tripType": 1,
//           "bookingId": "QT505258143",
//           "isGozoNow": 0,
//           "startDate": "2025-05-25",
//           "startTime": "00:00:00",
//           "statusCode": 1,
//           "statusDesc": "Quoted",
//           "totalDistance": 81,
//           "estimatedDuration": 135,
//           "verification_code": "602955",
//           "partnerTransactionDetails": {
//               "markup": 0,
//               "advance": 0,
//               "discount": 0,
//               "commission": 0,
//               "creditsUsed": 0,
//               "additionalAmount": 0
//           }
//       },
//       "quote": {
//           "price": {
//               "gst": 222,
//               "total": 4657,
//               "margin": null,
//               "currency": "INR",
//               "breakdown": {
//                   "distance": 81,
//                   "per_km_price": null,
//                   "driver_charges": null
//               },
//               "taxi_price": 4135,
//               "refund_policies": null,
//               "cancellation_policy": "FLEXI"
//           },
//           "per_km_cost": null,
//           "result_index": "a6ba8816-d5bd-4fd5-8465-13dd80fc13b2",
//           "taxi_category": {
//               "id": 1,
//               "type": "Compact (Value)",
//               "image": "media/crm/cabid-1.jpg",
//               "fuel_type": "Diesel/Petrol",
//               "model_name": "Swift, Celerio or equivalent Diesel/Petrol",
//               "bag_capacity": 2,
//               "seating_capacity": 4
//           },
//           "extra_per_hour_cost": 120
//       },
//       "trips": [
//           {
//               "origin": {
//                   "hub_id": "562649e1-c81e-4c64-968e-a6a2334cfd06",
//                   "address": "Pulwama",
//                   "city_id": "77f19c83-93ad-4ca5-ae24-04e88ba4cce1",
//                   "coordinates": {
//                       "latitude": 33.9818889,
//                       "longitude": 75.0143824
//                   }
//               },
//               "end_date": "2025-05-25",
//               "end_time": "02:15",
//               "trip_type": "one-way",
//               "start_date": "2025-05-25",
//               "start_time": "00:00",
//               "destination": {
//                   "hub_id": "702ada7a-08b7-4291-97f6-3a8683dc449d",
//                   "address": "Gulmarg",
//                   "city_id": "c632c1df-8441-41b5-bb5c-f6883c624649",
//                   "coordinates": {
//                       "latitude": 34.0483704,
//                       "longitude": 74.3804791
//                   }
//               },
//               "number_of_travellers": 2
//           }
//       ],
//       "source": "Gozo",
//       "distance": {
//           "text": "81 kms",
//           "unit": "km",
//           "value": 81
//       },
//       "duration": {
//           "text": "2-3 hours",
//           "unit": "minute",
//           "value": 135
//       },
//       "reference": {
//           "id": null
//       }
//   },
//   "created_at": "2025-04-29 17:07:27",
//   "modified_at": "2025-04-29 17:07:27",
//   "image": null,
//   "image_alt_text": null,
//   "image_credit": null,
//   "name": "Taxi from Shar-I- Shali to Gulmarg",
//   "price": 4657,
//   "currency": "INR",
//   "number_of_adults": 2,
//   "number_of_children": 0,
//   "number_of_infants": 0,
//   "user_selected": false,
//   "check_in": "2025-05-25 00:00:00",
//   "check_out": "2025-05-25 02:15:00",
//   "booking_source": "Gozo",
//   "itinerary_id": "bcb4500b-1382-4008-82fb-22c6d9082622",
//   "status": "Quoted",
//   "policies": [],
//   "terms_and_guidelines": "[]",
//   "voucher": null,
//   "price_valid_until": "2025-04-30 05:07:27",
//   "booking_type": "Taxi",
//   "transfer_type": "one-way",
//   "source_address": {
//       "code": null,
//       "kind": "town",
//       "name": "Pulwama",
//       "hub_id": "562649e1-c81e-4c64-968e-a6a2334cfd06",
//       "source": "Hub",
//       "city_id": "77f19c83-93ad-4ca5-ae24-04e88ba4cce1",
//       "country": "India",
//       "latitude": null,
//       "timezone": "Asia/Kolkata",
//       "city_name": "Pulwama",
//       "longitude": null,
//       "state_name": "Jammu & Kashmir",
//       "country_code": "IN",
//       "gmaps_place_id": null
//   },
//   "destination_address": {
//       "code": null,
//       "kind": "village",
//       "name": "Gulmarg",
//       "hub_id": "702ada7a-08b7-4291-97f6-3a8683dc449d",
//       "source": "Hub",
//       "city_id": "c632c1df-8441-41b5-bb5c-f6883c624649",
//       "country": "India",
//       "latitude": null,
//       "timezone": "Asia/Kolkata",
//       "city_name": "Gulmarg",
//       "longitude": null,
//       "state_name": "Jammu & Kashmir",
//       "country_code": "IN",
//       "gmaps_place_id": null
//   },
//   "is_airport_pickup": false,
//   "is_airport_drop": false,
//   "customer": null,
//   "source": "a4748ea2-57d1-481a-b562-08e564cf50cc",
//   "destination": "c41ca3a5-dd15-42f6-8787-e4b21efde472",
//   "parent": null,
//   "edge": "b4a0aa1f-9049-4410-bd0a-be54d3217012"
// }

export default TaxiDetailModal;