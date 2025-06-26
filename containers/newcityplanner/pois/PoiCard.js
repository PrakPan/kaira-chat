import styled, { keyframes } from "styled-components";
import ImageLoader from "../../../components/ImageLoader";
import { MdNavigateNext } from "react-icons/md";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";
import { useEffect, useState } from "react";
import { logEvent } from "../../../services/ga/Index";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const LeftSlideIn = keyframes`
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(25px);
  }
`;

const LeftSlideOut = keyframes`
  from {
    transform: translateX(25px);
  }
  to {
    transform: translateX(0%);
  }
`;

const RightSlideIn = keyframes`
  from {
    transform: translateX(0px);
  }
  to {
    transform: translateX(-25px);
  }
`;

const RightSlideOut = keyframes`
  from {
    transform: translateX(-25px);
  }
  to {
    transform: translateX(0px);
  }
`;

const Container = styled.div`
  position: relative;
  cursor: pointer;
  border-radius: 15px;

  overflow: hidden;
  & :hover {
    .AnimateLeft {
      animation: 0.5s ${LeftSlideIn} forwards;
    }
    .AnimateRight {
      animation: 0.5s ${RightSlideIn} forwards;
    }
  }
`;

const Typography = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-weight: 600;
  font-size: 16px;
  position: absolute;
  bottom: 10px;
  left: 16px;
  right: 5px;
  color: white;

  .text-wrap {
    max-width: 80%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.2;
  }

  .AnimateLeft {
    animation: 0.5s ${LeftSlideOut};
  }

  .AnimateRight {
    animation: 0.5s ${RightSlideOut};
  }
`;


const ImageContainer = styled.div`
  overflow: hidden;
  color: grey;
  transition: 0.5s all ease-in-out;
  height: auto;
  &:hover {
    transform: scale(1.1);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 0.5s ease;
  background: linear-gradient(
    0deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(0, 0, 0, 1) 0%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 1;
  &:hover {
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 1) 0%,
      rgba(255, 255, 255, 0) 58%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#000000",endColorstr="#ffffff",GradientType=1);
  }
`;

export default function PoiCard(props) {
  const [show, setShow] = useState(false);
  const [stars, setStars] = useState(null);
  const activityData={
    type:"poi",
    id:props.data.id
  }

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShow(false);
  };

  const handlePOIClick = (e) => {
    setShow(true);
    logEvent({
      action: "Details_View",
      params: {
        page: props?.page ? props.page : "",
        event_category: "Click",
        event_value: props?.data?.name,
        event_action: `Things to do in ${props?.city}`,
      },
    });
  };

  useEffect(() => {
    let stars = [];

    if (props.data?.rating) {
      for (let i = 0; i < Math.floor(props.data.rating); i++) {
        stars.push(<FaStar />);
      }

      if (Math.floor(props.data.rating) < props.data.rating)
        stars.push(<FaStarHalfAlt />);

      setStars(stars);
    }
  }, []);

  return (
    <Container className="relative" onClick={handlePOIClick}>
      <ImageContainer>
        <ImageLoader
          url={props.data.image}
          dimensions={{ height: 250, width: 500 }}
          dimensionsMobile={{ width: 500, height: 350 }}
          noLazy
        />
      </ImageContainer>

      <Overlay />

      {props.data.name && (
       <Typography>
       <div className="text-wrap">
         <p className="AnimateLeft">{props.data.name}</p>
         {stars && (
           <div className="text-white flex flex-row items-center gap-1 text-xs AnimateLeft">
             <span className="flex flex-row gap-1 text-[#FFD201]">{stars}</span>
             {props.data.rating} ({props.data?.user_ratings_total})
           </div>
         )}
       </div>
     
       <div>
         <MdNavigateNext
           style={{ fontSize: "1.8rem" }}
           className="AnimateRight"
         />
       </div>
     </Typography>
     
      )}

      <POIDetailsDrawer
        show={show}
        iconId={props.data.id}
        ActivityiconId={props.isActivity ? props.data.id : null}
        handleCloseDrawer={handleCloseDrawer}
        name={props.data.name}
        removeDelete={props?.removeDelete}
        activityData={activityData}
        removeChange={props?.removeChange}
      />
    </Container>
  );
}
