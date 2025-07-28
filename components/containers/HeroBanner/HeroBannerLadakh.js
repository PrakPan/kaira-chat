import useMediaQuery from "../../media";
import FullImgContentLadakh from "./FullImgContentLadakh";
import FullImageLadakh from "../../FullImageLadakh";

const HeroBannerLadakh = (props) => {
  const isDesktop = useMediaQuery("(min-width:767px)");

  return (
    <FullImageLadakh
      heightmobile="30rem"
      height="37rem"
      url={props?.url}
      filter="brightness(1)"
      resizeMode={props.resizeMode}
      noLazy
    >
      <div
        className={
          isDesktop
            ? "h-full pt-[2rem] md:bg-gradient-to-r md:from-neutral-800 md:to-50% h-full"
            : "h-full pt-[2rem] bg-black bg-opacity-25 h-full"
        }
      >
        <FullImgContentLadakh
          page_id={props.page_id}
          type={props?.type}
          subheading={props.subheading}
          destination={props.destination}
          cities={props.cities}
          children_cities={props.children_cities}
          title={props.title}
          _startPlanningFunction={props._startPlanningFunction}
          page={props.page}
          eventDates={props.eventDates}
        />
      </div>
    </FullImageLadakh>
  );
};

export default HeroBannerLadakh;
