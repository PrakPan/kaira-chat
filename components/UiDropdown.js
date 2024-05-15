import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  width: inherit;
  min-width: 6rem;
  display: inline-block;
`;

const DropdownHeader = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 6px 2px 6px;
  background-color: #fff;
  border: 2px solid #d0d5dd;
  border-radius: 8px;
  cursor: pointer;
  z-index: 999;
  gap: 0.3rem;
  user-select: none;
`;

const DropdownOptions = styled(motion.ul)`
  position: absolute;
  top: calc(100% + 5px);
  height: ${({ scrollable }) => (scrollable ? "10rem" : "auto")};
  overflow-y: ${({ scrollable }) => (scrollable ? "auto" : "hidden")};
  left: 0;
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 0;
  margin: 0;
  z-index: 999;
  list-style: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const DropdownOption = styled(motion.li)`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const UiDropdown = ({
  hideSelector = false,
  options,
  onSelect,
  DropdownOpen = false,
  scrollable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);

    onSelect(option);
  };

  return (
    <DropdownContainer>
      {!hideSelector && (
        <DropdownHeader onClick={handleToggle}>
          <span>{selectedOption || "Select an option"}</span>
          {isOpen ? (
            <FaChevronUp className="font-thin text-sm" />
          ) : (
            <FaChevronDown className="font-thin text-sm" />
          )}
        </DropdownHeader>
      )}

      <AnimatePresence>
        {DropdownOpen || isOpen ? (
          <DropdownOptions
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            scrollable={scrollable}
          >
            {options.map((option) => (
              <DropdownOption
                key={option}
                onClick={() => handleSelect(option)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option}
              </DropdownOption>
            ))}
          </DropdownOptions>
        ) : null}
      </AnimatePresence>
    </DropdownContainer>
  );
};

export default UiDropdown;
