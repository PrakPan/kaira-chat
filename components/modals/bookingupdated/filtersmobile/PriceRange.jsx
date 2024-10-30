import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoMdStar } from "react-icons/io";
import media from "../../../media";
import UiDropdown from "../../../UiDropdown";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import CheckboxFormComponent from "../../../FormComponents/CheckboxFormComponent";
import RangeSliderInput from "./RangeSlider";
import { IoPerson } from "react-icons/io5";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { getIndianPrice } from "../../../../services/getIndianPrice";

export default function PriceRange(props) {
    const [budget, setBudget] = useState([props.filtersState.budget.price_lower_range, props.filtersState.budget.price_upper_range])
    const [minPrice, setMinPrice] = useState(props.filtersState.budget.price_lower_range)
    const [maxPrice, setMaxPrice] = useState(props.filtersState.budget.price_upper_range)

    useEffect(() => {
        let handler;
        if (props.filtersState.budget.price_lower_range !== budget[0] || props.filtersState.budget.price_upper_range !== budget[1]) {
            handler = setTimeout(() => {
                props.setFiltersState(prev => ({
                    ...prev,
                    budget: {
                        price_lower_range: budget[0],
                        price_upper_range: budget[1]
                    }
                }))
            }, 2000);
        }

        return () => {
            clearTimeout(handler);
        };
    }, [budget])

    const handleBudgetChange = (value) => {
        setBudget(value);
        setMinPrice(value[0]);
        setMaxPrice(value[1]);
    }

    const handleBudgetFocusChange = () => {
        if (!isNaN(parseInt(minPrice)) && !isNaN(parseInt(maxPrice))) {
            const min_price = parseInt(minPrice) < 700 ? 700 : parseInt(minPrice);
            const max_price = parseInt(maxPrice) > 10000 ? 10000 : parseInt(maxPrice);

            setBudget([min_price, max_price])
            setMinPrice(min_price);
            setMaxPrice(max_price);
        } else {
            setMinPrice(budget[0]);
            setMaxPrice(budget[1]);
        }
    }

    return (
        <div className="md:w-[30%] flex flex-col justify-start items-baseline">
            <div className="font-normal">Price range</div>
            <div className="text-sm mb-3">per night</div>

            <div className="w-full flex flex-col gap-4">
                <RangeSliderInput
                    defaultValue={budget}
                    value={budget}
                    onChange={handleBudgetChange}
                />

                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col items-center gap-1">
                        <label className="text-sm">Minimum</label>
                        <div className="flex flex-row items-center border-2 px-4 py-2 rounded-full">
                            <div>₹</div>
                            <input
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                onBlur={handleBudgetFocusChange}
                                className="text-sm font-normal focus:outline-none min-w-6 max-w-[45px] w-fit"></input>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <label className="text-sm">Maximum</label>
                        <div className="flex flex-row items-center border-2 px-4 py-2 rounded-full">
                            <div>₹</div>
                            <input
                                value={parseInt(maxPrice) === 10000 ? `${maxPrice}+` : maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                onBlur={handleBudgetFocusChange}
                                className="text-sm font-normal focus:outline-none min-w-6 max-w-[50px] w-fit">
                            </input>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
