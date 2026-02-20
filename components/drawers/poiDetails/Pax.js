import React, { useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import ButtonYellow from "../../ButtonYellow";
import Button from "../../ui/button/Index";
import styled from "styled-components";

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

const ChildAge = ({ index, age, handleChildAgeChange }) => {
  const handleChange = (e) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : 0;
    handleChildAgeChange(index, value);
  };

  return (
    <div className="flex justify-between items-center w-full text-[12px]">
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
          min="2"
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
  );
};

export const Pax = ({ pax, setPax, combo, limit = null }) => {
  const refDesktop = useRef(null);
  const refMobile = useRef(null);

  const [showPax, setShowPax] = useState(false);
  const [showPaxMobile, setShowPaxMobile] = useState(false);
  const [adults, setAdults] = useState(pax.adults || 1);
  const [children, setChildren] = useState(pax.children || 0);

  const initChildAges = (count, ages) =>
    Array.from({ length: count }, (_, i) =>
      ages?.[i] !== undefined ? ages[i] : 10,
    );

  const [childAges, setChildAges] = useState(
    initChildAges(pax.children || 0, pax.childAges),
  );
  const [infants, setInfants] = useState(pax.infants || 0);

  useEffect(() => {
    setAdults(pax.adults || 1);
    setChildren(pax.children || 0);
    setChildAges(initChildAges(pax.children || 0, pax.childAges));
    setInfants(pax.infants || 0);
  }, [pax.adults, pax.children, JSON.stringify(pax.childAges), pax.infants]);

  const handleMinus = (type) => {
    if (type === "adult" && adults > 1) setAdults((prev) => prev - 1);
    if (type === "children" && children > 0) {
      setChildren((prev) => prev - 1);
      // Remove the last child's age slot
      setChildAges((prev) => prev.slice(0, -1));
    }
    if (type === "infants" && infants > 0) setInfants((prev) => prev - 1);
  };

  const handlePlus = (type) => {
    if (type === "adult") {
      if (!limit || adults < limit) {
        setAdults((prev) => prev + 1);
      }
    }
    if (type === "children") {
      setChildren((prev) => prev + 1);
      setChildAges((prev) => [...prev, 10]);
    }
    if (type === "infants") setInfants((prev) => prev + 1);
  };

  const handleChildAgeChange = (index, value) => {
    const age = value ? parseInt(value, 10) : 0;
    setChildAges((prev) => prev.map((a, i) => (i === index ? age : a)));
  };

  const handleDone = () => {
    combo
      ? setPax({
          adults,
          children,
          childAges,
          infants,
          number_of_adults: adults,
          number_of_children: children,
          number_of_infants: infants || 0,
        })
      : setPax({
          adults,
          children,
          childAges,
          infants,
          number_of_adults: adults,
          number_of_children: children,
        });
    setShowPax(false);
    setShowPaxMobile(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refDesktop.current && !refDesktop.current.contains(event.target)) {
        setShowPax(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refMobile.current && !refMobile.current.contains(event.target)) {
        setShowPaxMobile(false);
      }
    };
    if (showPaxMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPaxMobile]);

  const DropdownContent = ({ refProp }) => (
    <div
      ref={refProp}
      className="absolute top-full right-0 bg-white shadow-2xl p-3 rounded-lg space-y-5 text-sm z-50 w-[280px] max-h-[500px] overflow-y-auto"
    >
      {/* Adults */}
      <div className="flex justify-between items-center w-full">
        <div>
          <div className="text-[14px] font-medium">Adults</div>
          <div className="text-[10px] text-[#6e757a]">12+ Years</div>
        </div>
        <div className="flex items-center gap-2 border-2 border-[#e4e4e4] rounded-full px-3 py-1">
          <FaMinus
            onClick={() => handleMinus("adult")}
            size={9.33}
            className="cursor-pointer"
            color="#0000EE"
          />
          <span className="text-[12px] min-w-[20px] text-center">{adults}</span>
          <FaPlus
            onClick={() => handlePlus("adult")}
            size={9.33}
            className="cursor-pointer"
            color="#0000EE"
          />
        </div>
      </div>

      {/* Children */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center w-full">
          <div>
            <div className="text-[14px] font-medium">Children</div>
            <div className="text-[10px] text-[#6e757a]">2-12 Years</div>
          </div>
          <div className="flex items-center gap-2 border-2 border-[#e4e4e4] rounded-full px-3 py-1">
            <FaMinus
              onClick={() => handleMinus("children")}
              size={9.33}
              className="cursor-pointer"
              color="#0000EE"
            />
            <span className="text-[12px] min-w-[20px] text-center">
              {children}
            </span>
            <FaPlus
              onClick={() => handlePlus("children")}
              size={9.33}
              className="cursor-pointer"
              color="#0000EE"
            />
          </div>
        </div>

        {/* Child Ages */}
        {children > 0 && (
          <div className="flex flex-col gap-4 w-full">
            {childAges.map((age, index) => (
              <ChildAge
                key={index}
                index={index}
                age={age}
                handleChildAgeChange={handleChildAgeChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Infants */}
      {combo && (
        <div className="flex justify-between items-center w-full">
          <div>
            <div className="text-[14px] font-medium">Infants</div>
            <div className="text-[10px] text-[#6e757a]">{`<2 years`}</div>
          </div>
          <div className="flex items-center gap-2 border-2 border-[#e4e4e4] rounded-full px-3 py-1">
            <FaMinus
              onClick={() => handleMinus("infants")}
              size={9.33}
              className="cursor-pointer"
              color="#0000EE"
            />
            <span className="text-[12px] min-w-[20px] text-center">
              {infants}
            </span>
            <FaPlus
              onClick={() => handlePlus("infants")}
              size={9.33}
              className="cursor-pointer"
              color="#0000EE"
            />
          </div>
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
  );

  return (
    <div className="relative w-fit h-fit flex flex-row items-center gap-2 rounded-lg cursor-pointer z-[10]">
      {/* Desktop Trigger */}
      <div
        onClick={() => setShowPax((prev) => !prev)}
        className="flex items-center w-full bg-[#F9F9F9] py-[0.7rem] px-4 rounded-lg justify-between"
      >
        <div className="text-[10px] md:text-[14px] font-medium">Travellers</div>
        <div className="text-[10px] md:text-[14px] font-medium">
          &nbsp;|&nbsp;
        </div>
        <div className="flex items-center gap-1">
          <div className="text-[10px] font-medium">
            {`${adults + children + infants} Passenger`}
          </div>
          <IoIosArrowDown />
        </div>
      </div>

      {showPax && <DropdownContent refProp={refDesktop} />}
    </div>
  );
};
