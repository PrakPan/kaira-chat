import React  from 'react';
import { Link, ScrollLink } from 'react-scroll';
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
  padding: 8px 24px 8px 24px;
  background-color: ${({ isActive }) => isActive ? '#262626' : 'none'};
  color: ${({ isActive }) => isActive ? '#F7E700' : '#7A7A7A'};
  border-radius: ${({ isActive }) => isActive ? '20% 20% 0 0' : 'none'};
  transition: border-color 0.3s ease;
  border-bottom: ${({ isActive }) => isActive ? '4px solid #F7E700' : 'none'};
  &:hover {
    background-color: ${({ isActive }) => isActive ? '#262626' : 'gray'};
    color: white;
  }
`;
const AnimatedMenuItem = styled(MenuItem)`
  animation: ${slideIn} 0.5s ease;
`;
const CustomMenu = ({ items, activeItem, onSelect }) => (
  <>
    {items.map(item => (
        <Link
        key={item.id}
        to={item.link}
        style={{textDecoration: 'none'}}
        spy={true}
        smooth={true}
        duration={500}
        offset={70}
        onSetActive={() => onSelect(item.id)}
      >
        <MenuItem
          isActive={activeItem === item.id}
          onClick={() => onSelect(item.id)}
        >
          {item.label}
        </MenuItem>
      </Link>
      
    ))}
  </>
);



export default CustomMenu;
