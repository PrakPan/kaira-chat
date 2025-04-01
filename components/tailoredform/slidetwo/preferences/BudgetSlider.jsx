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

        props.setPriceRange({
            min_price: value[0],
            max_price: value[1]
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
    }

    const handleValueFocusChange = () => {
        if (!isNaN(parseInt(minPrice)) && !isNaN(parseInt(maxPrice))) {
            const min_price = parseInt(minPrice);
            const max_price = parseInt(maxPrice);

            handleValueChange([min_price, max_price])
        } else {
            handleValueChange([0, 3000])
        }
    }

    return (
        <div className="flex flex-col gap-3 justify-start items-baseline">
            <Question >Your Stay Budget <span className="text-sm font-normal"> &nbsp;(per night)</span> &nbsp;?  </Question>

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
