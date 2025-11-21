import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import ImageLoader from "../../../ImageLoader";
import Image from "../../../ImageLoader";
import NextImage from "next/image";
import { getHumanTime } from "../../../../services/getHumanTime";
import Rooms from "../roomtypes/Index";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import useMediaQuery from "../../../media";
import SkeletonCard from "../../../ui/SkeletonCard";
import { connect, useDispatch } from "react-redux";
import Tag from "../../../cards/bookings/activitybooking/imagecontainer/Tag";
import { PulseLoader } from "react-spinners";
import { setStays } from "../../../../store/actions/StayBookings";
import { useRouter } from "next/router";
import { axiosDeleteBooking } from "../../../../services/itinerary/bookings";
import { dateFormat } from "../../../../helper/DateUtils";
import { useSelector } from "react-redux";
import SetCallPaymentInfo from "../../../../store/actions/callPaymentInfo";
import { openNotification } from "../../../../store/actions/notification";
import { getStars } from "../../../itinerary/itineraryCity/SlabElement";
import setItinerary from "../../../../store/actions/itinerary";
import FullScreenGallery from "../../../fullscreengallery/Index";
import { bookingDetails } from "../../../../services/bookings/FetchAccommodation";
import POIDetailsSkeleton from "../../ViewHotelDetails/Skeleton";
import Drawer from "../../../ui/Drawer";
import { Navigation } from "../../../NewNavigation";
import ScrollableMenuTabs from "../../../ScrollableMenuTabs";

const svgIcons = {
  "loaction": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 10 14" fill="none">
    <path d="M4.99968 13.6666C3.8219 13.6666 2.86079 13.4805 2.11634 13.1083C1.3719 12.736 0.999675 12.2555 0.999675 11.6666C0.999675 11.3999 1.08023 11.1527 1.24134 10.9249C1.40245 10.6971 1.62745 10.4999 1.91634 10.3333L2.96634 11.3166C2.86634 11.361 2.75801 11.411 2.64134 11.4666C2.52468 11.5221 2.43301 11.5888 2.36634 11.6666C2.51079 11.8444 2.84412 11.9999 3.36634 12.1333C3.88856 12.2666 4.43301 12.3333 4.99968 12.3333C5.56634 12.3333 6.11357 12.2666 6.64134 12.1333C7.16912 11.9999 7.50523 11.8444 7.64968 11.6666C7.5719 11.5777 7.4719 11.5055 7.34968 11.4499C7.22746 11.3944 7.11079 11.3444 6.99968 11.2999L8.03301 10.2999C8.34412 10.4777 8.58301 10.6805 8.74968 10.9083C8.91634 11.136 8.99968 11.3888 8.99968 11.6666C8.99968 12.2555 8.62746 12.736 7.88301 13.1083C7.13857 13.4805 6.17745 13.6666 4.99968 13.6666ZM5.01634 9.99992C6.11634 9.18881 6.94412 8.37492 7.49968 7.55825C8.05523 6.74158 8.33301 5.92214 8.33301 5.09992C8.33301 3.96659 7.9719 3.11103 7.24968 2.53325C6.52745 1.95547 5.77745 1.66659 4.99968 1.66659C4.2219 1.66659 3.4719 1.95547 2.74968 2.53325C2.02745 3.11103 1.66634 3.96659 1.66634 5.09992C1.66634 5.84436 1.93856 6.61936 2.48301 7.42492C3.02745 8.23047 3.8719 9.08881 5.01634 9.99992ZM4.99968 11.6666C3.43301 10.511 2.26356 9.38881 1.49134 8.29992C0.719119 7.21103 0.333008 6.14436 0.333008 5.09992C0.333008 4.31103 0.474675 3.61936 0.758008 3.02492C1.04134 2.43047 1.40523 1.93325 1.84968 1.53325C2.29412 1.13325 2.79412 0.833252 3.34968 0.633252C3.90523 0.433252 4.45523 0.333252 4.99968 0.333252C5.54412 0.333252 6.09412 0.433252 6.64968 0.633252C7.20523 0.833252 7.70523 1.13325 8.14968 1.53325C8.59412 1.93325 8.95801 2.43047 9.24134 3.02492C9.52468 3.61936 9.66634 4.31103 9.66634 5.09992C9.66634 6.14436 9.28023 7.21103 8.50801 8.29992C7.73579 9.38881 6.56634 10.511 4.99968 11.6666ZM4.99968 6.33325C5.36634 6.33325 5.68023 6.2027 5.94134 5.94159C6.20245 5.68047 6.33301 5.36658 6.33301 4.99992C6.33301 4.63325 6.20245 4.31936 5.94134 4.05825C5.68023 3.79714 5.36634 3.66658 4.99968 3.66658C4.63301 3.66658 4.31912 3.79714 4.05801 4.05825C3.7969 4.31936 3.66634 4.63325 3.66634 4.99992C3.66634 5.36658 3.7969 5.68047 4.05801 5.94159C4.31912 6.2027 4.63301 6.33325 4.99968 6.33325Z" fill="#ACACAC" />
  </svg>,
  "forkKnife": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4.5 8.17993L4.125 8.08228C3.62973 7.95376 3.24289 7.69825 2.94629 7.31177C2.64666 6.92116 2.50006 6.4894 2.5 6.00024V1.83325H2.83301V5.83325H4.5V1.83325H4.83301V5.83325H6.5V1.83325H6.83301V6.00024C6.83294 6.48947 6.68643 6.92112 6.38672 7.31177C6.09005 7.69833 5.70342 7.95379 5.20801 8.08228L4.83301 8.17993V14.1663H4.5V8.17993ZM11.167 7.9563L10.8252 7.84204C10.3606 7.68716 9.96663 7.36068 9.65039 6.80981C9.33149 6.25416 9.16699 5.6159 9.16699 4.88306C9.16703 3.98692 9.4016 3.25792 9.84863 2.66821C10.2952 2.07924 10.7855 1.83335 11.333 1.83325C11.879 1.83325 12.3699 2.08008 12.8174 2.67505C13.2656 3.27107 13.5 4.00364 13.5 4.89966C13.5 5.63238 13.3354 6.2666 13.0176 6.81567C12.7019 7.36102 12.308 7.68663 11.8418 7.84204L11.5 7.9563V14.1663H11.167V7.9563Z" stroke="#ACACAC" />
  </svg>,
  "calender": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.33333 14.6666C2.96667 14.6666 2.65267 14.5361 2.39133 14.2753C2.13044 14.0139 2 13.6999 2 13.3333V3.99992C2 3.63325 2.13044 3.31947 2.39133 3.05859C2.65267 2.79725 2.96667 2.66659 3.33333 2.66659H4V1.33325H5.33333V2.66659H10.6667V1.33325H12V2.66659H12.6667C13.0333 2.66659 13.3473 2.79725 13.6087 3.05859C13.8696 3.31947 14 3.63325 14 3.99992V13.3333C14 13.6999 13.8696 14.0139 13.6087 14.2753C13.3473 14.5361 13.0333 14.6666 12.6667 14.6666H3.33333ZM3.33333 13.3333H12.6667V6.66659H3.33333V13.3333ZM3.33333 5.33325H12.6667V3.99992H3.33333V5.33325ZM3.33333 5.33325V3.99992V5.33325Z" fill="#ACACAC" />
  </svg>,
  "user": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 12" fill="none">
    <path d="M11.1133 6.75342C12.0266 7.37342 12.6666 8.21342 12.6666 9.33342V11.3334H15.3333V9.33342C15.3333 7.88008 12.9533 7.02008 11.1133 6.75342Z" fill="#ACACAC" />
    <path d="M9.99995 6.00008C11.4733 6.00008 12.6666 4.80675 12.6666 3.33341C12.6666 1.86008 11.4733 0.666748 9.99995 0.666748C9.68661 0.666748 9.39328 0.733415 9.11328 0.826748C9.66661 1.51341 9.99995 2.38675 9.99995 3.33341C9.99995 4.28008 9.66661 5.15341 9.11328 5.84008C9.39328 5.93341 9.68661 6.00008 9.99995 6.00008Z" fill="#ACACAC" />
    <path d="M6.00065 6.00008C7.47398 6.00008 8.66732 4.80675 8.66732 3.33341C8.66732 1.86008 7.47398 0.666748 6.00065 0.666748C4.52732 0.666748 3.33398 1.86008 3.33398 3.33341C3.33398 4.80675 4.52732 6.00008 6.00065 6.00008ZM6.00065 2.00008C6.73398 2.00008 7.33398 2.60008 7.33398 3.33341C7.33398 4.06675 6.73398 4.66675 6.00065 4.66675C5.26732 4.66675 4.66732 4.06675 4.66732 3.33341C4.66732 2.60008 5.26732 2.00008 6.00065 2.00008Z" fill="#ACACAC" />
    <path d="M6.00033 6.66675C4.22033 6.66675 0.666992 7.56008 0.666992 9.33341V11.3334H11.3337V9.33341C11.3337 7.56008 7.78032 6.66675 6.00033 6.66675ZM10.0003 10.0001H2.00033V9.34008C2.13366 8.86008 4.20033 8.00008 6.00033 8.00008C7.80032 8.00008 9.86699 8.86008 10.0003 9.33341V10.0001Z" fill="#ACACAC" />
  </svg>,
  "delete": <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
    <path d="M12.75 3.48827C10.8075 3.29577 8.85333 3.1966 6.905 3.1966C5.75 3.1966 4.595 3.25494 3.44 3.3716L2.25 3.48827" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M5.45801 2.89897L5.58634 2.13481C5.67967 1.58064 5.74967 1.16647 6.73551 1.16647H8.26384C9.24968 1.16647 9.32551 1.60397 9.41301 2.14064L9.54134 2.89897" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M11.4956 5.33183L11.1164 11.206C11.0522 12.1218 10.9997 12.8335 9.37224 12.8335H5.62724C3.99974 12.8335 3.94724 12.1218 3.88307 11.206L3.50391 5.33183" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M6.52539 9.625H8.46789" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M6.04199 7.29147H8.95866" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>,
  "maps": <svg
    width="23"
    height="24"
    viewBox="0 0 23 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_9135_4118)">
      <rect
        y="0.800781"
        width="22.4"
        height="22.4"
        rx="4"
        fill-opacity="0.09"
      />
      <path
        d="M13.2 18L9.20001 16.6L6.10001 17.8C5.87779 17.8889 5.67223 17.8639 5.48335 17.725C5.29446 17.5861 5.20001 17.4 5.20001 17.1667V7.83333C5.20001 7.68889 5.24168 7.56111 5.32501 7.45C5.40835 7.33889 5.52223 7.25556 5.66668 7.2L9.20001 6L13.2 7.4L16.3 6.2C16.5222 6.11111 16.7278 6.13611 16.9167 6.275C17.1056 6.41389 17.2 6.6 17.2 6.83333V16.1667C17.2 16.3111 17.1583 16.4389 17.075 16.55C16.9917 16.6611 16.8778 16.7444 16.7333 16.8L13.2 18ZM12.5333 16.3667V8.56667L9.86668 7.63333V15.4333L12.5333 16.3667ZM13.8667 16.3667L15.8667 15.7V7.8L13.8667 8.56667V16.3667ZM6.53335 16.2L8.53335 15.4333V7.63333L6.53335 8.3V16.2Z"

      />
    </g>
    <defs>
      <clipPath id="clip0_9135_4118">
        <rect
          y="0.800781"
          width="22.4"
          height="22.4"
          rx="4"
          fill="white"
        />
      </clipPath>
    </defs>
    <g
      xmlns="http://www.w3.org/2000/svg"
      clip-path="url(#clip0_9135_4118)"
    >
      <rect
        y="0.800781"
        width="22.4"
        height="22.4"
        rx="4"

        fill-opacity="0.09"
      />
      <path
        d="M13.2 18L9.20001 16.6L6.10001 17.8C5.87779 17.8889 5.67223 17.8639 5.48335 17.725C5.29446 17.5861 5.20001 17.4 5.20001 17.1667V7.83333C5.20001 7.68889 5.24168 7.56111 5.32501 7.45C5.40835 7.33889 5.52223 7.25556 5.66668 7.2L9.20001 6L13.2 7.4L16.3 6.2C16.5222 6.11111 16.7278 6.13611 16.9167 6.275C17.1056 6.41389 17.2 6.6 17.2 6.83333V16.1667C17.2 16.3111 17.1583 16.4389 17.075 16.55C16.9917 16.6611 16.8778 16.7444 16.7333 16.8L13.2 18ZM12.5333 16.3667V8.56667L9.86668 7.63333V15.4333L12.5333 16.3667ZM13.8667 16.3667L15.8667 15.7V7.8L13.8667 8.56667V16.3667ZM6.53335 16.2L8.53335 15.4333V7.63333L6.53335 8.3V16.2Z"
        fill="#3A85FC"
      />
    </g>
    <defs xmlns="http://www.w3.org/2000/svg">
      <clipPath id="clip0_9135_4118">
        <rect
          y="0.800781"
          width="22.4"
          height="22.4"
          rx="4"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
}

const starRating = (rating, length) => {
  var stars = [];
  for (let i = 0; i < Math.floor(rating); i++) {
    stars.push(<FaStar />);
  }
  if (Math.floor(rating) < rating) stars.push(<FaStarHalfAlt />);
  return stars;
};

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

const Container = styled.div`
  font-size: 14px;
  padding: 0 0.75rem 0.75rem 0.75rem;
  @media screen and (min-width: 768px) {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr;
  }
  @media screen and (min-width: 768px) and (min-height: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Name = styled.h2`
  font-size: 20px;
  font-weight: 600;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media screen and (min-width: 768px) {
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  margin-top: 1.2rem;
  min-height: 30vh;
  @media screen and (min-width: 768px) {
    width: 100%;

    min-height: 20vh;
  }
`;

const PhotosButton = styled.div`
  &:hover {
    cursor: pointer;
  }
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 6px;
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  letterspacing: 1px;
  font-weight: 300;
`;

const GridImage = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(4, 0.4fr);
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  height: 19rem;
`;

const MGridImage = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-column-gap: 7px;
  grid-row-gap: 7px;
  height: 15rem;
`;

const Child = styled.div`
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  grid-area: ${(props) => props.area};
  ${(props) => props.className && `class="${props.className}"`};
`;

const Heading = styled.div`
  font-weight: 600;
  font-size: 20px;
  margin-block: 1rem 1rem;
`;

const Address = styled.div`
  font-weight: 400;
  font-size: 14px;
  font-family: poppins;
`;

const CheckInText = styled.div`
  font-weight: 500;
  font-size: 14px;
  display: flex;
  gap: 5rem;
  margin-block: 1rem;
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

const HotelBookingDetails = (props) => {
  const isDesktop = useMediaQuery("(min-width:1148px)");
  const [loading, setLoading] = useState(false);
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);
  const itinerary = useSelector((state) => state.Itinerary);
  const stays = useSelector((state) => state.Stays);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [data, setData] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [runTimeShowPopup, setRunTimeShowPopup] = useState(props?.showDetails);
  const { drawer, booking_id, idx, city_id } = router.query;
  const [activeTab, setActiveTab] = useState("About");
  const scrollableTabRef = useRef(null);
  const drawerRef = useRef(null);
  const [activeFacilities, setActiveFacilites] = useState([])
  const [viewMoreFacilites, setViewMoreFacilites] = useState(false);
  const defaultItems = [
    { id: 'section-1', label: "About", link: "About" },
    { id: 'section-2', label: "Rooms", link: "Rooms" },
    { id: 'section-4', label: "Location", link: "Location" },
  ];
  const [items, setItems] = useState(defaultItems)

  const { id } = router.query;

  const [ImagesLoaded, setImagesLoaded] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  const [ImagesError, setImagesError] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  const [imagesGallery, setImagesGallery] = useState(null);
  const _setImagesHandler = (images) => {
    setImagesGallery(images);
  };

  function OnImageLoad(i) {
    if (!ImagesLoaded[i]) {
      setTimeout(
        () =>
          setImagesLoaded((prev) => {
            return { ...prev, [i]: true };
          }),
        1000
      );
    }
  }

  function OnImageError(i) {
    if (!ImagesError[i]) {
      setImagesError((prev) => {
        return { ...prev, [i]: true };
      });
    }
  }

  let images = [];
  let hotelImages = data?.hotel_details?.images
    ? data?.hotel_details?.images
    : [];
  try {
    for (var i = 0; i < hotelImages.length; i++) {
      if (hotelImages[i]) images.push(hotelImages[i]);
    }
  } catch { }

  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingDetails(true);
      await bookingDetails
        .get(`/${router?.query?.id}/bookings/accommodation/${props?.id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          setData(res.data);
          calculateVisibleFacilites(res.data?.hotel_details?.facilities, false)
        })
        .catch((err) => {
          dispatch(
            openNotification({
              type: "error",
              text: "unable to get detail",
              heading: "Error!",
            })
          );
        });
      setLoadingDetails(false);
    };
    if (props?.id == booking_id && booking_id) {
      fetchDetails();
    }
  }, []);

  const handleDelete = async () => {
    try {
      if (!localStorage.getItem("access_token")) {
        props?.setShowLoginModal(true);
        return;
      }
      setLoading(true);
      const response = await axiosDeleteBooking.delete(
        `${id}/bookings/accommodation/${props?.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 204) {
        // trackHotelBookingDelete(router.query.id, props?.id)
        const newItinerary = JSON.parse(JSON.stringify(itinerary));
        var newStays = JSON.parse(JSON.stringify(stays));
        newItinerary.cities = newItinerary.cities.map((item) => {
          const hasMatchingHotel = item?.hotels?.some(hotel => hotel?.id === props?.id);

          if (hasMatchingHotel) {
            item.hotels = [];
            item.itinerary_city_id = item?.itinerary_city_id
          }

          return item;
        });

        newStays = newStays.map((item) => {
          if (item?.id === props?.id) {
            return {
              itinerary_city_id: item?.itinerary_city_id,
              check_in: item?.check_in,
              check_out: item?.check_out,
              city_id: item?.city_id,
              city_name: item?.city_name,
              duration: item?.duration,
              trace_city_id: item?.trace_city_id,
            };
          }
          return item;
        });

        dispatch(SetCallPaymentInfo(!CallPaymentInfo));
        dispatch(setStays(newStays));
        dispatch(setItinerary(newItinerary));
        setLoading(false);
        handleCloseDrawer();
        dispatch(
          openNotification({
            type: "success",
            text: `${data?.hotel_details?.name} booking deleted successfully`,
            heading: "Success!",
          })
        );
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.errors?.[0]?.message?.[0] || err.message;
      dispatch(
        openNotification({
          type: "error",
          text: errorMsg,
          heading: "Error!",
        })
      );
      setLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    const { id, drawer } = router.query;
    if (!drawer || !props?.showDetails) return;
    router.push(
      {
        pathname: `/itinerary/${id}`,
        query: {}, // remove "drawer"
      },
      undefined,
      { scroll: false }
    );
    setRunTimeShowPopup(false);
  };

  useEffect(() => {
    if (data?.hotel_details?.rating || data?.hotel_details?.rating_ext  > 0) {
      items.splice(2, 0, { id: 'section-3', label: "Reviews", link: "Reviews" });
      setItems(items);
    }
  }, [data])

  const _handleMenuTabsChange = (tabName) => {
    const targetEl = document.getElementById(tabName);
    const container = scrollableTabRef.current;

    if (targetEl && container) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const relativeTop = targetRect.top - containerRect.top;
      container.scrollTo({
        top: container.scrollTop + relativeTop,
        behavior: "smooth",
      });
    }
  };


  const calculateVisibleFacilites = (items, flag) => {
    let result = flag ? [...items] : [...items].splice(0, 6);
    setViewMoreFacilites(flag);
    setActiveFacilites(result);
  }


  const viewAllGalleryLink = hotelImages && hotelImages.length && ImagesLoaded[0] ? (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex align-items-center justify-center bg-trans-black_70"
    >
      <span onClick={() => _setImagesHandler(images)} className="font-600 text-sm-md leading-sm-md  border-solid border-b-sm border-text-white text-white cursor-pointer"> Show all photos</span>
    </div>
  ) : null;


  return (
    <>
      <Drawer
        show={runTimeShowPopup}
        anchor={"right"}
        backdrop
        className="font-lexend"
        onHide={handleCloseDrawer}
        width={"50%"}
        mobileWidth={"100%"}
      >
        <Container >
          <div className="my-[1rem]">
            <NextImage src="/backarrow.svg" className="cursor-pointer" width={22} height={2} onClick={handleCloseDrawer} />
          </div>
          {loadingDetails ? (
            <POIDetailsSkeleton />
          ) : (
            <div>
              {data?.hotel_details?.star_category &&
                <>
                  <span className="bg-text-smokywhite rounded-67br text-sm font-500 leading-lg px-md py-xs mb-md inline-block">
                    {data?.hotel_details?.star_category} Star Hotel
                  </span>
                </>
              }
              <FlexBox>
                <div className="text-xl text-black font-600 leading-2xl">
                  {data?.hotel_details?.name}
                </div>

                <button
                  className="ttw-btn-secondary"
                  padding="7px 25px"
                  borderRadius="7px"
                  onClick={() => {
                    if (!localStorage.getItem("access_token")) {
                      props?.setShowLoginModal(true);
                      return;
                    }
                    props.BookingButtonFun();
                  }}
                >
                  Change Hotel
                </button>
              </FlexBox>

              <div className="flex gap-sm mt-sm">
                {
                  <div className="flex gap-xs text-sm-md text-text-spacegrey font-[400]"> <span> {svgIcons.loaction} </span> <span> {data?.hotel_details?.city}{","} {data?.hotel_details?.country} </span></div>
                }

                {data?.hotel_details?.rating || data?.hotel_details?.rating_ext && (
                  <div className="gap-1 flex flex-row  items-center text-sm-md text-text-spacegrey font-[400] pl-sm border-l-sm border-solid border-text-disabled">
                    <div className="flex flex-row text-[#FFD201]">
                      {starRating(data?.hotel_details?.rating || data?.hotel_details?.rating_ext)}
                    </div>
                    <div>
                      {data?.hotel_details?.rating || data?.hotel_details?.rating_ext}
                    </div>
                    {data?.hotel_details?.user_ratings_total > 0 || data?.user_ratings_total > 0 && (
                      <div className="underline">
                        ({data?.hotel_details?.user_ratings_total || data?.user_ratings_total})
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="overflow-y-auto" ref={scrollableTabRef}  style={{ 'height': `calc( 100vh - 195px` }}>

                {/* Gallery Start  */}
                {isDesktop ? (
                  <ImageContainer className="mb-lg">
                    {images.length > 3 ? (
                      <>
                        <GridImage>
                          <Child area="5 / 7 / 1 / 1" className="div1 ">
                            <div
                              className="relative"
                              style={{
                                display: ImagesLoaded[0] ? "initial" : "none",
                              }}
                            >
                              <ImageLoader
                                url={
                                  ImagesError[0]
                                    ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                    : images[0]?.image
                                }
                                width="100%"
                                height="100%"
                                onload={() => OnImageLoad(0)}
                                onfail={() => OnImageError(0)}
                                noLazy
                              />

                              {images[0]?.caption ? (
                                <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                  {images[0]?.caption}
                                </div>
                              ) : null}
                            </div>
                            <div
                              style={{
                                display: !ImagesLoaded[0] ? "initial" : "none",
                                height: "100%",
                                overflow: "hidden",
                              }}
                            >
                              <SkeletonCard lottieDimension={"50rem"} />
                            </div>
                          </Child>

                          <Child area="1 / 7 / 3 / 12" className="div3">
                            <div
                              className="relative"
                              style={{
                                display: ImagesLoaded[2] ? "initial" : "none",
                              }}
                            >
                              <ImageLoader
                                url={
                                  ImagesError[2]
                                    ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                    : images[2]?.image
                                }
                                fit="cover"
                                width="100%"
                                height="100%"
                                onload={() => OnImageLoad(2)}
                                onfail={() => OnImageError(2)}
                                noLazy
                              />

                              {images[2]?.caption ? (
                                <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                  {images[2]?.caption}
                                </div>
                              ) : null}
                            </div>
                            <div
                              style={{
                                display: !ImagesLoaded[2] ? "initial" : "none",
                                height: "100%",
                                overflow: "hidden",
                              }}
                            >
                              <SkeletonCard lottieDimension={"50rem"} />
                            </div>
                          </Child>

                          <Child area="5 / 7 / 3 / 12" className="div4">
                            <div
                              className="relative"
                              style={{
                                display: ImagesLoaded[3] ? "initial" : "none",
                              }}
                            >
                              <ImageLoader
                                url={
                                  ImagesError[3]
                                    ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                    : images[3]?.image
                                }
                                fit="cover"
                                width="100%"
                                height="100%"
                                onload={() => OnImageLoad(3)}
                                onfail={() => OnImageError(3)}
                                noLazy
                              />

                              {images[3]?.caption ? (
                                <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                  {images[3]?.caption}
                                </div>
                              ) : null}
                            </div>
                            <div
                              style={{
                                display: !ImagesLoaded[3] ? "initial" : "none",
                                height: "100%",
                                overflow: "hidden",
                              }}
                            >
                              <SkeletonCard lottieDimension={"50rem"} />
                            </div>
                            {viewAllGalleryLink}
                          </Child>
                        </GridImage>
                      </>
                    ) : images.length == 3 ? (
                      <GridImage>
                        <Child area="1 / 1 / 5 / 4" className="div1 ">
                          <div
                            className="relative"
                            style={{
                              display: ImagesLoaded[0] ? "initial" : "none",
                            }}
                          >
                            <ImageLoader
                              noLazy
                              url={
                                ImagesError[0]
                                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                  : images[0]?.image
                              }
                              width="100%"
                              height="100%"
                              onload={() => OnImageLoad(0)}
                              onfail={() => OnImageError(0)}
                            />

                            {images[0]?.caption ? (
                              <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                {images[0]?.caption}
                              </div>
                            ) : null}
                          </div>
                          <div
                            style={{
                              display: !ImagesLoaded[0] ? "initial" : "none",
                              height: "100%",
                              overflow: "hidden",
                            }}
                          >
                            <SkeletonCard lottieDimension={"50rem"} />
                          </div>
                        </Child>

                        <Child area=" 1 / 4 / 5 / 7" className="div2 rounded-lg">
                          <div
                            className="relative"
                            style={{
                              display: ImagesLoaded[1] ? "initial" : "none",
                            }}
                          >
                            <ImageLoader
                              noLazy
                              url={
                                ImagesError[1]
                                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                  : images[1]?.image
                              }
                              fit="cover"
                              width="100%"
                              height="100%"
                              onload={() => OnImageLoad(1)}
                              onfail={() => OnImageError(1)}
                            />

                            {images[1]?.caption ? (
                              <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                {images[1]?.caption}
                              </div>
                            ) : null}
                          </div>
                          <div
                            style={{
                              display: !ImagesLoaded[1] ? "initial" : "none",
                              height: "100%",
                              overflow: "hidden",
                            }}
                          >
                            <SkeletonCard lottieDimension={"50rem"} />
                          </div>
                        </Child>

                        <Child area="1 / 7 / 5 / 11" className="div3">
                          <div
                            className="relative"
                            style={{
                              display: ImagesLoaded[2] ? "initial" : "none",
                            }}
                          >
                            <ImageLoader
                              noLazy
                              url={
                                ImagesError[2]
                                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                  : images[2]?.image
                              }
                              fit="cover"
                              width="100%"
                              height="100%"
                              onload={() => OnImageLoad(2)}
                              onfail={() => OnImageError(2)}
                            />

                            {images[2]?.caption ? (
                              <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                {images[2]?.caption}
                              </div>
                            ) : null}
                          </div>
                          <div
                            style={{
                              display: !ImagesLoaded[2] ? "initial" : "none",
                              height: "100%",
                              overflow: "hidden",
                            }}
                          >
                            <SkeletonCard lottieDimension={"50rem"} />
                          </div>
                          {viewAllGalleryLink}
                        </Child>
                      </GridImage>
                    ) : images.length == 2 ? (
                      <GridImage>
                        <Child area="1 / 1 / 5 / 6" className="div1 ">
                          <div
                            className="relative"
                            style={{
                              display: ImagesLoaded[0] ? "initial" : "none",
                            }}
                          >
                            <ImageLoader
                              noLazy
                              url={
                                ImagesError[0]
                                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                  : images[0]?.image
                              }
                              fit="cover"
                              width="100%"
                              height="100%"
                              onload={() => OnImageLoad(0)}
                              onfail={() => OnImageError(0)}
                            />

                            {images[0]?.caption ? (
                              <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                {images[0]?.caption}
                              </div>
                            ) : null}
                          </div>
                          <div
                            style={{
                              display: !ImagesLoaded[0] ? "initial" : "none",
                              height: "100%",
                              overflow: "hidden",
                            }}
                          >
                            <SkeletonCard lottieDimension={"50rem"} />
                          </div>
                        </Child>

                        <Child area="1 / 6 / 5 / 11" className="div2 rounded-lg">
                          <div
                            className="relative"
                            style={{
                              display: ImagesLoaded[1] ? "initial" : "none",
                            }}
                          >
                            <ImageLoader
                              noLazy
                              url={
                                ImagesError[1]
                                  ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                  : images[1]?.image
                              }
                              fit="cover"
                              width="100%"
                              height="100%"
                              onload={() => OnImageLoad(1)}
                              onfail={() => OnImageError(1)}
                            />

                            {images[1]?.caption ? (
                              <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                {images[1]?.caption}
                              </div>
                            ) : null}
                          </div>
                          <div
                            style={{
                              display: !ImagesLoaded[1] ? "initial" : "none",
                              height: "100%",
                              overflow: "hidden",
                            }}
                          >
                            <SkeletonCard lottieDimension={"50rem"} />
                          </div>
                          {viewAllGalleryLink}
                        </Child>
                      </GridImage>
                    ) : (
                      <Child style={{ height: "19rem" }}>
                        <div
                          className="relative"
                          style={{ display: ImagesLoaded[0] ? "initial" : "none" }}
                        >
                          <ImageLoader
                            noLazy
                            url={
                              ImagesError[0]
                                ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                : images[0]?.image
                            }
                            fit="cover"
                            width="100%"
                            height="100%"
                            onload={() => OnImageLoad(0)}
                            onfail={() => OnImageError(0)}
                            dimensions={{ height: 800, width: 1200 }}
                          />

                          {images[0]?.caption ? (
                            <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                              {images[0]?.caption}
                            </div>
                          ) : null}
                        </div>
                        <div
                          style={{
                            display: !ImagesLoaded[0] ? "initial" : "none",
                            height: "100%",
                            overflow: "hidden",
                            borderRadius: "8px",
                          }}
                        >
                          <SkeletonCard lottieDimension={"100%"} />
                        </div>
                      </Child>
                    )}

                    {/* {hotelImages ? (
                    hotelImages.length ? (
                      <PhotosButton
                        onClick={() => _setImagesHandler(images)}
                        className="font-lexend bg-black"
                      >
                        Photos Gallery
                      </PhotosButton>
                    ) : null
                  ) : null} */}

                    {props.tag ? (
                      <Tag
                        star_category={props.star_category}
                        tag={props.tag}
                      ></Tag>
                    ) : null}
                  </ImageContainer>
                ) : (
                  <ImageContainer>
                    <MGridImage>
                      {images.length >= 3 ? (
                        <>
                          <Child area="1 / 1 / 4 / 7" className="div1 ">
                            <div
                              className="relative"
                              style={{
                                display: ImagesLoaded[0] ? "initial" : "none",
                              }}
                            >
                              <ImageLoader
                                noLazy
                                url={
                                  ImagesError[0]
                                    ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                    : images[0]?.image
                                }
                                fit="cover"
                                width="100%"
                                height="100%"
                                onload={() => OnImageLoad(0)}
                                onfail={() => OnImageError(0)}
                              />

                              {images[0]?.caption ? (
                                <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                  {images[0]?.caption}
                                </div>
                              ) : null}
                            </div>
                            <div
                              style={{
                                display: !ImagesLoaded[0] ? "initial" : "none",
                                height: "100%",
                                overflow: "hidden",
                              }}
                            >
                              <SkeletonCard lottieDimension={"50rem"} />
                            </div>
                          </Child>

                          <Child area=" 4 / 1 / 7 / 4" className="div2 rounded-lg">
                            <div
                              className="relative"
                              style={{
                                display: ImagesLoaded[1] ? "initial" : "none",
                              }}
                            >
                              <ImageLoader
                                noLazy
                                url={
                                  ImagesError[1]
                                    ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                    : images[1]?.image
                                }
                                fit="cover"
                                width="100%"
                                height="100%"
                                onload={() => OnImageLoad(1)}
                                onfail={() => OnImageError(1)}
                              />

                              {images[1]?.caption ? (
                                <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                  {images[1]?.caption}
                                </div>
                              ) : null}
                            </div>
                            <div
                              style={{
                                display: !ImagesLoaded[1] ? "initial" : "none",
                                height: "100%",
                                overflow: "hidden",
                              }}
                            >
                              <SkeletonCard lottieDimension={"50rem"} />
                            </div>
                          </Child>

                          <Child area="4 / 4 / 7 / 7" className="div3">
                            <div
                              className="relative"
                              style={{
                                display: ImagesLoaded[2] ? "initial" : "none",
                              }}
                            >
                              <ImageLoader
                                noLazy
                                url={
                                  ImagesError[2]
                                    ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                    : images[2]?.image
                                }
                                fit="cover"
                                width="100%"
                                height="100%"
                                onload={() => OnImageLoad(2)}
                                onfail={() => OnImageError(2)}
                              />

                              {images[2]?.caption ? (
                                <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                  {images[2]?.caption}
                                </div>
                              ) : null}
                            </div>
                            <div
                              style={{
                                display: !ImagesLoaded[2] ? "initial" : "none",
                                height: "100%",
                                overflow: "hidden",
                              }}
                            >
                              <SkeletonCard lottieDimension={"50rem"} />
                            </div>
                            {viewAllGalleryLink}
                          </Child>
                        </>
                      ) : images.length === 2 ? (
                        <>
                          <Child area="1 / 1 / 4 / 7" className="div1 ">
                            <div
                              className="relative"
                              style={{
                                display: ImagesLoaded[0] ? "initial" : "none",
                              }}
                            >
                              <ImageLoader
                                noLazy
                                url={
                                  ImagesError[0]
                                    ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                    : images[0]?.image
                                }
                                fit="cover"
                                width="100%"
                                height="100%"
                                onload={() => OnImageLoad(0)}
                                onfail={() => OnImageError(0)}
                              />

                              {images[0]?.caption ? (
                                <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                  {images[0]?.caption}
                                </div>
                              ) : null}
                            </div>
                            <div
                              style={{
                                display: !ImagesLoaded[0] ? "initial" : "none",
                                height: "100%",
                                overflow: "hidden",
                              }}
                            >
                              <SkeletonCard lottieDimension={"50rem"} />
                            </div>
                          </Child>

                          <Child area=" 4 / 1 / 7 / 7" className="div2 rounded-lg">
                            <div
                              className="relative"
                              style={{
                                display: ImagesLoaded[1] ? "initial" : "none",
                              }}
                            >
                              <ImageLoader
                                noLazy
                                url={
                                  ImagesError[1]
                                    ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                    : images[1]?.image
                                }
                                fit="cover"
                                width="100%"
                                height="100%"
                                onload={() => OnImageLoad(1)}
                                onfail={() => OnImageError(1)}
                              />

                              {images[1]?.caption ? (
                                <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                  {images[1]?.caption}
                                </div>
                              ) : null}
                            </div>
                            <div
                              style={{
                                display: !ImagesLoaded[1] ? "initial" : "none",
                                height: "100%",
                                overflow: "hidden",
                              }}
                            >
                              <SkeletonCard lottieDimension={"50rem"} />
                            </div>
                            {viewAllGalleryLink}
                          </Child>
                        </>
                      ) : (
                        <>
                          <Child area="1 / 1 / 7 / 7" className="div1 ">
                            <div
                              className="relative"
                              style={{
                                display: ImagesLoaded[0] ? "initial" : "none",
                              }}
                            >
                              <ImageLoader
                                noLazy
                                url={
                                  ImagesError[0]
                                    ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                    : images[0]?.image
                                }
                                fit="cover"
                                width="100%"
                                height="100%"
                                onload={() => OnImageLoad(0)}
                                onfail={() => OnImageError(0)}
                              />

                              {images[0]?.caption ? (
                                <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                                  {images[0]?.caption}
                                </div>
                              ) : null}
                            </div>
                            <div
                              style={{
                                display: !ImagesLoaded[0] ? "initial" : "none",
                                height: "100%",
                                overflow: "hidden",
                              }}
                            >
                              <SkeletonCard lottieDimension={"50rem"} />
                            </div>
                          </Child>
                        </>
                      )}
                    </MGridImage>



                    {props.tag ? (
                      <Tag
                        star_category={props.star_category}
                        tag={props.tag}
                      ></Tag>
                    ) : null}
                  </ImageContainer>
                )}

                {/* Tabs Start  */}
                <div className="flex flex-col">
                  <div className="sticky top-0 z-10 bg-white border-b-sm border-solid border-text-disabled">
                    <ScrollableMenuTabs
                      classStyle="w-100"
                      items={items}
                      scrollContainerRef={scrollableTabRef}
                      handleActiveTab={_handleMenuTabsChange} />
                  </div>

                  <div>
                    <div id="section-1">
                      {data?.hotel_details?.description ? (
                        <div className="flex flex-col gap-1">
                          <div
                            className="text-sm-xl font-400 leading-xl gl-dynamic-render-elements"
                            dangerouslySetInnerHTML={{
                              __html: data?.hotel_details?.description,
                            }}
                          ></div>
                        </div>
                      ) : null}


                      <DetailsContainer>
                        {data?.hotel_details?.check_in?.date &&
                          data?.hotel_details?.check_out?.date ? (
                          <div className="flex justify-between w-[80%] mt-lg">
                            <div>
                              <div className="text-sm-xl font-600 leading-xl mb-xxs-md">Check In</div>

                              <div className="text-sm-md font-400 leading-xl"> {dateFormat(data?.hotel_details?.check_in.date)}
                                {data?.hotel_details?.check_in.begin_time && (
                                  <>
                                    |
                                    {getHumanTime(
                                      dateFormat(data?.hotel_details?.check_in.begin_time)
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm-xl font-600 leading-xl mb-xxs-md">Check Out </div>

                              <div className="text-sm-md font-400 leading-xl ">
                                {dateFormat(data?.hotel_details?.check_out.date)}
                                {data?.hotel_details?.check_out.time && (
                                  <>
                                    |
                                    {getHumanTime(
                                      dateFormat(data?.hotel_details?.check_out.time)
                                    )}
                                  </>
                                )}{" "}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm-xl font-600 leading-xl mb-xxs-md">Guests </div>
                              <div className="text-sm-md font-400 leading-xl">
                                {data?.number_of_adults} Adults {data?.number_of_children > 0 && <> {data.number_of_children} Children </>}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </DetailsContainer>


                      {data?.hotel_details?.check_in?.instructions?.length > 0 &&
                        <>
                          <div className="mt-lg">
                            <div className="text-sm-xl font-600 leading-xl mb-xxs-md">Check In Instructions</div>
                            <div className="flex flex-col gap-1">
                              {data?.hotel_details?.check_in?.instructions.map((item, index) => (
                                <div key={index}
                                  className="text-sm-xl font-400 leading-xl gl-dynamic-render-elements"
                                  dangerouslySetInnerHTML={{
                                    __html: item,
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </>}

                      {data?.hotel_details?.facilities?.length > 0 && <>
                        <div>
                          <hr className="my-lg" />
                          <div className="text-md-lg font-600 leading-xl mb-lg">Hotel Amenities</div>
                          <ul className="grid grid-cols-3 gap-y-2 gap-x-4 !pl-md">
                            {activeFacilities.length > 0 && activeFacilities.map((item, index) => (
                              <>
                                <li className="text-sm-md font-400 leading-xl list-disc" key={index}>
                                  {item}
                                </li>
                              </>
                            ))}
                          </ul>
                          {!viewMoreFacilites && <div className="text-sm underline font-500 leading-lg cursor-pointer" onClick={() => calculateVisibleFacilites(data?.hotel_details?.facilities, true)}> + {data?.hotel_details?.facilities?.length - activeFacilities?.length}  more</div>}
                          {viewMoreFacilites && <div className="text-sm underline font-500 leading-lg cursor-pointer" onClick={() => calculateVisibleFacilites(data?.hotel_details?.facilities, false)}> Show Less</div>}
                        </div>
                      </>}

                      <hr className="my-lg" />
                    </div>

                    <div id="section-2">


                      {data?.hotel_details?.rates && (
                        <>
                          <div className="text-md-lg font-600 leading-xl mb-lg">Selected Rooms</div>
                          <Rooms
                            data={data?.hotel_details?.rates}
                            checkInDate={data?.check_in?.split(" ")[0]}
                            city={data?.hotel_details?.city}
                            updateBooking={props?.updateBooking}
                            duration={data?.duration}
                            cancellationPolicy={data?.cancellation_policies}
                          ></Rooms>
                        </>
                      )}

                      <hr className="my-lg" />
                    </div>

                    <div id="section-3">

                      {data?.hotel_details?.rating || data?.hotel_details?.rating_ext > 0 && (
                        <div>
                          <div className="text-md-lg font-600 leading-xl mb-lg">Reviews</div>
                          <div className="grid grid-cols-3 gap-y-2 gap-x-4">
                            <div className="flex flex-row gap-sm-md">
                              <div className="text-2xl-md font-600 leading-2xl"> {data?.hotel_details?.rating || data?.hotel_details?.rating_ext}</div>
                              <div>
                                {data?.hotel_details?.rating || data?.hotel_details?.rating_ext && (
                                  <div className="gap-1 flex flex-column text-sm-md text-text-spacegrey font-[400]">
                                    <div className="flex flex-row text-[#FFD201]">
                                      {starRating(data?.hotel_details?.rating || data?.hotel_details?.rating_ext)}
                                    </div>
                                    {data?.hotel_details?.user_ratings_total > 0 || data?.user_ratings_total > 0 && (
                                      <div className="underline">
                                        ({data?.hotel_details?.user_ratings_total || data?.user_ratings_total} Reviews)
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>

                              {data?.hotel_details?.category_ratings && data?.hotel_details?.category_ratings?.length > 0 && <>
                                <div className="text-sm-xl font-500 leading-xl mb-sm-md">Rating Categories</div>
                                <table className="w-100">
                                  <tbody>
                                    {data?.hotel_details?.category_ratings.map(
                                      (item, index) => (
                                        <tr>
                                          {item?.category != "recommendation_percent" && (
                                            <>
                                              <td className="text-sm-md font-400 ">
                                                {item?.category?.slice(0, 1).toUpperCase() +
                                                  item?.category?.slice(
                                                    1,
                                                    item?.category?.length
                                                  )}
                                              </td>
                                              <td colSpan={5}></td>
                                              <td className="flex items-center gap-1 ">
                                                <div className="flex text-[#FFD201]">
                                                  {getStars(item?.rating)}
                                                </div>
                                                <span className="text-sm-md font-400"> {item?.rating} </span>
                                              </td>
                                            </>
                                          )}
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </>}
                            </div>
                          </div>

                        </div>
                      )}

                      <hr className="my-lg" />
                    </div>

                    <div id="section-4" className="mb-lg">
                      {data?.hotel_details?.google_maps_link ? (
                        <div>
                          <div className="text-md-lg font-600 leading-xl mb-lg">Location</div>
                          <div className="flex gap-2">
                            <div>
                              {svgIcons.loaction}
                            </div>
                            <div className="text-sm-md text-text-spacegrey font-[400] mb-sm">
                              {[
                                data?.hotel_details?.addr1,
                                data?.hotel_details?.addr2,
                                data?.hotel_details?.city,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          </div>

                          <div>
                            <div style={{ height: "30px", width: "30px" }}>
                              <Image
                                noLazy
                                url={
                                  ImagesError[i]
                                    ? "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                                    : "media/icons/google-maps.png"
                                }
                                height="30px"
                                width="30px"
                              />
                            </div>
                            <a
                              href={data?.hotel_details?.google_maps_link}
                              target="_blank"
                              style={{ color: "black", fontSize: "14px" }}
                            >
                              View on Google Maps
                            </a>
                          </div>
                        </div>
                      ) : data?.hotel_details?.coordinates?.latitude &&
                        data?.hotel_details?.coordinates?.longitude ? (
                        <div>
                          <div className="text-md-lg font-600 leading-xl mb-lg">Location</div>
                          <div className="flex gap-2">
                            <div>
                              {svgIcons.loaction}
                            </div>
                            <div className="text-sm-md text-text-spacegrey font-[400] mb-sm">
                              {[
                                data?.hotel_details?.addr1,
                                data?.hotel_details?.addr2,
                                data?.hotel_details?.city,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                justifyContent: "left",
                                marginTop: "0.5rem",
                              }}
                            >
                              {svgIcons.maps}
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${data?.hotel_details?.coordinates?.latitude
                                  },${data?.hotel_details?.coordinates?.longitude
                                  }+(${data?.hotel_details?.name?.split(" ").join("+")})`}
                                target="_blank"
                                className="tex-sm-md text-blue"
                              >
                                View on Google Maps
                              </a>
                            </div>

                            <button onClick={handleDelete} className="ttw-btn-fill-error"> {svgIcons.delete} Remove From Itinerary</button>
                          </div>


                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <button onClick={handleDelete} className="ttw-btn-fill-error"> {svgIcons.delete} Remove From Itinerary</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </Drawer>
      {imagesGallery && imagesGallery?.length > 0 ? (
        <FullScreenGallery
          mercury={false}
          closeGalleryHandler={() => setImagesGallery(null)}
          images={imagesGallery}
        ></FullScreenGallery>
      ) : null}
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToPros)(HotelBookingDetails);
