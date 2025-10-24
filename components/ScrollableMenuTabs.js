import React, { useState } from "react";
import styled from "styled-components";
import { useSticky } from "../hooks/useSticky";
import CustomMenu from "../containers/itinerary/CustomMenu";
import { useDebounce } from "../hooks/debounce";
import {
  NavigationMarker,
  useNavigationMarker,
} from "../hooks/useNavigationMarker";
import useFieldOfView from "../hooks/useFieldOfView";
import { connect, useSelector } from "react-redux";
import { logEvent } from "../services/ga/Index";

const Navbar = styled.div`
  font-family: lexend;
  display: flex;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-x: scroll;
  align-items: center;
  overflow-y: ${({ Isvertical }) => (Isvertical ? "scroll" : "auto")};
  height: ${({ Isvertical }) => (Isvertical ? "85vh" : "auto")};
  flex-direction: ${({ Isvertical }) => (Isvertical ? "column" : "row")};
  margin: ${({ Isvertical }) => (Isvertical ? "0px -20px 0px -101px" : "")};
  position: ${({ Isvertical }) => (Isvertical ? "absolute" : "inherit")};
  background-color: white;
`;

const NavbarContainer = styled.div`
  position: sticky !important;
  z-index: 1;
  display: flex;
  flex-direction: ${({ Isvertical }) => (Isvertical ? "column" : "row")};
  margin: ${({ Isvertical }) =>
    Isvertical ? "0px -20px 0px -20px" : "0px -20px 0px -20px"};
  background-color: white;
  position: inherit;
  top: 120px;
  display: flex;
  width: ${({ Isvertical }) => (Isvertical ? "fit-content" : "auto")};
  height: ${({ isInView, Isvertical }) =>
    isInView && Isvertical ? "85vh" : "auto"};
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  margin: 0px -20px 0px -20px;
  background-color: white;
`;

const ScrollableMenuTabs = ({
  icons = true,
  offset,
  items,
  BarName,
  Mstyle = "simple",
  Iterable = "label",
  vertical = false,
  classStyle,
  scrollOffSet,
  tripsPage,
  scrollContainerRef,
  handleActiveTab
}) => {
  const [activeItem, setActiveItem] = useState(items[0].id);
  const startDate = useSelector((state) => state.itineraryStartDate.startDate);
  const { ref, isSticky } = useSticky(90);
  const isInView = useFieldOfView("Stays-Head");
  let manuallyClick = false

  const handleSelect = (index, itemId) => {
    manuallyClick = true;
    setActiveItem(itemId);
    if (handleActiveTab) {
      handleActiveTab(itemId)
    } else {
      logEvent({
        action: "Navigation",
        params: {
          page: "Itinerary Page ",
          event_category: "Button Click",
          event_label: items[index]?.label,
          event_action: "Navigation Bar",
        },
      });
    }
    manuallyClick = false
  };

  function isActive(link) {
    return link.classList.contains("active");
  }

  const handleScroll = () => {
    const tabsContainer = ref.current?.querySelectorAll("a") && [];
    for (let i = 0; i < tabsContainer.length; i++) {
      if (isActive(tabsContainer[i])) {
      }
    }
  };

  const onActiveTabChange = (ind, tabid) => {
    if (!manuallyClick) {
      setActiveItem(tabid)
    }
  }

  const debounceFun = useDebounce(handleScroll, 500);
  const sectionIds = items.map(item => item.id);
  const { markerPos, ...markerHandlers } = useNavigationMarker(scrollContainerRef, sectionIds, onActiveTabChange);

  return (
    <NavbarContainer
      style={{ top: offset, marginLeft: icons ? "0px" : "0px" }}
      Isvertical={vertical}
      className={classStyle}
      isInView={isInView}
    >
      <Navbar ref={ref} onScroll={debounceFun} Isvertical={vertical}>
        {vertical && !tripsPage ? (
          <div className="font-bold">{new Date(startDate).getFullYear()}</div>
        ) : null}
        {items.map((item, index) => (
          <CustomMenu
            {...markerHandlers}
            key={index}
            index={index}
            Isvertical={vertical}
            Iterable={Iterable}
            BarName={BarName}
            Mstyle={Mstyle}
            item={item}
            activeItem={activeItem}
            onSelect={handleSelect}
            offSet={scrollOffSet}
          />
        ))}
        <NavigationMarker x={markerPos.x} width={markerPos.width} />
      </Navbar>
    </NavbarContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    tripsPage: state.TripsPage,
  };
};

export default connect(mapStateToProps)(ScrollableMenuTabs);
