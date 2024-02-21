import styled, { keyframes } from "styled-components";
import ImageLoader from "../../../components/ImageLoader";
import { MdNavigateNext } from "react-icons/md";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";
import { useState } from "react";

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
    // opacity : 0.9;
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
  font-weight: 600;
  font-size: 16px;
  position: absolute;
  bottom: 10px;
  left: 16px;
  right: 5px;
  color: white;
  animation: 0.5s ${LeftSlideOut};
  animation: 0.5s ${RightSlideOut};
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

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShow(false);
  };
  return (
    <Container
      onClick={() => {
        setShow(true);
      }}
    >
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
          <p className="AnimateLeft">{props.data.name}</p>{" "}
          <div>
            <MdNavigateNext
              style={{ fontSize: "1.8rem" }}
              className="AnimateRight"
            />
          </div>
        </Typography>
      )}
      <POIDetailsDrawer
        // show={props.showDrawer.isOpen}
        show={show}
        iconId={props.data.id}
        ActivityiconId={props.isActivity ? props.data.id : null}
        // handleCloseDrawer={props.handleCloseDrawer}
        handleCloseDrawer={handleCloseDrawer}
        name={props.data.name}
      />
    </Container>
  );
}
