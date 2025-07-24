// import FullImgContent from "./FullImgContent";
// import FullImage from "../../FullImage";
// import useMediaQuery from "../../../hooks/useMedia";

// const HeroBanner = (props) => {
//   const isDesktop = useMediaQuery("(min-width:767px)");

//   return (
//     <div id="hero-banner">
//       <FullImage
//         heightmobile="30rem"
//         height="37rem"
//         url={props.image}
//         filter="brightness(1)"
//         resizeMode={props.resizeMode}
//         noLazy
//       >
//         <div
//           className={
//             isDesktop
//               ? "h-full pt-[2rem] md:bg-gradient-to-r md:from-neutral-800 md:to-50%"
//               : "h-full pt-[2rem] bg-black bg-opacity-25"
//           }
//         >
//           <FullImgContent
//             page_id={props.page_id}
//             type={props?.type}
//             subheading={props.subheading}
//             destination={props.destination}
//             cities={props.cities}
//             children_cities={props.children_cities}
//             title={props.title}
//             _startPlanningFunction={props._startPlanningFunction}
//             page={props.page}
//             eventDates={props.eventDates}
//           />
//         </div>
//       </FullImage>
//     </div>
//   );
// };

// export default HeroBanner;

import FullImgContent from "./FullImgContent";
import FullImage from "../../FullImage";
import useMediaQuery from "../../../hooks/useMedia";

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
    </FullImage>
  );
};

export default HeroBanner;
