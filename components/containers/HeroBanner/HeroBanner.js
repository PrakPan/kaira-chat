import FullImgContent from "./FullImgContent";
import FullImage from "../../FullImage";
import useMediaQuery from "../../../hooks/useMedia";
import Image from "next/image";

const HeroBanner = (props) => {
  const isDesktop = useMediaQuery("(min-width:767px)");

  return (
    <FullImage
      heightmobile="30rem"
      height="37rem"
      url={props.image}
      filter="brightness(1)"
      resizeMode={props.resizeMode}
      noLazy
    >
      <div
        className={
          isDesktop
            ? "h-full pt-[2rem] md:bg-gradient-to-r md:from-neutral-800 md:to-50%"
            : "h-full pt-[2rem] bg-black bg-opacity-25"
        }
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
          eventDates={props.eventDates}
        />

        {props.page === "Home Page" && (
          <>
            <Image
              src={`https://d31aoa0ehgvjdi.cloudfront.net/media/new-year/Asset-4.png`}
              width={isDesktop ? 130 : 70}
              height={60}
              className="z-50 absolute -bottom-3 left-0"
            />

            <Image
              src={`https://d31aoa0ehgvjdi.cloudfront.net/media/new-year/Asset-1.png`}
              width={isDesktop ? 300 : 150}
              height={60}
              className="z-50 absolute -bottom-4 right-[10%]"
            />

            <div className="absolute -bottom-3 w-full h-[8rem]">
              <Image
                src={`https://d31aoa0ehgvjdi.cloudfront.net/media/new-year/banner-trees.png`}
                fill
                className="absolute bottom-0 object-fill"
              />
            </div>
          </>
        )}
      </div>
    </FullImage>
  );
};

export default HeroBanner;
