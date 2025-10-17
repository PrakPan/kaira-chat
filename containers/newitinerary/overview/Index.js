import styled from "styled-components";
import Details from "./Details";
import ImagesMobile from "./ImagesMobile";
import useMediaQuery from "../../../hooks/useMedia";
import Ratings from "../../../components/itinerary/Ratings/Rating";
import { connect } from "react-redux";
import setItineraryStatus from "../../../store/actions/itineraryStatus";
import { axiosGetItineraryStatus } from "../../../services/itinerary/daybyday/preview";
import SmallGallery from "./SmallGallery";
import TravelPartnerContact from "../../../components/TravelPartnerContact";

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


  return (
    <div className="flex flex-col gap-2">
      <GridContainer className="gap-2">
        <div className="flex justify-between">
        <div className={`${isDesktop?"Heading":"Heading2SB font-semibold"}`}>
          {props.title}
        </div>
        <TravelPartnerContact itinerary={props?.itinerary} resetRef={props?.resetRef} fetchData={props?.fetchData}/>
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
        ></Details>
        {isDesktop && props.tripsPage && <Ratings />}
        {(isDesktop && props?.images?.length > 0 ) && <SmallGallery maxShow={Math.min(3,props.images.length)} images={props.images} />}
      </div>
      {(!isDesktop && props?.images?.length > 0 )&&<SmallGallery maxShow={Math.min(3,props.images.length)} images={props.images} />}

      {/* {isDesktop && <div className="pt-3 pb-1">
        <ImagesMobile images={props.images}></ImagesMobile>
      </div>
      } */}
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    tripsPage: state.TripsPage,
  };
};

export default connect(mapStateToPros)(Overview);
