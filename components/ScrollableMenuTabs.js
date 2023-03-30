import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import useMediaQuery from '../hooks/useMedia';
import { useSticky } from '../hooks/useSticky';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import CustomMenu from '../containers/itinerary/CustomMenu';
import { useDebounce } from '../hooks/debounce';
import { useIsComponentInView } from '../hooks/useComponentInView';




///////// Style


const Navbar = styled.div`
  /* position: ${({ sticky }) => (sticky ? 'sticky' : 'inherit')}; */
  
  
  display: flex;
  ::-webkit-scrollbar {
    display: none;
  }
-ms-overflow-style: none;
scrollbar-width: none;
  overflow-x: scroll;
  align-items: center;
  
  margin: 0px -20px 0px -20px;
  background-color: white;
`;
const NavbarContainer = styled.div`
  position: ${({ sticky }) => (sticky ? 'sticky' : 'inherit')};
  z-index: ${({ sticky }) => (sticky ? '1000' : '997')};
  top: ${({offset}) => offset};
  display:flex;
  flex-direction: row;
  margin: 0px -20px 0px -20px;
  background-color: white;
`;








///// Implementation


const ScrollableMenuTabs = ({offset,items,BarName, Mstyle='simple'}) => {
    const [activeItem, setActiveItem] = useState(1);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [activeTabPosition, setActiveTabPosition] = useState(0);
/// hooks 


const { ref, isSticky } = useSticky(90);
const isDesktop = useMediaQuery('(min-width:1148px)');

/////// functionality 

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
    setCanScrollLeft(true)
  };
  function isActive(link) {
    return link.classList.contains('active');
  }
  const handleScroll = () => {
    const tabContainer = ref.current;
    const tabsContainer = ref.current?.querySelectorAll('a') ?? [];
    for (let i = 0; i < tabsContainer.length; i++) {
        if (isActive(tabsContainer[i])) {
          console.log(tabsContainer[i]);
          
        }
      }
      
console.log(ref.current)
    setCanScrollLeft(tabContainer.scrollLeft > 8);
    
  };


   useEffect(() => {
    const activeTabElement = document.getElementById(`${BarName} ${activeItem}`);
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
  console.log(activeItem)
  const debounceFun = useDebounce(handleScroll, 500);

  return (
    <NavbarContainer sticky={isSticky & !isDesktop} offset={offset}>
    <IoIosArrowBack
      style={{
        color: 'black',
        width: 'max-content',
        fontSize: '50px',
        marginRight: '20px',
        contentVisibility: `${canScrollLeft ? 'auto' : 'hidden'}`
      }}
      onClick={handleScrollLeft}
    />
    <Navbar ref={ref} onScroll={debounceFun}>
    {items.map((item) => (
        <CustomMenu
        BarName={BarName}
        Mstyle={Mstyle}
        item={item}
        activeItem={activeItem}
        onSelect={handleSelect}
      />
    ))}
      
    </Navbar>
    <IoIosArrowForward
      
      style={{
        
        color: 'black',
        width: 'max-content',
        fontSize: '50px',
        marginLeft: '20px',
      }}
      onClick={handleScrollRight}
    />
  </NavbarContainer>
  )
}

export default ScrollableMenuTabs