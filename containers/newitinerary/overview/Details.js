import styled from "styled-components";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { MdModeEdit } from "react-icons/md";
import useMediaQuery from "../../../components/media";
import { connect } from "react-redux";

const Container = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  max-width: 100vw;
  overflow-x: auto;
  grid-gap: 1rem;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  @media screen and (min-width: 768px) {
    grid-template-columns: max-content max-content max-content max-content max-content max-content;
    grid-column-gap: 2.5rem;
  }
`;

const Heading = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: #7a7a7a;
  margin: 0;
`;

const Text = styled.p`
  font-size: 15px;
  font-weight: 500;
  margin: 0;
`;

const convertDFormat = (dt) => {
  const date = parseISO(dt);
  const formattedDate = format(date, "MMMM do");
  return formattedDate;
};

const Details = (props) => {
  const isDesktop = useMediaQuery("(min-width:768px)");

  useEffect(() => {}, []);

  return (
    <Container className="font-lexend">
      {props?.group_type !== null ? (
        <div style={{ width: "max-content" }}>
          <Heading>Group Type</Heading>
          <Text className="flex flex-row gap-2">
            {props.group_type}
            {props.number_of_adults ||
            props.number_of_children ||
            props.number_of_infants ? (
              <span>
                (
                {props.number_of_adults
                  ? props.number_of_adults > 1
                    ? props.number_of_adults + " Adults"
                    : props.number_of_adults + " Adult"
                  : null}
                {props.number_of_children
                  ? `, ${props.number_of_children} Children`
                  : null}
                {props.number_of_infants
                  ? props.number_of_infants > 1
                    ? `, ${props.number_of_infants} Infants`
                    : `, ${props.number_of_infants} Infant`
                  : null}
                )
              </span>
            ) : null}
          </Text>
        </div>
      ) : null}

      {props?.budget ? (
        <div style={{ width: "max-content" }}>
          <Heading>Budget</Heading>
          <Text>{props.budget}</Text>
        </div>
      ) : null}

      {props.travellerType != null ? (
        <div
          style={{ width: "max-content" }}
          className="flex flex-row items-center gap-4"
        >
          <div>
            <Heading className="flex flex-row gap-2 items-center">
              Dates ({props.duration})
            </Heading>
            {props.start_date && (
              <Text>
                {convertDFormat(props.start_date)} -{" "}
                {convertDFormat(props.end_date)}
              </Text>
            )}
          </div>
          {props.itineraryRoutes && props.itineraryRoutes.length > 0 ? (
            isDesktop ? (
              <button
                onClick={() => props.setEditRoute("editDates")}
                className="text-sm border-2 border-black rounded-lg px-4 py-2 hover:bg-black hover:text-white transition ease-in-out duration-500"
              >
                Edit Dates
              </button>
            ) : (
              <MdModeEdit
                onClick={() => props.setEditRoute("editDates")}
                className="text-lg cursor-pointer hover:text-yellow-400"
              />
            )
          ) : null}
        </div>
      ) : null}
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    itineraryRoutes: state.ItineraryRoutes.routes,
  };
};

export default connect(mapStateToPros)(Details);
