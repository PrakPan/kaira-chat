import media from "../../../../components/media";
import Flickity from "./Flickity";
import Card from "../Card";

const LocationsBlog = (props) => {
  let isPageWide = media("(min-width: 768px)");
  let cardsarr = [];

  for (var i = 0; i < props.data.length; i++) {
    cardsarr.push(
      <Card heading={props.data[i].heading} text={props.data[i].text}></Card>
    );
  }

  if (isPageWide) {
    return <Flickity cards={cardsarr} groupCells={2}></Flickity>;
  } else return null;
};

export default LocationsBlog;
