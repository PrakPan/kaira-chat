import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  background-color: #ffffff;

  color: #333333;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
`;

const DropdownContent = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0%;
  width: 200px;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 8px;
  z-index: 1;
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: translateY(${({ open }) => (open ? "0" : "10px")});
  transition: opacity 0.3s ease, transform 0.3s ease;

  > :not(:last-child) {
    border-bottom: 1px solid #cccccc;
  }
  > div:hover {
    background-color: #000;
    color: #ffffff;
  }
  > * {
    text-align: center;
  }
`;

const Dropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  function _handleChange(e) {
    e.stopPropagation();
    props.onclick1();
    props.onclick({
      alternates: props.alternates,
      new_booking: props.new_booking,
      itinerary_id: props.itinerary_id,
      tailored_id: props.tailored_id,
      number_of_rooms: parseInt(e.target.innerHTML),
    });
  }
  return (
    <DropdownContainer>
      <DropdownContent open={isOpen}>
        <div>How many rooms?</div>
        <div onClick={(e) => _handleChange(e)}>1</div>
        <div onClick={(e) => _handleChange(e)}>2</div>
        <div onClick={(e) => _handleChange(e)}>3</div>
        <div onClick={(e) => _handleChange(e)}>4</div>
        <div onClick={(e) => _handleChange(e)} style={{ border: "none" }}>
          5
        </div>
      </DropdownContent>
      <DropdownButton onClick={toggleDropdown}>{props.children}</DropdownButton>
    </DropdownContainer>
  );
};

export default Dropdown;
