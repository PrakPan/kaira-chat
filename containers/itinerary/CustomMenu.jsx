import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-scroll';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`

  from {
    transform: translateY(-50px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const MenuItem = styled.div`
  padding: 10px;
  cursor: pointer;
  width: max-content;
  padding: 10px 24px 10px 24px;
  margin-left: 4px;
  background-color: ${({ isActive }) => (isActive ? '#262626' : 'none')};
  color: ${({ isActive }) => (isActive ? '#F7E700' : '#7A7A7A')};
  border-radius: ${({ isActive }) =>
    isActive ? '10% 10% 0 0' : '10% 10% 0 0'};
  transition: border-color 0.3s ease;
  font-weight: 600;
  border-bottom: ${({ isActive }) => (isActive ? '4px solid #F7E700' : 'none')};
  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#262626' : '#262626c7')};
    color: white;
  }
`;
const RoundMenuItem = styled.div`
  padding: 4px 6px 6px 3px;
  cursor: pointer;
  width: ${({ Isvertical }) => (Isvertical ? '95px' : 'max-content')};
 
  display: flex;
  justify-content: center;
  margin: ${({ Isvertical }) =>
    Isvertical ? '12px 0px 0px 0px' : '0px 7px 0px 0px'};
  
  background-color: ${({ isActive }) => (isActive ? '#01202B' : 'none')};
  color: ${({ isActive }) => (isActive ? '#fff' : '#111')};
  border-radius: 8px;

  transition: border-color 0.3s ease;
  border: ${({ isActive }) => (!isActive ? '1.5px solid #ECEAEA' : 'none')};
  /* border-bottom: ${({ isActive }) =>
    isActive ? '4px solid #F7E700' : 'none'}; */
  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#262626' : '#262626c7')};
    color: white;
  }
`;
const AnimatedMenuItem = styled(MenuItem)`
  animation: ${slideIn} 0.5s ease;
`;

const CustomMenu = ({
  Isvertical,
  Iterable,
  BarName,
  Mstyle = 'simple',
  item,
  activeItem,
  onSelect,
}) => {
  // const [activeTabPosition, setActiveTabPosition] = useState(0);

  // const isActiveTabInView = useIsComponentInView(
  //   activeItem.id,
  //   { threshold: 0.5 },
  //   (isInView) => {
  //     if (!isInView) {
  //       const containerElement = navref.current;
  //       if (containerElement) {
  //         containerElement.scrollTo({
  //           left: activeTabPosition,
  //           behavior: 'smooth',
  //         });
  //       }
  //     }
  //   }
  // );
  // useEffect(() => {
  //   const activeTabElement = document.getElementById(activeItem.id);
  //   if (activeTabElement) {
  //     setActiveTabPosition(activeTabElement.offsetLeft);
  //   }
  // }, [activeItem,isActiveTabInView]);

  return (
    <Link
      key={item.id}
      to={item.link}
      id={`${BarName} ${item.id}`}
      style={{ textDecoration: 'none' }}
      spy={true}
      smooth={true}
      duration={500}
      offset={-150}
      onSetActive={() => onSelect(item.id)}
    >
      {Mstyle == 'round' ? (
        <RoundMenuItem
          Isvertical={Isvertical}
          isActive={activeItem === item.id}
          onClick={() => onSelect(item.id)}
        >
          {item[Iterable]}
        </RoundMenuItem>
      ) : (
        <MenuItem
          isActive={activeItem === item.id}
          onClick={() => onSelect(item.id)}
        >
          {item[Iterable]}
        </MenuItem>
      )}
    </Link>
  );
};

export default CustomMenu;
