import FullImgContent from "./FullImgContent";
import FullImage from '../../FullImage'
const HeroBanner = (props) => {
    return (
      <FullImage
        heightmobile="30rem"
        height="40rem"
        url={props.image}
        filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"
      >
        <FullImgContent
          page_id={props.page_id}
          destination={props.destination}
          cities={props.cities}
          children_cities={props.children_cities}
          title={props.title}
          setShowMobilePlanner={props.setShowMobilePlanner}
        />
      </FullImage>
    );
}

export default HeroBanner