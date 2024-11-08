import React, { useState } from "react";
import RangeSliderInput from "../../../modals/bookingupdated/filtersmobile/RangeSlider";
import Question from "../../Question";

export default function BudgetSlider(props) {
    const [value, setValue] = useState([0, 3000])
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(3000)

    const handleValueChange = (value) => {
        setValue(value);
        setMinPrice(value[0]);
        setMaxPrice(value[1]);

        if (value[1] < 3000) {
            props.setBudget("Affordable");
        } else if (value[1] >= 3000 && value[1] < 6000) {
            props.setBudget("Average");
        } else if (value[1] >= 6000 && value[1] < 10000) {
            props.setBudget("Luxury");
        } else if (value[1] >= 10000) {
            props.setBudget("Luxury +");
        }
    }

    const handleValueFocusChange = () => {
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
        <div className="flex flex-col gap-3 justify-start items-baseline">
            <Question >Price range <span className="text-sm">(per person)</span></Question>

            <div className="w-full flex flex-col gap-4">
                <RangeSliderInput
                    defaultValue={[0, 3000]}
                    value={value}
                    onChange={handleValueChange}
                />

                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col items-center gap-1">
                        <label className="text-sm">Minimum</label>
                        <div className="flex flex-row items-center border-2 px-4 py-2 rounded-full">
                            <div>₹</div>
                            <input
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                onBlur={handleValueFocusChange}
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
                                onBlur={handleValueFocusChange}
                                className="text-sm font-normal focus:outline-none min-w-6 max-w-[50px] w-fit">
                            </input>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
