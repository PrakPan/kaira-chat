import React, { useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Button from "../../ui/button/Index";
import styled from "styled-components";

const PassengerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
`;

const PassengerLabel = styled.div`
  .subtitle {
    font-size: 10px;
    color: #6e757a;
  }
`;

const CounterBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border: 2px solid #e4e4e4;
  border-radius: 9999px;
  padding: 5px 10px;
`;

const CounterButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  color: #0000ee;
  font-size: 14px;
  font-weight: bold;
  padding: 0;
  min-width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const CounterValue = styled.div`
  font-size: 12px;
  min-width: 20px;
  text-align: center;
`;

const AgeInput = styled.input`
  width: 40px;
  text-align: center;
  font-size: 12px;
  border: none;
  outline: none;
  background: transparent;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const Pax = ({ pax, setPax }) => {
  const ref = useRef(null);

  const [showPax, setShowPax] = useState(false);
  const [adults, setAdults] = useState(pax.adults || 1);
  const [children, setChildren] = useState(pax.children || 0);
  const [childAges, setChildAges] = useState(pax.childAges || []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowPax(false);
      }
    };

    if (showPax) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPax]);

  const handleAdults = (increment) => {
    if (increment && adults < 14) {
      setAdults((prev) => prev + 1);
    } else if (!increment && adults > 1) {
      setAdults((prev) => prev - 1);
    }
  };

  const handleChildren = (type) => {
    if (type === "plus" && children < 13) {
      setChildren((prev) => prev + 1);
      setChildAges((prev) => [...prev, 10]);
    } else if (type === "minus" && children >= 1) {
      setChildren((prev) => prev - 1);
      setChildAges((prev) => prev.slice(0, -1));
    }
  };

  const handleChildAgeChange = (index, value) => {
    const age = value ? parseInt(value, 10) : 0;
    setChildAges((prev) => prev.map((a, i) => (i === index ? age : a)));
  };

  const handleDone = () => {
    setPax({ adults, children, childAges });
    setShowPax(false);
  };

  return (
    <div className="relative w-fit h-fit flex flex-row items-center gap-2 rounded-lg cursor-pointer z-[10]">
      <div
        onClick={() => setShowPax((prev) => !prev)}
        className="flex items-center bg-[#F5F5F5] px-[16px] py-[8px] rounded-[4px]"
      >
        <div className="text-[10px] md:text-[14px] font-medium">Travellers Details</div>
        <div className="text-[10px] md:text-[14px] font-medium">&nbsp;|&nbsp;</div>
        <div className="flex items-center gap-1">
          <div className="text-[10px] font-medium">
            {adults} Adults and {children} Children
          </div>
          <IoIosArrowDown />
        </div>
      </div>

      {showPax && (
        <div
          ref={ref}
          className="absolute top-full left-2 right-2 md:right-5 md:left-auto bg-white shadow-2xl drop-shadow-3xl p-3 rounded-lg space-y-5 text-sm w-[280px] max-h-[500px] overflow-y-auto"
        >
          {/* Adults */}
          <PassengerRow>
            <PassengerLabel>
              <div className="text-[14px] font-medium">Adults</div>
              <div className="subtitle">Ages 13 or above</div>
            </PassengerLabel>
            <CounterBox>
              <CounterButton onClick={() => handleAdults(false)} disabled={adults <= 1}>
                −
              </CounterButton>
              <CounterValue>{adults}</CounterValue>
              <CounterButton onClick={() => handleAdults(true)} disabled={adults >= 14}>
                +
              </CounterButton>
            </CounterBox>
          </PassengerRow>

          {/* Children */}
          <PassengerRow style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              <PassengerLabel>
                <div className="text-[14px] font-medium">Children</div>
                <div className="subtitle">Ages 2 to 12</div>
              </PassengerLabel>
              <CounterBox>
                <CounterButton onClick={() => handleChildren("minus")} disabled={children <= 0}>
                  −
                </CounterButton>
                <CounterValue>{children}</CounterValue>
                <CounterButton onClick={() => handleChildren("plus")} disabled={children > 12}>
                  +
                </CounterButton>
              </CounterBox>
            </div>
          </PassengerRow>

          {/* Child Ages */}
          {children > 0 && (
            <div className="w-full" style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="text-[12px] text-[#6E757A]">Enter the age of each child below</div>
              {childAges.map((age, index) => (
                <ChildAge
                  key={index}
                  index={index}
                  age={age}
                  setChildAges={setChildAges}
                  handleChildAgeChange={handleChildAgeChange}
                />
              ))}
            </div>
          )}

          {/* Apply Button */}
          <div className="mt-4 flex justify-end">
            <Button
              fontSize="1rem"
              width={"auto"}
              padding="0.5rem 2rem"
              fontWeight="500"
              margin="0"
              borderRadius="5px"
              borderWidth="1px"
              bgColor="#f7e700"
              onclick={handleDone}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const ChildAge = ({ index, age, handleChildAgeChange }) => {
  const handleChange = (e) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : 0;
    handleChildAgeChange(index, value);
  };

  return (
    <PassengerRow className="text-[12px]" style={{ flexDirection: "column", alignItems: "flex-start" }}>
      <div className="flex justify-between items-center w-full">
        <div className="text-[14px] font-medium">Age of Child {index + 1}</div>

        <div className="flex items-center gap-2">
          <CounterButton 
            onClick={() => handleChange({ target: { value: age - 1 } })} 
            disabled={age <= 2}
          >
            −
          </CounterButton>
          <AgeInput
            type="number"
            min="0"
            max="12"
            value={age}
            onChange={handleChange}
            disabled
          />
          <span className="text-sm text-gray-500">years</span>
          <CounterButton 
            onClick={() => handleChange({ target: { value: age + 1 } })} 
            disabled={age >= 12}
          >
            +
          </CounterButton>
        </div>
      </div>
    </PassengerRow>
  );
};