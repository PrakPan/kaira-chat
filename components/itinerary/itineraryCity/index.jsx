import { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

import CitySummary from "./CitySummary";
import CityDaybyDay from "./CityDaybyDay";
import { MdOutlineStar } from "react-icons/md";
import { getStars } from "./SlabElement";
import Image from "next/image";
import { useSelector } from "react-redux";
import {
  bookingDetails,
  hotelDetails,
} from "../../../services/bookings/FetchAccommodation";
import { useRouter } from "next/router";
import Drawer from "../../ui/Drawer";
import HotelBookingDetails from "../../modals/accommodation/Overview/HotelBookingDetails";
import Overview from "../../modals/accommodation/Overview/Overview";
import AccommodationModal from "../../modals/accommodation/Index";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import { logEvent } from "../../../services/ga/Index";
import { toast } from "react-toastify";

const Container = styled.div`
  padding: 0 0.75rem 0.75rem 0.75rem;
  @media screen and (min-width: 768px) {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }
`;

const BackContainer = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  position: sticky;
  z-index: 1;
  background: white;
  top: 0;
  padding-block: 0.75rem;

  @media screen and (min-width: 768px) {
    padding-block: 1rem;
  }
`;

const BackText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const FloatingVContaineriew = styled.div`
  position: sticky;
  bottom: 10px;
  background: #f7e700;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 90%;
  z-index: 2;
  cursor: pointer;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 90%;
  margin: auto;
  text-align: center;
`;
const ItineraryCity = (props) => {
  const router = useRouter();
  const [viewMore, setViewMore] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [data,setData]=useState(null)
  const {token} = useSelector((state)=>state.auth)
  const stay = useSelector((state)=>state.Stays)
  const {itinerary_status,transfers_status,pricing_status, hotels_status} = useSelector((state) => state.ItineraryStatus);
  const fetchDetails = () => {
    setShowDetails(true);
    bookingDetails
      .get(
        `/${router?.query?.id}/bookings/accommodation/${props.city.hotels[0]?.id}/`
      )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        toast.error("unable to get detail");
        setShowDetails(false);
      });
  };
  const handleStay = (e, label, value, clickType) => {
    e.stopPropagation();
    if (token)
      props?.handleClickAc(
        props?.index,
        props?.city,
        props.city.city.id,
        clickType
      );
    else props?.setShowLoginModal(true);
    props?.setBookingId(props?.key);

    logEvent({
      action: "Hotel_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_value: value,
        event_action: "Stays",
      },
    });
  };

//   {
//     "id": "e0ff38ac-1ec3-477c-b35f-639f2ca1ae4f",
//     "hotel_details": {
//         "id": "39649429",
//         "city": "Kochi",
//         "name": "Brunton Boatyard - Cgh Earth",
//         "addr1": "Calvetty Road",
//         "addr2": "Fort Kochi",
//         "items": [
//             {
//                 "code": "itmfusg",
//                 "type": "HOTEL"
//             }
//         ],
//         "price": null,
//         "rates": [
//             {
//                 "id": "07760baf-04e9-41c0-abee-a03e26c0f6d2",
//                 "rooms": [
//                     {
//                         "id": "96b7cefb-f7cf-4417-9312-e7d625e521a5",
//                         "beds": [
//                             {
//                                 "type": "1 Queen Bed",
//                                 "count": "0"
//                             }
//                         ],
//                         "name": "Superior Room, 1 Queen Bed",
//                         "views": [],
//                         "images": [
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/30b10947_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/a0cbe4df_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/cc43813c_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/b76a4857_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/4aa62945_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/3fbd0781_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/efff7b1d_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/7d9aa9b7_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/cdd68a0e_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/b328b577_b.jpg",
//                                 "caption": "Living area"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/30ef9bc5_b.jpg",
//                                 "caption": "Coffee and/or coffee maker"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/c4aee61c_b.jpg",
//                                 "caption": "Bathroom"
//                             }
//                         ],
//                         "facilities": [
//                             "Telephone accessibility kit",
//                             "Television",
//                             "Smoking and Non-Smoking",
//                             "Local maps",
//                             "Electric kettle",
//                             "Satellite TV service",
//                             "Iron/ironing board (on request)",
//                             "Soundproofed rooms",
//                             "Minibar",
//                             "Bathtub or shower",
//                             "Coffee/tea maker",
//                             "Ceiling fan",
//                             "Daily housekeeping",
//                             "Free WiFi",
//                             "Phone",
//                             "Desk",
//                             "WiFi speed - 25+ Mbps",
//                             "Towels provided",
//                             "Soap",
//                             "LED TV",
//                             "Toilet paper",
//                             "Wireless internet access",
//                             "Shampoo",
//                             "TV size measurement: inch",
//                             "Private bathroom",
//                             "Bathrobes",
//                             "Free toiletries",
//                             "Hair dryer",
//                             "Air conditioning",
//                             "TV size: 32",
//                             "In-room safe",
//                             "Free bottled water",
//                             "Room service (limited hours)"
//                         ],
//                         "description": "Superior Room, 1 Queen Bed",
//                         "std_room_id": "1",
//                         "smoking_allowed": false,
//                         "number_of_adults": "2",
//                         "max_adult_allowed": "3",
//                         "max_guest_allowed": "3",
//                         "number_of_children": "0",
//                         "max_children_allowed": "2"
//                     },
//                     {
//                         "id": "96b7cefb-f7cf-4417-9312-e7d625e521a5",
//                         "beds": [
//                             {
//                                 "type": "1 Queen Bed",
//                                 "count": "0"
//                             }
//                         ],
//                         "name": "Superior Room, 1 Queen Bed",
//                         "views": [],
//                         "images": [
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/30b10947_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/a0cbe4df_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/cc43813c_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/b76a4857_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/4aa62945_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/3fbd0781_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/efff7b1d_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/7d9aa9b7_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/cdd68a0e_b.jpg",
//                                 "caption": "Room"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/b328b577_b.jpg",
//                                 "caption": "Living area"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/30ef9bc5_b.jpg",
//                                 "caption": "Coffee and/or coffee maker"
//                             },
//                             {
//                                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/c4aee61c_b.jpg",
//                                 "caption": "Bathroom"
//                             }
//                         ],
//                         "facilities": [
//                             "Telephone accessibility kit",
//                             "Television",
//                             "Smoking and Non-Smoking",
//                             "Local maps",
//                             "Electric kettle",
//                             "Satellite TV service",
//                             "Iron/ironing board (on request)",
//                             "Soundproofed rooms",
//                             "Minibar",
//                             "Bathtub or shower",
//                             "Coffee/tea maker",
//                             "Ceiling fan",
//                             "Daily housekeeping",
//                             "Free WiFi",
//                             "Phone",
//                             "Desk",
//                             "WiFi speed - 25+ Mbps",
//                             "Towels provided",
//                             "Soap",
//                             "LED TV",
//                             "Toilet paper",
//                             "Wireless internet access",
//                             "Shampoo",
//                             "TV size measurement: inch",
//                             "Private bathroom",
//                             "Bathrobes",
//                             "Free toiletries",
//                             "Hair dryer",
//                             "Air conditioning",
//                             "TV size: 32",
//                             "In-room safe",
//                             "Free bottled water",
//                             "Room service (limited hours)"
//                         ],
//                         "description": "Superior Room, 1 Queen Bed",
//                         "std_room_id": "1",
//                         "smoking_allowed": false,
//                         "number_of_adults": "2",
//                         "max_adult_allowed": "3",
//                         "max_guest_allowed": "3",
//                         "number_of_children": "0",
//                         "max_children_allowed": "2"
//                     }
//                 ],
//                 "polices": [
//                     {
//                         "text": "We don't guarantee an Extra Bed for Extra guests, it is subject to availability of the hotel and may be chargeable as well.",
//                         "type": "Extra Guest Info"
//                     }
//                 ],
//                 "currency": "INR",
//                 "includes": [
//                     "Free WiFi"
//                 ],
//                 "base_rate": 8854.98,
//                 "sell_rate": 10243,
//                 "final_rate": 10716,
//                 "refundable": true,
//                 "tax_amount": 1388.83,
//                 "board_basis": {
//                     "type": "RoomOnly",
//                     "description": "ROOM ONLY"
//                 },
//                 "pay_at_hotel": false,
//                 "cancellation_policies": [
//                     {
//                         "text": "Fully refundable for cancellations done before 02:00 PM, 17 March (local time at the property). Charges for cancellations done after the above-mentioned time - booking amount equivalent to 1 night and taxes. ",
//                         "rules": []
//                     }
//                 ],
//                 "all_guests_info_required": false,
//                 "final_rate_with_default_agent_markup": 10716
//             }
//         ],
//         "state": "Kerala",
//         "images": [
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/2500f837_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Primary image"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/2277fceb_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Lobby"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/e4b62881_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Lobby"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/0355cc98_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Lobby sitting area"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/86418d6c_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Lobby lounge"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/59ea9f48_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Lobby lounge"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/30b10947_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/46dc347a_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/89486863_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/a0cbe4df_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/cc43813c_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/b76a4857_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/4467c0c3_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/2b679751_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/4aa62945_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/3fbd0781_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/efff7b1d_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/01d6c04b_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/7d9aa9b7_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/cdd68a0e_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/1c2ec520_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/77f0b28c_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/8fccbdb9_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/faa88277_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/0fe7db6f_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/3ee28077_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/06eb2e5c_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/b328b577_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Living area"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/39c2778a_b.jpg",
//                 "source": "Travclan",
//                 "caption": "View from room"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/30ef9bc5_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Coffee and/or coffee maker"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/daf28195_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Coffee and/or coffee maker"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/0a1b9cc1_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Bathroom"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/c4aee61c_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Bathroom"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/a3857382_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Bathroom"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/6095a722_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Pool"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/677b05f7_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Pool"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/c94b1426_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Outdoor pool"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/b29eb4d6_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Fitness facility"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/b62993c7_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Massage"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/f7428b82_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Bicycling"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/8285fb0e_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Billiards"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/bc39f8c1_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Gift shop"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/45e5a08e_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Dining"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/a44147e3_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Dining"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/b5dcd478_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Dining"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/891d7635_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Dining"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/d3957041_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Restaurant"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/61e944cc_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Restaurant"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/f042b6d8_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Restaurant"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/50f53f3a_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Food court"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/4ed08bdb_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Family dining"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/ca08270d_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Food and drink"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/b35f6313_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Bar (on property)"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/541ff5f3_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Hallway"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/8951fc1f_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Property grounds"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/97a71859_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Property grounds"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/d4fa8f4e_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Property grounds"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/e2f14353_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Property grounds"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/c558cba4_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Property entrance"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/51c29d65_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Property entrance"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/366262f7_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Front of property - evening/night"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/b91155ae_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Garden"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/b3bae6fc_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Garden"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/63524262_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Outdoor dining"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/c5bd0e02_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Exterior detail"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/92a754d1_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Exterior detail"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/e02fe432_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Exterior"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/b2e09cef_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Exterior"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/e218caa3_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Exterior"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/6c651197_b.jpg",
//                 "source": "Travclan",
//                 "caption": "View from property"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/9cdd0d89_b.jpg",
//                 "source": "Travclan",
//                 "caption": "View from property"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/89a09c2c_b.jpg",
//                 "source": "Travclan",
//                 "caption": "View from property"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/c2384c27_b.jpg",
//                 "source": "Travclan",
//                 "caption": "View from property"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/9ca9cf29_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Water view"
//             },
//             {
//                 "type": "Accommodation",
//                 "image": "https://i.travelapi.com/lodging/1000000/550000/545900/545823/6a021a94_b.jpg",
//                 "source": "Travclan",
//                 "caption": "Water view"
//             }
//         ],
//         "source": "Travclan",
//         "country": "India",
//         "website": "",
//         "check_in": {
//             "date": "2025-04-20",
//             "min_age": "18",
//             "begin_time": "2:00 PM",
//             "instructions": [
//                 "<ul>  <li>Extra-person charges may apply and vary depending on property policy</li><li>Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges</li><li>Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed</li><li>Guests must contact this property in advance to reserve onsite parking</li><li>This property accepts credit cards, debit cards, and cash</li><li>Safety features at this property include a fire extinguisher, a security system, a first aid kit, and window guards</li><li>Please note that cultural norms and guest policies may differ by country and by property; the policies listed are provided by the property</li>  </ul> <ul>  <li>Please note: To comply with local law, no alcohol will be served in this property on the first day of every month.</li>  </ul>"
//             ]
//         },
//         "currency": "INR",
//         "check_out": {
//             "date": "2025-04-21",
//             "time": "11:00 AM"
//         },
//         "rating_ext": "4.7",
//         "coordinates": {
//             "latitude": "9.968159",
//             "longitude": "76.24588"
//         },
//         "occupancies": [
//             {
//                 "child_ages": [],
//                 "num_adults": 2
//             },
//             {
//                 "child_ages": [],
//                 "num_adults": 2
//             }
//         ],
//         "availability": null,
//         "country_code": "IN",
//         "star_category": "5",
//         "trace_details": {
//             "id": "050dc6ea-a41e-4b7c-aa16-34043c0e4c1b",
//             "created_at": "2025-03-28T17:31:48",
//             "remaining_time": 3593
//         },
//         "itinerary_code": "itrfusx",
//         "previous_price": 10716,
//         "num_reviews_ext": "78",
//         "is_price_changed": false,
//         "price_valid_until": "2025-03-29 00:01:51",
//         "recommendation_id": "40acc4cc-c5ca-4679-8027-b466e75552cc",
//         "accommodation_type": [
//             "Hotel",
//             "Hotel"
//         ]
//     },
//     "rating": "4.7",
//     "user_ratings_total": "78",
//     "created_at": "2025-03-28 23:02:00",
//     "modified_at": "2025-03-28 23:02:00",
//     "image": null,
//     "image_alt_text": null,
//     "image_credit": null,
//     "name": "Brunton Boatyard - Cgh Earth",
//     "price": 10716.0,
//     "currency": "INR",
//     "number_of_adults": 4,
//     "number_of_children": 0,
//     "number_of_infants": 0,
//     "user_selected": true,
//     "check_in": "2025-04-20 00:00:00",
//     "check_out": "2025-04-21 00:00:00",
//     "booking_source": "Travclan",
//     "itinerary_id": "f252225e-2868-4c40-9127-f5dd931a75cb",
//     "status": "Quoted",
//     "policies": [],
//     "terms_and_guidelines": "[]",
//     "voucher": null,
//     "price_valid_until": "2025-03-29 00:01:51",
//     "duration": 1,
//     "meal": "Room Only",
//     "customer": null,
//     "itinerary_city": "2a04e2b2-5952-4bf4-9cf5-0262b833c5d8",
//     "room": null,
//     "accommodation": null,
//     "agoda_accommodation": null
// },

  return (
    <div
      data-city-id={props?.city?.id}
      ref={(el) => (props.cityRefs.current[props.city.id] = el)}
      className="border-2 border-gray-200 rounded-t-lg flex flex-col"
    >
      <div className="flex items-start justify-between p-3 rounded-t-lg bg-[#FEFAD8] border-b-2">
        <div className="space-y-1">
          <div className={`md:text-[18px] font-semibold`}>
            {stay ? stay[props?.index]?.hotel_details?.city : props?.city?.name}
            {" - "}
            {stay ? stay[props?.index]?.duration : props?.city?.duration}{" "}
            {stay ? stay[props?.index]?.duration === 1 : props?.city?.duration ? "Night" : "Nights"}
          </div>

          {hotels_status === "PENDING" ? 
           <div className="flex flex-col animate-pulse">
           <div className="flex flex-col gap-1 p-3">
             <div className="flex items-center gap-2">
               <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
               <div className="bg-gray-300 h-4 w-24 rounded"></div>
             </div>
             <div className="flex flex-row items-center mt-2 gap-2">
               <div className="bg-gray-300 h-3 w-16 rounded"></div>
               <div className="bg-gray-300 h-3 w-12 rounded"></div>
               <div className="bg-gray-300 h-3 w-32 rounded"></div>
             </div>
           </div>
         </div>
          :
          (stay && (stay[props?.index]?.hotel_details?.name)) && hotels_status === "SUCCESS" ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Image
                  src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/Vector.png`}
                  height={22}
                  width={22}
                  className="object-contain"
                  alt="Hotel Icon"
                />
                <div
                  className="text-[14px] font-medium leading-0 underline  cursor-pointer hover:text-blue"
                  onClick={() => fetchDetails()}
                >
                  {stay[props?.index]?.hotel_details?.name}
                </div>
              </div>
              <div className="flex flex-row items-center">
                {getStars(stay[props?.index]?.rating)}{" "}
                <div className="text-[#7A7A7A] text-[12px] ml-1">
                  {stay[props?.index]?.rating} ·{" "}
                </div>
                {stay[props?.index]?.user_ratings_total && <div className="text-[#7A7A7A] text-[12px] ml-1 underline">
                  {stay[props?.index]?.user_ratings_total} Google reviews
                </div>}
              </div>
            </div>
          ) : (
            <div
              className="text-blue cursor-pointer text-[14px] font-medium"
              onClick={(e) =>
                handleStay(e, "Change", props.city.city.name, "Add")
              }
            >
              + Add Stay in {props?.city?.city?.name}
            </div>
          )}
        </div>

        <button
          onClick={() => setViewMore((prev) => !prev)}
          className="flex items-center text-sm font-semibold"
        >
          {viewMore ? (
            <RiArrowDropUpLine className="text-3xl" />
          ) : (
            <RiArrowDropDownLine className="text-3xl" />
          )}
        </button>
      </div> 

      {itinerary_status === "SUCCESS" ? viewMore ? (
        <>
          <CityDaybyDay city={props.city} setItinerary={props?.setItinerary} />
        </>
      ) : (
        <CitySummary
          city={props.city}
          setViewMore={setViewMore}
          activityBookings={props?.activityBookings}
          setActivityBookings={props?.setActivityBookings}
        />
      ) : null}
      <Drawer
        show={showDetails}
        anchor={"right"}
        backdrop
        className="font-lexend"
        onHide={() => setShowDetails(false)}
        width={"50%"}
        mobileWidth={"100%"}
      >
        <Container>
          <BackContainer className=" font-lexend">
            <IoMdClose
              className="hover-pointer"
              style={{ fontSize: "2rem" }}
              onClick={() => setShowDetails(false)}
            ></IoMdClose>
            <BackText>Back to Itinerary</BackText>
          </BackContainer>
          <HotelBookingDetails
            _setImagesHandler={props._setImagesHandler}
            user_rating={stay ? stay[props?.index]?.rating : props.city.hotels[0]?.rating}
            number_of_reviews={stay ? stay[props?.index]?.user_ratings_total : props.city.hotels[0]?.user_ratings_total}
            data={data} 
            images={
              props?.city?.hotels[0]?.images
                ? props?.city?.hotels[0]?.images
                : []
            }
            experience_filters={props.poi ? props.poi.experience_filters : null}
            name={
              props?.city?.hotels[0]?.name ? props?.city?.hotels[0]?.name : null
            }
            duration={
              props?.city?.hotels[0]?.duration
                ? props?.city?.hotels[0]?.duration
                : null
            }
            setShowDetails={setShowDetails}
            id={props?.city?.hotels?.[0]?.id}
          />
        </Container>
      </Drawer>
    </div>
  );
};

export default ItineraryCity;
