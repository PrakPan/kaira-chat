import React, { useEffect, useRef, useState } from "react";
import { BsInfoCircleFill } from "react-icons/bs";

import RangeSliderInput from "../../../modals/bookingupdated/filtersmobile/RangeSlider";
import Question from "../../Question";
import media from "../../../media";
import { currencySymbols } from "../../../../data/currencySymbols";
import { useSelector } from "react-redux";

export default function BudgetSlider(props) {
  let isPageWide = media("(min-width: 768px)");
  const [value, setValue] = useState([
    props?.defaultValue?.min_price ?? 0,
    props?.defaultValue?.max_price ?? 3000,
  ]);
  const [minPrice, setMinPrice] = useState(props?.defaultValue?.min_price ?? 0);
  const [maxPrice, setMaxPrice] = useState(
    props?.defaultValue?.max_price ?? 3000
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const currency = useSelector(state=>state.currency);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleValueChange = (value) => {
    setValue(value);
    setMinPrice(value[0]);
    setMaxPrice(value[1]);

    props.setPriceRange({
      min_price: value[0],
      max_price: value[1],
    });

    if (value[1] < 3000) {
      props.setBudget("Affordable");
    } else if (value[1] >= 3000 && value[1] < 6000) {
      props.setBudget("Average");
    } else if (value[1] >= 6000 && value[1] < 10000) {
      props.setBudget("Luxury");
    } else if (value[1] >= 10000) {
      props.setBudget("Luxury +");
    }
  };

  const handleValueFocusChange = () => {
    if (!isNaN(parseInt(minPrice)) && !isNaN(parseInt(maxPrice))) {
      const min_price = parseInt(minPrice);
      const max_price = parseInt(maxPrice);

      handleValueChange([min_price, max_price]);
    } else {
      handleValueChange([0, 3000]);
    }
  };

  return (
    <div className="flex flex-col gap-3 justify-start items-baseline">
      <Question className="w-full">
        <div className="flex items-center relative w-full">
          Your Stay Budget
          <span className="text-sm font-normal">&nbsp;(per night)</span> &nbsp;
          {props.tailoredForm ? (
            <>
              {isPageWide ? (
                <BsInfoCircleFill
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="text-primary cursor-pointer"
                />
              ) : (
                <BsInfoCircleFill
                  onClick={() => setShowTooltip((prev) => !prev)}
                  className="text-primary cursor-pointer"
                />
              )}

              {showTooltip && (
                <div
                  ref={tooltipRef}
                  className={`z-50 absolute -top-[50px] text-xs font-medium bg-[#FFEFE5] p-2 rounded-md w-full shadow-2xl drop-shadow-xl`}
                >
                  Hotels in {props.destination} typically range from {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}
                  {props.defaultValue.min_price} to {``}
                  {props.defaultValue.max_price} per night
                </div>
              )}
            </>
          ) : (
            "?"
          )}
        </div>
      </Question>

      <div className="w-full flex flex-col gap-4">
        <RangeSliderInput
          defaultValue={[
            props?.defaultValue?.min_price ?? 0,
            props?.defaultValue?.max_price ?? 3000,
          ]}
          value={value}
          onChange={handleValueChange}
        />

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-center gap-1">
            <label className="text-sm">Minimum</label>
            <div className="flex flex-row items-center border-2 px-4 py-2 rounded-full">
              <div>{`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}</div>
              <input
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={handleValueFocusChange}
                className="text-sm font-normal focus:outline-none min-w-6 max-w-[45px] w-fit"
              ></input>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <label className="text-sm">Maximum</label>
            <div className="flex flex-row items-center border-2 px-4 py-2 rounded-full">
              <div>{`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}`}</div>
              <input
                value={parseInt(maxPrice) === 10000 ? `${maxPrice}+` : maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={handleValueFocusChange}
                className="text-sm font-normal focus:outline-none min-w-6 max-w-[50px] w-fit"
              ></input>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
