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

  const handlePlanButton = (pageId, destination, type) => {
    if (isPageWide) {
      setShowTailoredModal(true);
    } else {
      openTailoredModal(router, pageId, destination, type);
    }
  };

  return (
    <div className="relative flex flex-col gap-3">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        domestic={domestic}
        setDomestic={setDomestic}
      />

      <Carousel
        activeTab={activeTab}
        packages={domestic ? DOMESTIC_PACKAGES : INTERNATIONAL_PACKAGES}
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

const Navigation = ({ activeTab, setActiveTab, domestic, setDomestic }) => {
  let isPageWide = media("(min-width: 768px)");
  const menuRref = useRef(null);
  const tabsRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showTabs, setShowTabs] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (menuRref.current && !menuRref.current.contains(e.target)) {
        setShowMenu(false);
      }

      if (tabsRef.current && !tabsRef.current.contains(e.target)) {
        setShowTabs(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);

  const Tabs = [
    { id: 1, name: "All" },
    { id: 2, name: "Asia" },
    { id: 3, name: "Europe" },
    { id: 4, name: "North America" },
    { id: 5, name: "South America" },
    { id: 6, name: "Australia" },
    { id: 6, name: "Africa" },
  ];

  const handleClick = (name) => {
    setActiveTab(name);

    if (name === "Religious" && !domestic) {
      setDomestic(true);
    }

    setShowTabs(false);
  };

  

  return (
    <div className="relative flex flex-col gap-3">
      {showTabs && (
        <div
          ref={tabsRef}
          className="z-50 absolute top-[100%] bg-white drop-shadow-2xl p-3 rounded-lg flex flex-col gap-2"
        >
          {Tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => handleClick(tab.name)}
              className={`text-nowrap cursor-pointer border-1 rounded-full px-3 md:px-5 py-2 md:py-3 font-semibold text-[15px] text-[#7C7C7C] ${
                activeTab == tab.name
                  ? "border-black bg-[#F7E700] text-black"
                  : ""
              }`}
            >
              {tab.name}
            </div>
          ))}
        </div>
      )}


      <div className="flex gap-3 flex-row items-center justify-between overflow-auto hide-scrollbar">
        {isPageWide ? (
          <div className="w-full flex flex-row items-center gap-3 overflow-x-auto hide-scrollbar">
            {Tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => handleClick(tab.name)}
                className={`text-nowrap cursor-pointer border-1 rounded-full px-3 md:px-5 py-2 md:py-3 font-semibold text-[15px] text-[#7C7C7C] ${
                  activeTab == tab.name
                    ? "border-black bg-[#F7E700] text-black"
                    : ""
                }`}
              >
                {tab.name}
              </div>
            ))}
          </div>
        ) : (
          <div className=" flex flex-row items-center gap-2">
            <IoMenu
              onClick={() => setShowTabs((prev) => !prev)}
              className="text-3xl"
            />

            {Tabs.map(
              (tab) =>
                activeTab === tab.name && (
                  <div
                    key={tab.id}
                    onClick={() => handleClick(tab.name)}
                    className={`text-nowrap cursor-pointer border-1 rounded-full px-3 md:px-5 py-2 md:py-3 font-semibold text-[15px] text-[#7C7C7C] ${
                      activeTab == tab.name
                        ? "border-black bg-[#F7E700] text-black"
                        : ""
                    }`}
                  >
                    {tab.name}
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Carousel = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [MobilecardsToShowJSX, setMobileCardsToShowJSX] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    let cardsArr = [];
    for (let i = 0; i < props.packages.length; i++) {
      if (
        props.activeTab === "All" ||
        props.packages[i].category === props.activeTab
      ) {
        cardsArr.push(
          <Card
            key={props.packages[i].id}
            // path={props.packages[i].path}
            heading={props.packages[i].heading}
            tagline={props.packages[i].tagline}
            img={props.packages[i].image}
            budget={props.packages[i].budget}
            // slug={props.packages[i].link}
            // link={props.packages[i].link}
            // country={props.country}
            page={"New Year Page"}
            data={props.packages[i]}
            handlePlanButton={props.handlePlanButton}
            setDestination={props.setDestination}
          ></Card>
        );
      }
    }

    setCards(cardsArr);
    setMobileCardsToShowJSX(cardsArr);
  }, [props.activeTab, props.packages]);

  if (isPageWide)
    return (
      <div>
        {cards.length ? (
          <SwiperCarousel
            navigationButtons={true}
            slidesPerView={4}
            cards={cards}
          ></SwiperCarousel>
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
            ></SwiperCarousel>
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

            <div className="text-white text-[14px]">
              From{" "}
              <span className="font-bold">₹{getIndianPrice(props.budget)}</span>
              /- per day
            </div>
          </div>
        )}

        <button className="w-full bg-[#F7E700] rounded-lg text-[15px] text-black font-semibold text-center px-2 py-2">
          Plan a trip
        </button>
      </div>
    </ImageContainer>
  );
};
