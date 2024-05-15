import styled from "styled-components";
import Icon from "./Food";

const Container = styled.div`
  max-width: 100%;
  display: grid;
  padding: 0;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-gap: 1rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    grid-template-columns: 33% 33% 33%;
  }
`;

const Inlcusions = (props) => {
  let defaulticons = [];
  let moreicons = [];
  let moremoreicons = [];

  for (var i = 0; i < 6; i++) {
    if (props.pois[i])
      defaulticons.push(
        <Icon
          drawer
          _openPoiModal={(poi) => props._openPoiModal(poi)}
          icon={props.pois[i]}
        ></Icon>
      );
  }

  // if more than 6 pois, show more
  if (props.pois.length > 6)
    for (var j = 6; j < 9; j++) {
      if (props.pois[j])
        moreicons.push(
          <Icon
            drawer
            _openPoiModal={(poi) => props._openPoiModal(poi)}
            icon={props.pois[j]}
          ></Icon>
        );
    }

  // if more than 9, show more more
  if (props.pois.length > 9)
    for (var k = 9; k < 12; k++) {
      if (props.pois[k])
        moremoreicons.push(
          <Icon
            drawer
            _openPoiModal={(poi) => props._openPoiModal(poi)}
            icon={props.pois[k]}
          ></Icon>
        );
    }

  return (
    <div>
      <Container>{defaulticons}</Container>
    </div>
  );
};

export default Inlcusions;
