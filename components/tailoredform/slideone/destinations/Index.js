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
  const selectedCities = useSelector((state) => state.tailoredInfoReducer.slideOne.selectedCities);

  // Remove the destinations state - render directly from selectedCities
  // const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    var country_id = selectedCities?.some((e) => e.type === "Country");
    setIsCountryId(country_id);
    if (router.query.country && !router.query.state && !router.query.city)
      setIsCountryId(true);


  }, [selectedCities]);


  console.log("selected cities",selectedCities);

  // Remove this useEffect that builds destinations array
  // useEffect(() => { ... }, [JSON.stringify(selectedCities)]);

  const _addDestinationHandler = () => {
    const id = Date.now();
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
    }
  }, [deletedId]);

  return (
    <Container>
      <div className="flex flex-col gap-[4px]">
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
        {props?.errors?.startLocation !== null && (
          <p className="mt-1 text-sm text-red-600 font-medium">
            {props?.errors?.startLocation}
          </p>
        )}
      </div>

      <Container className=" !gap-[4px]">
        {/* Render directly from selectedCities instead of destinations state */}
        {selectedCities?.map((selectedCity, i) => (
          <div key={selectedCity.input_id || i}>
            <div className="flex flex-col gap-[4px]">
              {i === 0 && <Body2R_14>Destination</Body2R_14>}
              <EndDestination
                autofocus={i === 0 && selectedCity.name && true}
                _updateDestinationHandler={_updateDestinationHandler}
                setDeletedId={selectedCities.length !== 1 && setDeletedId}
                inbox_id={selectedCity.input_id}
                selectedCities={selectedCities}
                destination={selectedCity.name}
                CITIES={props.CITIES}
                openCities={() => props.setShowCities(true)}
                setDestination={props.setDestination}
                eventDates={props.eventDates}
                updatedData={updatedData}
                tailoredFormModal={props.tailoredFormModal}
                selectedCity={selectedCity}
                index={i}
                size={selectedCities.length}
                hotlocations={props.hotlocations}
              />
            </div>
            {i === 0 && props.errors?.destination1 && props.errors?.destination1 !== null && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {props.errors?.destination1}
              </p>
            )}
          </div>
        ))}
      </Container>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          marginLeft: "33%",
          marginRight: "10px",
          marginTop: "-30px",
        }}
      >
        {!selectedCities?.some((e) => !e.name) && (
          <p
            onClick={_addDestinationHandler}
            className="text-center hover-pointer"
            style={{
              color: "#1360D3",
              margin: "0.5rem -9px 0 0",
              fontSize: "0.85rem",
            }}
          >
            + Add Destination
          </p>
        )}
      </div>
    </Container>
  );
};

export default Destinations;
