import styled from "styled-components";
import React from "react";
import Pin from "./Pin";
import { MdNavigateNext } from "react-icons/md";
import BriefPin from "./BriefPin";
import { useRouter } from "next/router";

const Container = styled.div`
  cursor: pointer;
  display: grid;
  grid-template-columns: max-content auto max-content;
  &:hover {
    .IconContainer {
      right: -33px;
    }
  }
`;

const Heading = styled.div`
  width: fit-content;
  font-weight: 500;
  color: black;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  position: relative;
`;

const IconContainer = styled.div`
  position: absolute;
  right: -23px;
  opacity: 0.55;
  transition: right 0.2s ease;
`;

const PinSection = (props) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "showCityDetail",
          city_id: props?.cityId
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
    if (!props.duration || props.duration === "0" || props.transfersPin) return;
    props.setShowDrawer(true);
    // console.log("city data is:",props.cityData)
    props.setShowDrawerData(props.cityData);
  };

  // console.log("Rendering: PinSection", {city_name: props?.city, duration: props.duration});

  return (
    <Container
      className="cursor-pointer w-fit"
      onClick={() => {
        if (props?.mercury) handleClick();
      }}
    >
      {props?.mercury ? (
        <BriefPin
          duration={props.duration}
          pinColour={props.pinColour}
          index={props?.index}
          length={props?.length}
        />
      ) : (
        <Pin
          duration={props.duration}
          pinColour={props.pinColour}
          index={props?.index}
          length={props?.length}
        ></Pin>
      )}
      <Heading
        pinColour={props.pinColour}
        className={`${
          props.setCurrentPopup ? "ml-4 heading" : "lg:ml-8 ml-2 heading"
        } `}
      >
        {props.duration >= 0 && props.duration !== null
          ? props.city +
            `${
              props.duration > 1
                ? ` - ${props.duration} Nights`
                : `${props.duration == 0 ? `- 0 ` : ` - ${props.duration}`}  Night`
            } `
          : props.city}
        {props.transfersPin || props.duration == null ? (
          <></>
        ) : (
          <IconContainer className="IconContainer">
            {props?.mercury && (
              <MdNavigateNext
                style={{ fontSize: "1.5rem" }}
                className="AnimateRight"
              />
            )}
          </IconContainer>
        )}
      </Heading>
    </Container>
  );
};

export default React.memo(PinSection);
