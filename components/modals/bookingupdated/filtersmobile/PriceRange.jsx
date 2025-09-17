import React, { useState, useRef, useEffect } from "react";

export default function PriceRange(props) {
    const [minPrice, setMinPrice] = useState(props.budget[0])
    const [maxPrice, setMaxPrice] = useState(props.budget[1])

    const handleBudgetChange = (value) => {
        props.setBudget(value);
        setMinPrice(value[0]);
        setMaxPrice(value[1]);
        props?.handleBudgetChange()
        props.setFilters((prev)=>({
      ...prev,
      budget:{
        price_lower_range:value[0],
        price_upper_range:value[1] === 10000 ? null: value[1]
      },
    }))
    }

    const handleBudgetFocusChange = () => {
        if (!isNaN(parseInt(minPrice)) && !isNaN(parseInt(maxPrice))) {
            const min_price = parseInt(minPrice) < 700 ? 700 : parseInt(minPrice);
            const max_price = parseInt(maxPrice) > 10000 ? 10000 : parseInt(maxPrice);

            props.setBudget([min_price,max_price])
            setMinPrice(min_price);
            setMaxPrice(max_price);
        } else {
            setMinPrice(props.budget[0]);
            setMaxPrice(props.budget[1]);
        }
    }

    return (
        <div className="flex flex-col gap-3 justify-start items-baseline w-full">
            <div className="font-medium text-gray-800 text-base">
                Price range 
                <span className="text-sm text-gray-500 font-normal ml-1">(per night)</span>
            </div>

            <div className="relative w-full" ref={dropdownRef}>
                {/* Custom Dropdown Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 shadow-sm"
                >
                    <span className="block text-sm font-medium text-gray-700 truncate">
                        {selectedOption?.label}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                </button>

                {/* Custom Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {priceRanges.map((range, index) => (
                            <button
                                key={range.id}
                                type="button"
                                onClick={() => handlePriceRangeSelect(range.id)}
                                className={`relative w-full px-3 py-2.5 text-left text-sm transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${
                                    selectedPriceRange === range.id
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span className="block truncate">{range.label}</span>
                                {selectedPriceRange === range.id && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}