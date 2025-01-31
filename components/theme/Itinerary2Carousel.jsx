import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import BackgroundImageLoader from "../UpdatedBackgroundImageLoader";
import TailoredFormMobileModal from "../modals/TailoredFomrMobile";
import openTailoredModal from "../../services/openTailoredModal";
import media from "../media";

const Container = styled.div`
  width: 100%;
  height: 25rem;
  @media screen and (min-width: 768px) {
    height: 25rem;
  }
  position: relative;
`;

export default function Itinerary2Carousel(props) {
  return (
    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {props.elements.map((element, index) => (
        <Card
          key={index}
          data={element}
          url={element.image}
          heading={element.name}
          description={element.text}
          tag={element.tag}
          destination={element.destination}
          pageId={element.page_id}
        />
      ))}
    </div>
  );
}

const Card = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const [tripDestination, setTripDestination] = useState("");
  const [destinationType, setDestinationType] = useState("");
  const [pageId, setPageId] = useState("");


  const handleClick = () => {
    if (props.data.trip_planner) {
      const { destination, id, value } = getParams(props.data.cta_path);

      if (isPageWide) {
        setTripDestination(destination);
        setDestinationType(id?.replace("_id", ""));
        setPageId(value);
        setShowTailoredModal(true);
      } else {
        openTailoredModal(router, value, destination, id?.replace("_id", ""));
      }
    } else {
      router.push(props.data.cta_path);
    }
  };

  const getParams = (params) => {
    const urlParams = new URLSearchParams(params);

    // Extract destination (always present)
    const destination = urlParams.get("destination");

    // Extract any of the possible IDs
    const possibleIds = ["country_id", "state_id", "city_id", "page_id"];
    let selectedId = null;
    let selectedValue = null;

    for (const id of possibleIds) {
      if (urlParams.has(id)) {
        selectedId = id;
        selectedValue = urlParams.get(id);
        break; // Stop after finding the first available ID
      }
    }

    return {
      destination,
      id: selectedId,
      value: selectedValue,
    };
  };

  return (
    <Container
      onClick={handleClick}
      className="cursor-pointer hover:scale-105 transition-transform"
    >
      <BackgroundImageLoader
        padding={props.padding}
        filter={"brightness(0.8)"}
        url={props.url}
        dimensions={{ width: 2240, height: 840 }}
        dimensionsMobile={{ width: 607, height: 810 }}
        style={{ position: "absolute" }}
        className="center"
        borderRadius={"10px"}
        resizeMode={"cover"}
        noLazy={props.noLazy}
      >
        <div
          style={{
            position: "absolute",
            zIndex: "5",
            width: "100%",
            height: "100%",
            color: "white",
          }}
        >
          <div className="h-full flex flex-col justify-between p-4">
            <div className=" bg-[#F7E700] w-fit px-3 py-1 rounded-lg place-self-end text-black font-medium">
              {props.tag}
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[22px] font-bold">{props.heading}</div>
              <div className="text-[16px] font-[350]">{props.description}</div>
            </div>
          </div>
        </div>
      </BackgroundImageLoader>

      <TailoredFormMobileModal
        destinationType={destinationType}
        page_id={pageId}
        children_cities={props.children_cities}
        destination={tripDestination}
        cities={props.cities}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
        eventDates={props.eventDates}
      />
    </Container>
  );
};
