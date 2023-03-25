import React from "react";
import { Link, ScrollLink } from "react-scroll";
import styled, { keyframes } from "styled-components";
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
  padding: 8px 24px 8px 24px;
  margin-left: 4px;
  background-color: ${({ isActive }) => (isActive ? "#262626" : "none")};
  color: ${({ isActive }) => (isActive ? "#F7E700" : "#7A7A7A")};
  border-radius: ${({ isActive }) =>
    isActive ? "20% 20% 0 0" : "20% 20% 0 0"};
  transition: border-color 0.3s ease;

  border-bottom: ${({ isActive }) => (isActive ? "4px solid #F7E700" : "none")};
  &:hover {
    background-color: ${({ isActive }) => (isActive ? "#262626" : "#262626c7")};
    color: white;
  }
`;
const RoundMenuItem = styled.div`
  padding: 10px;
  cursor: pointer;
  width: max-content;

  margin-left: 7px;
  background-color: ${({ isActive }) => (isActive ? "#01202B" : "none")};
  color: ${({ isActive }) => (isActive ? "#fff" : "#111")};
  border-radius: 8px;
    padding: 0.5rem;
  transition: border-color 0.3s ease;
  border: ${({ isActive }) => (!isActive ? "1.5px solid #ECEAEA" : "none")};
  /* border-bottom: ${({ isActive }) => (isActive ? "4px solid #F7E700" : "none")}; */
  &:hover {
    background-color: ${({ isActive }) => (isActive ? "#262626" : "#262626c7")};
    color: white;
  }
`;
const AnimatedMenuItem = styled(MenuItem)`
  animation: ${slideIn} 0.5s ease;
`;
const CustomMenu = ({ Mstyle = "simple", items, activeItem, onSelect }) => (
  <>
    {items.map((item) => (
      <Link
        key={item.id}
        to={item.link}
        style={{ textDecoration: "none" }}
        spy={true}
        smooth={true}
        duration={500}
        offset={-110}
        onSetActive={() => onSelect(item.id)}
      >
        {Mstyle == "round" ? (
          <RoundMenuItem
            isActive={activeItem === item.id}
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </RoundMenuItem>
        ) : (
          <MenuItem
            isActive={activeItem === item.id}
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </MenuItem>
        )}
      </Link>
    ))}
  </>
);

export default CustomMenu;
