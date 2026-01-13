import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import BackgroundImageLoader from "../UpdatedBackgroundImageLoader";
import TailoredFormMobileModal from "../modals/TailoredFomrMobile";
import openTailoredModal from "../../services/openTailoredModal";
import media from "../media";
import Image from "next/image";

const Container = styled.div`
  width: 100%;
  height: 25rem;
  @media screen and (min-width: 768px) {
    height: 20rem;
  }
  position: relative;
`;

export default function BannerCards(props) {
  return (
    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <Image
        src={`https://d31aoa0ehgvjdi.cloudfront.net/media/new-year/bg.png`}
        width={350}
        height={60}
        className="absolute -top-[10rem] -left-[14rem]"
      />

      <Image
        src={`https://d31aoa0ehgvjdi.cloudfront.net/media/new-year/bg.png`}
        width={350}
        height={60}
        className="absolute -bottom-[15rem] md:-right-[7rem]"
      />

      <Card
        url={"media/new-year/bannercard1.png"}
        heading={"Celebrate New Year's Eve in Goa!"}
        description={
          "Experience vibrant nightlife, electrifying beach parties, and iconic music festivals. Book now for an unforgettable start to the New Year!"
        }
        nights={6}
        days={7}
        destination={"Goa"}
        pageId={"277"}
      />
      <Card
        url={"media/new-year/bannercard2.png"}
        heading={"Once-in-a-Year Exclusive Trip to Kasol!"}
        description={
          "Escape to the serene beauty of Kasol this New Year—majestic mountains, cozy vibes, and unforgettable adventures await!"
        }
        nights={4}
        days={5}
        destination={"Kasol"}
        pageId={"144"}
      />
    </div>
  );
}

const Card = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [showTailoredModal, setShowTailoredModal] = useState(false);

  const handlePlanButton = () => {
    // if (isPageWide) {
    //   setShowTailoredModal(true);
    // } else {
    //   openTailoredModal(router, props.pageId, props.destination);
    // }
    router.push({
        pathname: "/new-trip",
        query: { ...router.query,source: props?.destination || 'home' }
    });
  };

  return (
    <Container>
      <BackgroundImageLoader
        padding={props.padding}
        filter={"brightness(0.8)"}
        url={props.url}
        dimensions={{ width: 2240, height: 840 }}
        dimensionsMobile={{ width: 607, height: 810 }}
        style={{ position: "absolute" }}
        className="center"
        resizeMode={"fill"}
        borderRadius={"10px"}
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
            <div className="text-black bg-[#F7E700] w-fit px-3 py-1 rounded-lg place-self-end">
              {props.nights} Nights/{props.days} Days
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[22px] font-bold">{props.heading}</div>
              <div className="text-[16px]">{props.description}</div>
              <button
                onClick={handlePlanButton}
                className="w-fit bg-[#F7E700] border-2 border-black rounded-lg text-[15px] text-black font-semibold text-center px-5 py-2"
              >
                Plan a trip
              </button>
            </div>
          </div>
        </div>
      </BackgroundImageLoader>

      <TailoredFormMobileModal
        destinationType={"city-planner"}
        page_id={props.pageId}
        children_cities={props.children_cities}
        destination={props.destination}
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
