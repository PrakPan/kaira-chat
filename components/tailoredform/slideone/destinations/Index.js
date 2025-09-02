import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SelectedDestination from "./selecteddestination/Index";
import { useRouter } from "next/router";
import { StyledHeading } from "../../../styled-components/TailoredForm";
import EndDestination from "./Destinations";
import { Body2R_14 } from "../../../new-ui/Body";
import { useDispatch, useSelector } from "react-redux";
import { deleteSelectedCity, setSelectedCities, updateSelectedCity } from "../../../../store/actions/slideOneActions";

const Container = styled.div`
  width: 100%;

  @media screen and (min-width: 768px) {
  }
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Destinations = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [deletedId, setDeletedId] = useState(null);
  const [isCountryId, setIsCountryId] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    id: null,
    input_id: null,
    data: null,
  });
  const [destinations, setDestinations] = useState([]);
  const selectedCities = useSelector((state) => state.tailoredInfoReducer.slideOne.selectedCities);

  useEffect(() => {
    var country_id = selectedCities?.some((e) => e.type === "Country");
    setIsCountryId(country_id);
    if (router.query.country && !router.query.state && !router.query.city)
      setIsCountryId(true);
  }, [selectedCities]);

  useEffect(() => {
    const des = [];
    for (let i = 0; i < selectedCities?.length; i++) {
      des.push(
        <div>
          <Body2R_14>Destination</Body2R_14>
          <EndDestination
            autofocus={i == 0 && selectedCities[0].name && true}
            _updateDestinationHandler={_updateDestinationHandler}
            key={selectedCities[i].input_id}
            setDeletedId={
              (i != 0 || selectedCities.length > 1) && setDeletedId
            }
            inbox_id={selectedCities[i].input_id}
            selectedCities={selectedCities}
            destination={selectedCities[i].name}
            CITIES={props.CITIES}
            openCities={() => props.setShowCities(true)}
            setDestination={props.setDestination}
            eventDates={props.eventDates}
            updatedData={updatedData}
            tailoredFormModal={props.tailoredFormModal}
            selectedCity={selectedCities[i]}
            index={i}
          ></EndDestination>
        </div>
      );
    }
    setDestinations(des);
  }, [JSON.stringify(selectedCities)]);

  const _addDestinationHandler = () => {
    let dest = destinations.slice();
    const id = Date.now();
    dest.push(
      <>
        <StyledHeading>Destination</StyledHeading>
        <SelectedDestination
          autofocus
          _updateDestinationHandler={_updateDestinationHandler}
          setDeletedId={setDeletedId}
          key={id}
          inbox_id={id}
          selectedCities={selectedCities}
          CITIES={props.CITIES}
          openCities={() => props.setShowCities(true)}
          setDestination={props.setDestination}
          eventDates={props.eventDates}
          tailoredFormModal={props.tailoredFormModal}
          selectedCity={selectedCities[selectedCities.length - 1]}
          index={selectedCities.length - 1}
          setDestinations={setDestinations}
          destinations={destinations}
        ></SelectedDestination>
      </>
    );
    setDestinations(dest.slice());
    dispatch(setSelectedCities(null, id, null));
  };
  function _updateDestinationHandler(id, input_id, data) {
    dispatch(setSelectedCities(id, input_id, data));
  }



  useEffect(() => {
    if (updatedData.id) {
      dispatch(updateSelectedCity(updatedData));
    }
  }, [updatedData.id]);

  useEffect(() => {
    if (deletedId) {
      dispatch(deleteSelectedCity(deletedId));
      setDestinations((prev) =>
        prev.filter((e) => e.props.inbox_id !== deletedId)
      );
    }
  }, [deletedId]);

  return (
    <Container>
      <div>
        <Body2R_14>Start Location</Body2R_14>
        <SelectedDestination
          startingLocation={props.startingLocation}
          setStartingLocation={props.setStartingLocation}
          showSearchStarting={props.showSearchStarting}
          setShowSearchStarting={props.setShowSearchStarting}
          setShowCities={props.setShowCities}
          selectlocation
          destination={props.destination}
          CITIES={props.CITIES}
          openCities={() => props.setShowCities(true)}
          setDestination={props.setDestination}
        ></SelectedDestination>
        {props.errors.startLocation !== null && <p className="mt-1 text-sm text-red-600 font-medium">
          {props.errors.startLocation}
        </p>}
      </div>
      {destinations.map((e, i) => (
        <div key={i}>
          <>{e}</>
          {i == 0 && props.errors.destination1 &&
            props.errors.destination1 !== null && <p className="mt-1 text-sm text-red-600 font-medium">
              {props.errors.destination1}
            </p>
          }
        </div>
      ))}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          marginLeft: "33%",
          marginRight: "10px",
          marginTop: "-30px"
        }}
      >
        {!selectedCities?.some((e) => !e.name) && (
          <p
            onClick={_addDestinationHandler}
            className="text-center font-lexend hover-pointer"
            style={{ color: "#1360D3", margin: "0.5rem", fontSize: "0.85rem" }}
          >
            + Add Destination
          </p>
        )}
      </div>
    </Container>
  );
};

export default Destinations;
