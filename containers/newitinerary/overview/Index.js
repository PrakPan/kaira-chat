import styled from "styled-components";
import Details from "./Details";
import ImagesMobile from "./ImagesMobile";
import useMediaQuery from "../../../hooks/useMedia";
import Ratings from "../../../components/itinerary/Ratings/Rating";
import { connect, useDispatch } from "react-redux";
import setItineraryStatus from "../../../store/actions/itineraryStatus";
import { axiosGetItineraryStatus } from "../../../services/itinerary/daybyday/preview";
import SmallGallery from "./SmallGallery";
import TravelPartnerContact from "../../../components/TravelPartnerContact";
import { useState } from "react";
import ModalWithBackdrop from "../../../components/ui/ModalWithBackdrop";
import Settings from "../../../components/settings/Index";
import BottomModal from "../../../components/ui/LowerModal";
import { MERCURY_HOST } from "../../../services/constants";
import axios from "axios";
import { useRouter } from "next/router";

const divideTravellers = (val) => {
  let distribution = [];

  let tempadults = val.number_of_adults;
  let tempChildren = val.number_of_children;
  let tempInfants = val.number_of_infants;
  while (tempadults != 0) {
    if (tempadults >= 2) {
      distribution.push({ adults: 2, children: 0 });
      tempadults -= 2;
    } else {
      distribution.push({ adults: tempadults, children: 0 });
      tempadults = 0;
    }
  }

  let childIdx = 0;

  while (tempChildren != 0) {
    if (!distribution[childIdx % distribution.length].children) {
      distribution[childIdx % distribution.length].children = 0;
    }
    distribution[childIdx % distribution.length].children += 1;
    tempChildren -= 1;
    if (!distribution[childIdx % distribution.length].childAges) {
      distribution[childIdx % distribution.length].childAges = [];
    }
    distribution[childIdx % distribution.length].childAges.push(10);
    childIdx += 1;
  }

  while (tempInfants != 0) {
    if (!distribution[childIdx % distribution.length].children) {
      distribution[childIdx % distribution.length].children = 0;
    }
    distribution[childIdx % distribution.length].children += 1;
    tempInfants -= 1;
    if (!distribution[childIdx % distribution.length].childAges) {
      distribution[childIdx % distribution.length].childAges = [];
    }
    distribution[childIdx % distribution.length].childAges.push(1);
    childIdx += 1;
  }

  return distribution;
};

const mergePassengers = (data) => {
  const number_of_adults = data.reduce((acc, curr) => acc + curr.adults, 0);
  const number_of_children = data.reduce((acc, curr) => acc + curr.children, 0);
  const number_of_infants = data.reduce((acc, curr) => acc + curr.infants, 0);
  return {
    number_of_adults: number_of_adults,
    number_of_children: number_of_children,
    number_of_infants: number_of_infants || 0,
  };
};

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: auto max-content;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  @media screen and (min-width: 768px) {
    margin-top: 0rem;
    grid-template-columns: auto max-content;
  }
`;

const Heading = styled.h1`
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 48px;
`;

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const Overview = (props) => {
  const isDesktop = useMediaQuery("(min-width:767px)");
 
  const [isHotelsPresent, setIsHotelsPresent] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const itinerary_id = router.query.id;

  const fetchItineraryStatus = async (itineraryId = itinerary_id) => {
    try {
      const res = await axiosGetItineraryStatus.get(`/${itineraryId}/status/`);
      const status = res.data?.celery;
      dispatch(
        setItineraryStatus("pricing_status", status?.PRICING || "PENDING"),
      );
      dispatch(
        setItineraryStatus("transfers_status", status?.TRANSFERS || "PENDING"),
      );
      dispatch(
        setItineraryStatus("hotels_status", status?.HOTELS || "PENDING"),
      );
      dispatch(
        setItineraryStatus("itinerary_status", status?.ITINERARY || "PENDING"),
      );
      fetchItinerary();
    } catch (err) {
      console.error("[ERROR]: axiosGetItineraryStatus: ", err.message);
    }
  };

  const fetchItinerary = async () => {
    try {
      props?.resetRef();
      props.fetchData(true);
    } catch (err) {
      console.error("[ERROR]: fetchItineraryStatus: ", err.message);
    }
  };

  const handleApply = (data) => {
    const req = data;

    if (req.add_hotels == true) {
      req.passengers = mergePassengers(req.room_configuration);
    } else {
      req.room_configuration = divideTravellers(req.passengers);
    }

    return axios
      .post(
        `${MERCURY_HOST}/api/v1/itinerary/${itinerary_id}/itinerary-edit/`,
        req,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      )
      .then((res) => {
        fetchItineraryStatus(itinerary_id);
        return res;
      })
      .catch((err) => {
        console.log("error is:", err);
        throw err;
      })
      .finally(() => {
        props?.setShowSettings(false);
      });
  };

  return (
    <div className="flex flex-col gap-2">
      <GridContainer className="gap-2">
        <div className="flex justify-between">
          <div
            className={`${isDesktop ? "Heading" : "Heading2SB font-semibold"}`}
          >
            {props.title}
          </div>
          <TravelPartnerContact
            itinerary={props?.itinerary}
            resetRef={props?.resetRef}
            fetchData={props?.fetchData}
            showSettings={props?.showSettings}
            setShowSettings={props?.setShowSettings}
            setIsHotelsPresent={setIsHotelsPresent}
            isHotelsPresent={isHotelsPresent}
          />
        </div>
        {!isDesktop && props.tripsPage && <Ratings />}
      </GridContainer>
      <div className="flex flex-row">
        <Details
          mercuryItinerary={props?.mercuryItinerary}
          group_type={props.group_type}
          itinerary={props?.itinerary}
          duration_time={props.duration_time}
          travellerType={props.travellerType}
          start_date={props.start_date}
          resetRef={props?.resetRef}
          fetchData={props?.fetchData}
          end_date={props.end_date}
          duration={props.duration}
          budget={props?.budget}
          number_of_adults={props?.number_of_adults}
          number_of_children={props?.number_of_children}
          number_of_infants={props?.number_of_infants}
          setEditRoute={props.setEditRoute}
          v1={props?.v1}
          showSettings={props?.showSettings}
          setShowSettings={props?.setShowSettings}
          setIsHotelsPresent={setIsHotelsPresent}
          isHotelsPresent={isHotelsPresent}
        ></Details>
        {isDesktop && props.tripsPage && <Ratings />}
        {isDesktop && props?.images?.length > 0 && (
          <SmallGallery
            maxShow={Math.min(3, props.images.length)}
            images={props.images}
          />
        )}
      </div>
      {!isDesktop && props?.images?.length > 0 && (
        <SmallGallery
          maxShow={Math.min(3, props.images.length)}
          images={props.images}
        />
      )}

      {/* {isDesktop && <div className="pt-3 pb-1">
        <ImagesMobile images={props.images}></ImagesMobile>
      </div>
      } */}

      {isDesktop ? (
        <ModalWithBackdrop
          centered
          show={props?.showSettings == true}
          mobileWidth="100%"
          backdrop
          closeIcon={true}
          onHide={() => props?.setShowSettings(false)}
          borderRadius={"12px"}
          animation={false}
          backdropStyle={{
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(1px)",
          }}
          paddingX="20px"
          paddingY="20px"
        >
          <Settings
            setShowSettings={props?.setShowSettings}
            isHotelsPresent={isHotelsPresent}
            handleApply={handleApply}
          />
        </ModalWithBackdrop>
      ) : (
        <BottomModal
          show={props?.showSettings == true}
          onHide={() => props?.setShowSettings(false)}
          width="100%"
          height="max-content"
          paddingX="16px"
          paddingY="31px"
        >
          <Settings
            setShowSettings={props?.setShowSettings}
            isHotelsPresent={isHotelsPresent}
            handleApply={handleApply}
          />
        </BottomModal>
      )}
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    tripsPage: state.TripsPage,
  };
};

export default connect(mapStateToPros)(Overview);
