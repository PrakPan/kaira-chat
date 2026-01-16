import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { IoMenu } from "react-icons/io5";
import styled from "styled-components";
import ImageLoader from "../ImageLoader";
import { logEvent } from "../../services/ga/Index";
import { getIndianPrice } from "../../services/getIndianPrice";
import media from "../media";
import { MobileSkeleton } from "../containers/plannerlocations/LocationSkeleton";
import SwiperCarousel from "../SwiperCarousel";
import {
  DOMESTIC_PACKAGES,
  INTERNATIONAL_PACKAGES,
} from "../../public/content/newyear";
import TailoredFormMobileModal from "../modals/TailoredFomrMobile";
import openTailoredModal from "../../services/openTailoredModal";

const ImageFade = styled.div`
  width: 100%;
  height: auto;
  transition: 0.2s all ease-in-out;
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    ${ImageFade} {
      transition: 0.2s all ease-in-out;
      transform: scale(1.1);
    }
  }
  @media screen and (min-width: 768px) {
    height: 50vh;
  }
`;

export default function HoneymoonPackages(props) {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [domestic, setDomestic] = useState(true);
  const [destination, setDestination] = useState(null);

  const dynamicTabs = props?.data
    .filter((component) => component.is_navigation_type && component.carousel )
    .map((component) => component.heading);

  const handlePlanButton = (pageId, destination, type) => {
    // if (isPageWide) {
    //   setShowTailoredModal(true);
    // } else {
    //   openTailoredModal(router, pageId, destination, type);
    // }
    // router.push("/new-trip");
    setShowTailoredModal(true)
  };
  
  const matchingComponent = props?.data?.find(
    (component) => component.heading === activeTab && component.is_navigation_type
  );

  const { countries = [], cities = [], states = [] } = matchingComponent || {};


  return (
    <div className="relative flex flex-col gap-3">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dynamicTabs={dynamicTabs} 
        domestic={domestic}
        setDomestic={setDomestic}
      />

      <Carousel
        activeTab={activeTab}
        packages={domestic ? DOMESTIC_PACKAGES : INTERNATIONAL_PACKAGES}
        countries={countries}
        cities={cities}
        state={states}
        handlePlanButton={handlePlanButton}
        setDestination={setDestination}
      />


      <TailoredFormMobileModal
        destinationType={destination?.type}
        page_id={destination?.pageId}
        children_cities={props.children_cities}
        destination={destination?.name}
        cities={props.cities}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
        eventDates={props.eventDates}
      />
    </div>
  );
}

const Navigation = ({ activeTab, setActiveTab, dynamicTabs, domestic, setDomestic }) => {
  const isPageWide = media("(min-width: 768px)");
  const tabsRef = useRef(null);
  const [showTabs, setShowTabs] = useState(false);

  const handleTabClick = (name) => {
    setActiveTab(name);
    if (name === "Religious" && !domestic) setDomestic(true);
    setShowTabs(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tabsRef.current && !tabsRef.current.contains(e.target)) {
        setShowTabs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex flex-col gap-3">
      {showTabs && (
        <div
          ref={tabsRef}
          className="z-50 absolute top-[100%] bg-white shadow-2xl p-3 rounded-lg flex flex-col gap-2"
        >
          {dynamicTabs.map((tab, index) => (
            <div
              key={index}
              onClick={() => handleTabClick(tab)}
              className={`cursor-pointer border rounded-full px-5 py-2 font-semibold text-sm ${
                activeTab === tab ? "border-black bg-yellow-300 text-black" : ""
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        {isPageWide ? (
          <div className="flex gap-3 overflow-x-auto">
            {dynamicTabs.map((tab, index) => (
              <div
                key={index}
                onClick={() => handleTabClick(tab)}
                className={`cursor-pointer border rounded-full px-5 py-2 font-semibold text-sm ${
                  activeTab === tab ? "border-black bg-yellow-300 text-black" : ""
                }`}
              >
                {tab}
              </div>
            ))}
          </div>
        ) : (
          <IoMenu
            onClick={() => setShowTabs(!showTabs)}
            className="text-3xl cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};


const Carousel = (props) => {
  const isPageWide = media("(min-width: 768px)");
  const [cards, setCards] = useState([]);
  const [MobilecardsToShowJSX, setMobileCardsToShowJSX] = useState([]);

  useEffect(() => {
    const cardsArr = [];

        // Add cards for cities
        props?.cities?.forEach((city) => {
          cardsArr.push(
            <Card
              key={city.id}
              heading={city.name}
              tagline={city.most_popular_for.join(", ")}
              img={city.image}
              page={props.activeTab}
              data={city}
              handlePlanButton={props.handlePlanButton}
              setDestination={props.setDestination}
            />
          );
        });

        // Add cards for countries
        props?.countries?.forEach((country) => {
          cardsArr.push(
            <Card
              key={country.id}
              heading={country.name}
              tagline={country.tagline}
              img={country.image}
              page={props.activeTab}
              data={country}
              handlePlanButton={props.handlePlanButton}
              setDestination={props.setDestination}
            />
          );
        });

        // Add cards for states
        props?.states?.forEach((city) => {
          const state = city.state;
          if (state) {
            cardsArr.push(
              <Card
                key={state.id}
                heading={state.name}
                tagline={`${state.country}, ${state.continent}`}
                img={city.image} // Reuse city's image for the state card
                page={props.activeTab}
                data={state}
                handlePlanButton={props.handlePlanButton}
                setDestination={props.setDestination}
              />
            );
          }
        });

    setCards(cardsArr);
    setMobileCardsToShowJSX(cardsArr);
  }, [props.activeTab, props.cities,props.countries,props.states]);


  if (isPageWide)
    return (
      <div>
        {cards.length ? (
          <SwiperCarousel
            navigationButtons={true}
            slidesPerView={4}
            cards={cards}
          />
        ) : null}
      </div>
    );
  else
    return (
      <div>
        <div style={{ padding: "1rem 0" }}>
          {MobilecardsToShowJSX.length ? (
            <SwiperCarousel
              navigationButtons={true}
              slidesPerView={1}
              cards={MobilecardsToShowJSX}
              pageDots
            />
          ) : (
            <MobileSkeleton />
          )}
        </div>
      </div>
    );
};


const Card = (props) => {
  const [loading, setLoading] = useState(true);

  const handleImageClick = (pageId, destination, type) => {
    props.setDestination({
      name: destination,
      pageId: pageId,
      type: type,
    });

    props.handlePlanButton(pageId, destination, type);

    logEvent({
      action: "View_Destination",
      params: {
        page: "New Year Page",
        event_category: "Click",
        event_label: "View Destination",
        event_value: props?.heading ? props.heading : "",
        event_action: `Plan a Trip`,
      },
    });
  };

  return (
    <ImageContainer
      className={`w-full hover-pointer group ${
        loading ? "bg-gray-200 animate-pulse" : ""
      }`}
      onClick={() =>
        handleImageClick(props.data?.pageId, props.heading, props.data?.type)
      }
    >
      <ImageFade>
        <ImageLoader
          url={props.img}
          dimensions={{ width: 500, height: 500 }}
          dimensionsMobile={{ width: 800, height: 800 }}
          height="50vh"
          style={{ filter: "brightness(0.9)" }}
          onload={() => {
            setLoading(false);
          }}
        ></ImageLoader>
      </ImageFade>

      <div
        className={`w-full flex flex-col px-3 gap-4 rounded-[10px] absolute bottom-0 pb-4 translate-y-[63px] transition-all ${
          !loading &&
          "bg-gradient-to-t from-black from-60% group-hover:translate-y-0"
        }`}
      >
        {loading ? (
          <div className="w-full flex flex-col items-start gap-2">
            <div className="w-[80%] h-10 bg-gray-300 rounded-lg"></div>
            <div className="w-[60%] h-8 bg-gray-300 rounded-lg"></div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <div className="w-full flex flex-col gap-1">
              <div className="text-white text-[18px] font-bold">
                {props.heading}
              </div>

              <div className="text-white text-[15px]">{props.tagline}</div>
            </div>

            {/* <div className="text-white text-[14px]">
              From{" "}
              <span className="font-bold">₹{getIndianPrice(props.budget)}</span>
              /- per day
            </div> */}
          </div>
        )}

        <button className="w-full bg-[#F7E700] rounded-lg text-[15px] text-black font-semibold text-center px-2 py-2">
          Plan a trip
        </button>
      </div>
    </ImageContainer>
  );
};
