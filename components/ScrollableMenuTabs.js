import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useMediaQuery from '../hooks/useMedia';
import { useSticky } from '../hooks/useSticky';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import CustomMenu from '../containers/itinerary/CustomMenu';
import { useDebounce } from '../hooks/debounce';
import { useIsComponentInView } from '../hooks/useComponentInView';
import {
  NavigationMarker,
  useNavigationMarker,
} from '../hooks/useNavigationMarker';
import useHorizontalScroll from '../hooks/useHorizontalScroll';
import useFieldOfView from '../hooks/useFieldOfView';

///////// Style

const Navbar = styled.div`
  /* position: ${({ sticky }) => (sticky ? 'sticky' : 'inherit')}; */

  font-family: lexend;
  display: flex;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-x: scroll;
  align-items: center;
  overflow-y: ${({ Isvertical }) => (Isvertical ? 'scroll' : 'auto')};
  height: ${({ Isvertical }) => (Isvertical ? '80vh' : 'auto')};

  flex-direction: ${({ Isvertical }) => (Isvertical ? 'column' : 'row')};

  margin: ${({ Isvertical }) => (Isvertical ? '0px -20px 0px -101px' : '')};
  position: ${({ Isvertical }) => (Isvertical ? 'absolute' : 'inherit')};
  background-color: white;
`;
const NavbarContainer = styled.div`
  position: sticky !important;
  z-index: 1;

  display: flex;

  flex-direction: ${({ Isvertical }) => (Isvertical ? 'column' : 'row')};
  margin: ${({ Isvertical }) =>
    Isvertical ? '0px -20px 0px -20px' : '0px -20px 0px -20px'};
  background-color: white;

  position: inherit;

  top: 120px;

  display: flex;
  width: ${({ Isvertical }) => (Isvertical ? 'fit-content' : 'auto')};
  height: ${({ isInView, Isvertical }) =>
    isInView && Isvertical ? '80vh' : 'auto'};
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  margin: 0px -20px 0px -20px;
  background-color: white;
`;

///// Implementation

const ScrollableMenuTabs = ({
  icons = true,
  offset,
  items,
  BarName,
  year = '2023',
  Mstyle = 'simple',
  Iterable = 'label',
  vertical = false,
  classStyle,
}) => {
  const [activeItem, setActiveItem] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [activeTabPosition, setActiveTabPosition] = useState(0);
  /// hooks

  const { ref, isSticky } = useSticky(90);
  const isDesktop = useMediaQuery('(min-width:1148px)');
  const isInView = useFieldOfView('Stays');
  /////// functionality
  //////////////////////////

  ////////////////////////

  const handleSelect = (itemId) => {
    setActiveItem(itemId);
  };

  const handleScrollLeft = () => {
    const tabsContainer = ref.current;
    const scrollDistance = Math.floor(tabsContainer.offsetWidth / 2);
    tabsContainer.scrollBy({
      left: -scrollDistance,
      behavior: 'smooth',
    });
  };

  const handleScrollRight = () => {
    const tabsContainer = ref.current;

    const scrollDistance = Math.floor(tabsContainer.offsetWidth / 2);

    tabsContainer.scrollBy({
      left: scrollDistance,
      behavior: 'smooth',
    });
    setCanScrollLeft(true);
  };
  function isActive(link) {
    return link.classList.contains('active');
  }
  const handleScroll = () => {
    const tabContainer = ref.current;
    const tabsContainer = ref.current?.querySelectorAll('a') && [];
    for (let i = 0; i < tabsContainer.length; i++) {
      if (isActive(tabsContainer[i])) {
        console.log(tabsContainer[i]);
      }
    }

    console.log(ref.current);
    setCanScrollLeft(tabContainer.scrollLeft > 10);
  };

  useEffect(() => {
    const activeTabElement = document.getElementById(
      `${BarName} ${activeItem}`
    );
    if (activeTabElement) {
      setActiveTabPosition(activeTabElement.offsetLeft);
    }
  }, [activeItem]);

  const isActiveTabInView = useIsComponentInView(
    `${BarName} ${activeItem}`,
    { threshold: 0.5 },
    (isInView) => {
      if (!isInView) {
        const containerElement = ref.current;
        if (containerElement) {
          containerElement.scrollTo({
            left: activeTabPosition,
            behavior: 'smooth',
          });
        }
      }
    }
  );

  const debounceFun = useDebounce(handleScroll, 500);

  const { markerPos, ...markerHandlers } = useNavigationMarker();
  return (
    <NavbarContainer
      style={{ top: offset, marginLeft: icons ? '0px' : '0px' }}
      Isvertical={vertical}
      className={classStyle}
      isInView={isInView}
    >
      {icons ? (
        <IoIosArrowBack
          style={{
            color: 'black',
            textAlign: 'center',
            width: 'max-content',
            fontSize: `${!isDesktop ? '40px' : '20px'}`,
            height: 'auto',
            marginRight: '20px',
            contentVisibility: `${canScrollLeft ? 'auto' : 'hidden'}`,
          }}
          onClick={handleScrollLeft}
        />
      ) : null}

      <Navbar ref={ref} onScroll={debounceFun} Isvertical={vertical}>
        {vertical ? <div className="font-bold">{year}</div> : null}
        {items.map((item, index) => (
          <>
            <CustomMenu
              {...markerHandlers}
              key={index}
              Isvertical={vertical}
              Iterable={Iterable}
              BarName={BarName}
              Mstyle={Mstyle}
              item={item}
              activeItem={activeItem}
              onSelect={handleSelect}
            />
          </>
        ))}
        <NavigationMarker x={markerPos.x} width={markerPos.width} />
      </Navbar>
      {icons ? (
        <IoIosArrowForward
          style={{
            color: 'black',
            textAlign: 'center',
            width: 'max-content',
            fontSize: `${!isDesktop ? '40px' : '20px'}`,
            height: 'auto',
            marginLeft: '20px',
          }}
          onClick={handleScrollRight}
        />
      ) : null}
    </NavbarContainer>
  );
};

export default ScrollableMenuTabs;
