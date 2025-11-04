import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { IoMenu } from "react-icons/io5";
import media from "../media";
import openTailoredModal from "../../services/openTailoredModal";
import TailoredFormMobileModal from "../modals/TailoredFomrMobile";
import Destination1Carousel from "./Destination1Carousel";
import Itinerary2Carousel from "./Itinerary2Carousel";
import Activity1Carousel from "./Activity1Carousel";
import Reviews1Carousel from "./Reviews1Carousel";
import PrimaryHeading from "../heading/PrimaryHeading";
import Poi from "../../containers/newcityplanner/pois/Index";
import Itinerary1Carousel from "./Itinerary1Carousel";
import OldLocations from "../containers/plannerlocations/Index";
import Activity2 from "../../containers/newcityplanner/activities/Index.js";

export default function Navigation({ components, slug }) {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [heading, setHeading] = useState(null);
  const [navItems, setNavItems] = useState(null);
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const headingComponent = components.find((item) => !item.carousel);
    if (headingComponent) {
      setHeading(headingComponent.heading);
    }

    const otherComponents = components.filter((item) => item.carousel);
    setNavItems(otherComponents);
  }, [components]);

  const handlePlanButton = (pageId, destination, type) => {
    if (isPageWide) {
      setShowTailoredModal(true);
    } else {
      openTailoredModal(router, pageId, destination, type);
    }
  };

  return (
    <div className="space-y-10">
      {navItems && (
        <>
          <PrimaryHeading className="mt-5">{heading}</PrimaryHeading>

          <NavigationMenu
            navItems={navItems}
            activeTab={activeIndex}
            setActiveTab={setActiveIndex}
            slug={slug}
          />

          <ComponentDisplay
            component={navItems[activeIndex]}
            handlePlanButton={handlePlanButton}
            setDestination={setDestination}
            slug={slug}
          />
        </>
      )}

      <TailoredFormMobileModal
        destinationType={destination?.type}
        page_id={destination?.pageId}
        destination={destination?.name}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
      />
    </div>
  );
}

const NavigationMenu = ({ navItems, activeTab, setActiveTab, slug }) => {
  let isPageWide = media("(min-width: 768px)");
  const tabsRef = useRef(null);
  const [showTabs, setShowTabs] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (tabsRef.current && !tabsRef.current.contains(e.target)) {
        setShowTabs(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);

  const handleClick = (name) => {
    setActiveTab(name);
    setShowTabs(false);
  };

  return (
    <div className="relative">
      {showTabs && (
        <div
          ref={tabsRef}
          className="z-50 absolute top-[100%] bg-white drop-shadow-2xl p-3 rounded-lg flex flex-col gap-2"
        >
          {navItems.map((tab, index) => (
            <div
              key={tab.heading}
              onClick={() => handleClick(index)}
              className={`text-nowrap cursor-pointer border-1 rounded-full px-3 md:px-5 py-2 md:py-3 font-semibold text-[15px] text-[#7C7C7C] ${
                activeTab == index ? "border-black bg-[#F7E700] text-black" : ""
              }  ${slug === "perfect-proposals-2025" ? "mx-auto" : ""}`}
            >
              {tab.heading}
            </div>
          ))}
        </div>
      )}

      <div
        className={`flex gap-3 flex-row items-center ${
          slug === "perfect-proposals-2025" ? "" : "justify-between"
        } overflow-auto hide-scrollbar`}
      >
        {isPageWide ? (
          <div
            className={` flex flex-row items-center ${
              slug === "perfect-proposals-2025"
                ? "gap-1 w-[60vw] mx-auto"
                : "gap-3 w-full"
            }  overflow-x-auto hide-scrollbar`}
          >
            {navItems.map((tab, index) => (
              <div
                key={tab.heading}
                onClick={() => handleClick(index)}
                className={`text-nowrap cursor-pointer border-1 rounded-full px-3 md:px-5 py-2 md:py-3 font-semibold text-[15px] text-[#7C7C7C] ${
                  activeTab == index
                    ? "border-black bg-[#F7E700] text-black"
                    : ""
                } ${slug === "perfect-proposals-2025" ? "mx-auto" : ""} `}
              >
                {tab.heading}
              </div>
            ))}
          </div>
        ) : (
          <div className=" flex flex-row items-center gap-2">
            <IoMenu
              onClick={() => setShowTabs((prev) => !prev)}
              className="text-3xl"
            />

            {navItems.map(
              (tab, index) =>
                activeTab === index && (
                  <div
                    key={tab.heading}
                    onClick={() => handleClick(index)}
                    className={`text-nowrap cursor-pointer border-1 rounded-full px-3 md:px-5 py-2 md:py-3 font-semibold text-[15px] text-[#7C7C7C] ${
                      activeTab == index
                        ? "border-black bg-[#F7E700] text-black"
                        : ""
                    }`}
                  >
                    {tab.heading}
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ComponentDisplay = ({ component, handlePlanButton, setDestination, slug}) => (
  <div className="component">
    {component.carousel === "destination-1" ? (
      <Destination1Carousel
        handlePlanButton={handlePlanButton}
        setDestination={setDestination}
        packages={[
    ...component.cities.map(item => ({ ...item, type: "City" })),
    ...component.states.map(item => ({ ...item, type: "State" })),
    ...component.countries.map(item => ({ ...item, type: "Country" })),
  ]}
      />
    ) : component.carousel === "destination-2" ? (
      <></>
    ) : component.carousel === "itinerary-1" ? (
      <> <Itinerary1Carousel
                                itineraries={component.itineraries}
                              /></>
    ) : component.carousel === "itinerary-2" ? (
      <Itinerary2Carousel elements={component.elements} />
    ) : component.carousel === "activity-1" ? (
      <Activity1Carousel activities={component.activities} />
    ) : component.carousel === "review-1" ? (
      <Reviews1Carousel reviews={component.reviews} />
    ) : component.carousel === "destination-5" ? (
      <Poi
        elevation={component?.elevation}
        data={component?.data}
        thingsToDoPage={component?.thingsToDoPage}
        pois={component?.pois}
        city={component?.name}
      /> )
      : component.carousel === "state-1" ? (
                      <>
                        <OldLocations
                          locations={component?.states}
                          page_id={component?.id}
                          destination={component?.name}
                          viewall
                          country={component?.name}
                          planner
                          page={"Country Page"}
                        ></OldLocations>
   </>) : component.carousel === "Activity-2" ? (
                      <>
                        <Activity2
                          data={component.activities}
                          activities={component?.activities}
                          city={component?.name}
                          // handlePlanButtonClick={()=>{}}
                          // {handlePlanButtonClick}
                          slug={slug}
                          page={"Country Page"}
                        />
                       
                      </>
                    ) : null}
  </div>
);
