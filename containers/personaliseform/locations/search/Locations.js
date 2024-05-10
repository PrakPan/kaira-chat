import styled from "styled-components";
import Location from "./Location";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  margin: 1rem 0;
  padding-bottom: 10vh;
  @media screen and (min-width: 768px) {
    padding-bottom: 0;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const SearchResult = (props) => {
  let locations = [];

  if (props.hotlocations)
    for (var i = 0; i < props.hotlocations.length; i++) {
      let id = props.hotlocations[i].id;
      let name = props.hotlocations[i].name;
      let parent = props.hotlocations[i].state.name;
      let type = props.hotlocations[i].type;
      locations.push(
        <Location
          selectedCities={props.selectedCities}
          _removeCityHandler={props._removeCityHandler}
          id={id}
          name={name}
          parent={parent}
          location={props.hotlocations[i]}
          _addCityHandler={props._addCityHandler}
          type={type}
        ></Location>
      );
    }
  else
    for (var i = 0; i < 8; i++) {
      locations.push(
        <Location
          selectedCities={props.selectedCities}
          _removeCityHandler={props._removeCityHandler}
          location={null}
          _addCityHandler={props._addCityHandler}
        ></Location>
      );
    }

  return <Container>{locations}</Container>;
};

export default SearchResult;
