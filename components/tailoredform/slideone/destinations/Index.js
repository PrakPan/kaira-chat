import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SelectedDestination from "./selecteddestination/Index";
import { useRouter } from "next/router";
import { StyledHeading } from "../../../styled-components/TailoredForm";
import EndDestination from "./Destinations";
import { Body2R_14 } from "../../../new-ui/Body";

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
  const [deletedId, setDeletedId] = useState(null);
  const [isCountryId, setIsCountryId] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    id: null,
    input_id: null,
    data: null,
  });
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    var country_id = props?.selectedCities?.some((e) => e.type === "Country");
    setIsCountryId(country_id);
    if (router.query.country && !router.query.state && !router.query.city)
      setIsCountryId(true);
  }, [props.selectedCities]);

  useEffect(() => {
    const des = [];
    for (let i = 0; i < props?.selectedCities?.length; i++) {
      des.push(
        <div>
          <Body2R_14>Destination</Body2R_14>
          <EndDestination
            autofocus={i == 0 && props.selectedCities[0].name && true}
            _updateDestinationHandler={_updateDestinationHandler}
            key={props.selectedCities[i].input_id}
            setDeletedId={
              (i != 0 || props.selectedCities.length > 1) && setDeletedId
            }
            inbox_id={props.selectedCities[i].input_id}
            selectedCities={props.selectedCities}
            destination={props.selectedCities[i].name}
            CITIES={props.CITIES}
            openCities={() => props.setShowCities(true)}
            setDestination={props.setDestination}
            setSelectedCities={props.setSelectedCities}
            setValueStart={props.setValueStart}
            setValueEnd={props.setValueEnd}
            eventDates={props.eventDates}
            updatedData={updatedData}
            tailoredFormModal={props.tailoredFormModal}
            selectedCity={props.selectedCities[i]}
            index={i}
          ></EndDestination>
        </div>
      );
    }
    setDestinations(des);
  }, [JSON.stringify(props.selectedCities)]);

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
          selectedCities={props.selectedCities}
          CITIES={props.CITIES}
          openCities={() => props.setShowCities(true)}
          setDestination={props.setDestination}
          setSelectedCities={props.setSelectedCities}
          setValueStart={props.setValueStart}
          setValueEnd={props.setValueEnd}
          eventDates={props.eventDates}
          tailoredFormModal={props.tailoredFormModal}
          selectedCity={props.selectedCities[props.selectedCities.length - 1]}
          index={props?.selectedCities.length - 1}
          setDestinations={setDestinations}
          destinations={destinations}
        ></SelectedDestination>
      </>
    );
    setDestinations(dest.slice());
  };
function _updateDestinationHandler(id, input_id, data) {
  setUpdatedData({ id, input_id, data });

  let cityExists = false;

  const newCities = props.selectedCities.map((item) => {
    if (item.input_id === input_id) {
      cityExists = true;
      return { ...item, ...data };
    }
    return item;
  });

  // If it didn't exist, push it
  if (!cityExists) {
    newCities.push({ id, input_id, ...data });
  }

  console.log("Updated cities: ", newCities);
  props.setSelectedCities(newCities);
}



  useEffect(() => {
    if (updatedData.id) {
      console.log("end destination data is: ", updatedData)
      const selected = props.selectedCities.map((e) => {
        if (e.input_id == updatedData.input_id)
          return {
            input_id: updatedData.input_id,
            ...updatedData.data,
            id: updatedData.id
          };
        return e;
      });
      console.log("end destination props are: ", selected)
      props.setSelectedCities(selected);
    }
  }, [updatedData.id]);

  useEffect(() => {
    if (deletedId) {
      const newDestinations = destinations.filter(
        (e) => e.props.inbox_id != deletedId
      );
      setDestinations(newDestinations.slice());
      const selected = props.selectedCities.filter(
        (e) => e.input_id != deletedId
      );
      props.setSelectedCities(selected.slice());
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
          selectedCities={props.selectedCities}
          destination={props.destination}
          CITIES={props.CITIES}
          openCities={() => props.setShowCities(true)}
          setDestination={props.setDestination}
          setSelectedCities={props.setSelectedCities}
        ></SelectedDestination>
      </div>
      {destinations.map((e, i) => (
        <div key={i}>{e}</div>
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
        {!props?.selectedCities?.some((e) => !e.name) && (
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
