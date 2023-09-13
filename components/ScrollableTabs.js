import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const ScrollableTabsContainer = styled.div`
  position: relative;
  width: 100%;

  overflow-x: auto;
`;

const ScrollableTabsInnerContainer = styled.div`
  display: flex;
`;

const ScrollableTab = styled.div`
  padding: 10px;
  margin-right: 10px;
  cursor: pointer;
  white-space: nowrap;
  color: ${(props) => props.theme.colors.textSecondary};

  &:last-of-type {
    margin-right: 0;
  }

  &.scrollable-tabs__tab--active {
    color: ${(props) => props.theme.colors.textPrimary};
    border-bottom: 2px solid ${(props) => props.theme.colors.textPrimary};
  }
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 0;
  ${(props) => (props.left ? 'left: 0;' : 'right: 0;')}
  width: 50px;
  height: 100%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 30px;
    height: 30px;
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const ScrollableTabs = ({ Mstyle = 'simple', items, activeItem, onSelect }) => {
  const tabsContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const handleScroll = () => {
    const tabsContainer = tabsContainerRef.current;
    setCanScrollLeft(tabsContainer.scrollLeft > 0);
    setCanScrollRight(
      tabsContainer.scrollLeft <
        tabsContainer.scrollWidth - tabsContainer.offsetWidth
    );
  };

  const handleScrollLeft = () => {
    const tabsContainer = tabsContainerRef.current;
    const scrollDistance = Math.floor(tabsContainer.offsetWidth / 2);
    tabsContainer.scrollBy({
      left: -scrollDistance,
      behavior: 'smooth',
    });
  };

  const handleScrollRight = () => {
    const tabsContainer = tabsContainerRef.current;
    const scrollDistance = Math.floor(tabsContainer.offsetWidth / 2);
    tabsContainer.scrollBy({
      left: scrollDistance,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <ScrollableTabsContainer>
      {canScrollLeft && (
        <ScrollButton left onClick={handleScrollLeft}>
          <IoIosArrowBack />
        </ScrollButton>
      )}
      <ScrollableTabsInnerContainer
        ref={tabsContainerRef}
        onScroll={handleScroll}
        className={`${canScrollRight &&
          'scrollable-tabs__container--right-end'}`}
      >
        {items.map((tab, index) => (
          <ScrollableTab
            key={index}
            className={`${index === activeTab &&
              'scrollable-tabs__tab--active'}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </ScrollableTab>
        ))}
      </ScrollableTabsInnerContainer>

      {canScrollRight && (
        <ScrollButton right onClick={handleScrollRight}>
          <IoIosArrowForward />
        </ScrollButton>
      )}
    </ScrollableTabsContainer>
  );
};

export default ScrollableTabs;
