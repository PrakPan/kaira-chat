import React, { useState } from "react";
import RangeSliderInput from "./RangeSlider";
import { getIndianPrice } from "../../../../services/getIndianPrice";

export default function PriceRange(props) {
    const [minPrice, setMinPrice] = useState(props.budget[0])
    const [maxPrice, setMaxPrice] = useState(props.budget[1])

    const handleBudgetChange = (value) => {
        props.setBudget(value);
        setMinPrice(value[0]);
        setMaxPrice(value[1]);
    }

    const handleBudgetFocusChange = () => {
        if (!isNaN(parseInt(minPrice)) && !isNaN(parseInt(maxPrice))) {
            const min_price = parseInt(minPrice) < 700 ? 700 : parseInt(minPrice);
            const max_price = parseInt(maxPrice) > 10000 ? 10000 : parseInt(maxPrice);

            props.setBudget([min_price, max_price])
            setMinPrice(min_price);
            setMaxPrice(max_price);
        } else {
            setMinPrice(props.budget[0]);
            setMaxPrice(props.budget[1]);
        }
    }

    return (
        <div className="md:w-[30%] flex flex-col justify-start items-baseline">
            <div className="font-normal">Price range</div>
            <div className="text-sm mb-3">per night</div>

            <div className="w-full flex flex-col gap-4">
                <RangeSliderInput
                    defaultValue={props.budget}
                    value={props.budget}
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
