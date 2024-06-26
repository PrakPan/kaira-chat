import styled from "styled-components";
import Details from "./Details";
import ImagesMobile from "./ImagesMobile";
import useMediaQuery from "../../../hooks/useMedia";
import Ratings from "../../../components/itinerary/Ratings/Rating";

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
  font-size: 34px;
  font-weight: 600;
  line-height: 34px;
`;

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const Overview = (props) => {
  const isDesktop = useMediaQuery("(min-width:767px)");

  return (
    <div>
      <GridContainer className="gap-2">
        <Heading className="font-lexend">{toTitleCase(props.title)}</Heading>
        {!isDesktop && <Ratings />}
      </GridContainer>
      <div className="flex flex-row justify-between">
        <Details
          group_type={props.group_type}
          duration_time={props.duration_time}
          travellerType={props.travellerType}
          start_date={props.start_date}
          end_date={props.end_date}
          duration={props.duration}
          budget={props?.budget}
          number_of_adults={props?.number_of_adults}
          number_of_children={props?.number_of_children}
          number_of_infants={props?.number_of_infants}
          setEditRoute={props.setEditRoute}
        ></Details>
        {isDesktop && <Ratings />}
      </div>

      <div className="pt-3 pb-1">
        <ImagesMobile images={props.images}></ImagesMobile>
      </div>
    </div>
  );
};

export default Overview;
