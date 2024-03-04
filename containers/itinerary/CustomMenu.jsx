import React from 'react';
import { useRef } from 'react';
import { Link } from 'react-scroll';
import styled, { css, keyframes } from 'styled-components';

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
  position: relative;

  border-radius: ${({ isActive }) =>
    isActive ? '10% 10% 0 0' : '10% 10% 0 0'};
  transition: border-color 0.3s ease;
  font-weight: 600;
  border-bottom: ${({ isActive }) =>
    isActive ? '4px solid #F7E700' : '4px solid transparent'};
  :hover {
    background-color: ${({ isActive }) => (isActive ? '#262626' : 'none')};
    color: '#F7E700';
    border-bottom: '2px solid #F7E700';
  }
`;

const RoundMenuItem = styled.div`
  padding: ${({ Isvertical }) =>
    Isvertical ? '4px 9px 6px 9px' : '4px 20px 8px 20px'};
  cursor: pointer;
  width: ${({ Isvertical }) => (Isvertical ? '95px' : 'max-content')};

  display: flex;
  justify-content: center;
  margin: ${({ Isvertical }) =>
    Isvertical ? '12px 0px 0px 0px' : '0px 7px 0px 0px'};

  background-color: ${({ isActive }) => (isActive ? '#262626' : 'none')};
  color: ${({ isActive, Isvertical }) => (isActive ? '#fff' : '#111')};
  border-radius: ${({ isActive, Isvertical }) =>
    isActive & Isvertical ? '8px 8px 0 0;' : '8px'};
  /* border-bottom: 3px solid #f7e700; */
  transition: border-color 0.3s ease;
  border: ${({ isActive }) => (!isActive ? '1.5px solid #ECEAEA' : 'none')};
  border-bottom: ${({ isActive, Isvertical }) =>
    isActive & Isvertical ? '4px solid #F7E700' : '1.5px solid #ECEAEA'};
  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#262626' : '#262626c7')};
    color: white;
  }
`;

const Label = styled.div`
  transition: all ease 0.3s;
  color: ${({ isActive }) => (isActive ? '#fff' : '#3d3c3b')};
  white-space: nowrap;

  :hover {
    color: ${({ isActive }) => (isActive ? '#fff' : '#010700')};
  }
`;

const AnimatedMenuItem = styled(MenuItem)`
  animation: ${slideIn} 0.5s ease;
`;

const CustomMenu = ({
  index,
  Isvertical,
  Iterable,
  BarName,
  Mstyle = 'simple',
  item,
  activeItem,
  onSelect,
  offSet,
  ...restProps
}) => {
  const ref = useRef(null);

  const handleClick = () => {
    onClick();
    onSelect(index, { ref });
  };

  return (
    <Link
      key={item.id}
      to={item.link}
      id={`${BarName} ${item.id}`}
      style={{ textDecoration: 'none' }}
      spy={true}
      // duration={500}
      offset={offSet ? offSet : -90}
      onSetActive={() => onSelect(index, item.id)}
      {...restProps}
    >
      {Mstyle == 'round' ? (
        <RoundMenuItem
          {...restProps}
          Isvertical={Isvertical}
          isActive={activeItem === item.id}
          onClick={() => onSelect(index, item.id)}
        >
          {item[Iterable]}
        </RoundMenuItem>
      ) : (
        <MenuItem
          isActive={activeItem === item.id}
          onClick={() => onSelect(index, item.id)}
        >
          <Label isActive={activeItem === item.id}> {item[Iterable]}</Label>
        </MenuItem>
      )}
    </Link>
  );
};

export default CustomMenu;
