import FullImgContent from "./FullImgContent";
import FullImage from "../../FullImage";
const HeroBanner = (props) => {
  return (
    <FullImage
      heightmobile="30rem"
      height="37rem"
      url={props.image}
      filter="brightness(0.9)"
      padding="2rem 0"
      resizeMode={props.resizeMode}
      // filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"
    >
      <FullImgContent
        page_id={props.page_id}
        subheading={props.subheading}
        destination={props.destination}
        cities={props.cities}
        children_cities={props.children_cities}
        title={props.title}
        _startPlanningFunction={props._startPlanningFunction}
        page={props.page}
      />
    </FullImage>
  );
};

export default HeroBanner;
