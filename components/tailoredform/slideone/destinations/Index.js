import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SelectedDestination from "./selecteddestination/Index";
import { useRouter } from "next/router";

const Container = styled.div`
  width: 100%;

  position: relative;
  @media screen and (min-width: 768px) {
  }
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
        <SelectedDestination
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
        ></SelectedDestination>
      );
    }
    setDestinations(des);
  }, [JSON.stringify(props.selecftedCities)]);

  const _addDestinationHandler = () => {
    let dest = destinations.slice();
    const id = Date.now();
    dest.push(
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
      ></SelectedDestination>
    );
    setDestinations(dest.slice());
    props.selectedCities.push({ input_id: id });
    props.setSelectedCities(props.selectedCities.slice());
  };

  function _updateDestinationHandler(id, input_id, data) {
    setUpdatedData({ id, input_id, data });
  }

  useEffect(() => {
    if (updatedData.id) {
      const selected = props.selectedCities.map((e) => {
        if (e.input_id == updatedData.input_id)
          return {
            input_id: updatedData.input_id,
            ...updatedData.data,
            id: updatedData.id,
          };
        return e;
      });
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

      {destinations.map((e, i) => (
        <div key={i}>{e}</div>
      ))}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: "33%",
          marginRight: "10px",
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