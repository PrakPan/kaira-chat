import React, { useState } from "react";
import CheckboxFormComponent from "../../../FormComponents/CheckboxFormComponent";

export default function PriceRange(props) {
    const [selectedPriceRange, setSelectedPriceRange] = useState('all');

    const priceRanges = [
        { id: 'all', label: 'All' },
        { id: 'under3k', label: 'Under ₹3K' },
        { id: 'under6k', label: 'Under ₹6K' },
        { id: 'under10k', label: 'Under ₹10K' },
        { id: '10kplus', label: '₹10K+' }
    ];

    const handlePriceRangeSelect = (rangeId) => {
        setSelectedPriceRange(rangeId);
        
        const rangeMap = {
            'all': { lower: null, upper: null }, 
            'under3k': { lower: 0, upper: 3000 },
            'under6k': { lower: 0, upper: 6000 },
            'under10k': { lower: 0, upper: 10000 },
            '10kplus': { lower: 10000, upper: 50000 }
        };

        const selectedRange = rangeMap[rangeId];
        
        
        // props.setBudget([selectedRange.lower, selectedRange.upper]);
        
       
        props.setFilters((prevFilters) => ({
            ...prevFilters,
            budget: {
                price_lower_range: selectedRange.lower,
                price_upper_range: selectedRange.upper
            },
            applyFilter: !prevFilters.applyFilter 
        }));

     
        // if (props.handleBudgetChange) {
        //     props.handleBudgetChange();
        // }
    };

    return (
        <div className="flex flex-col gap-3 justify-start items-baseline w-full">
            <div className="font-medium text-gray-800 text-base">
                Price range 
                <span className="text-sm text-gray-500 font-normal ml-1">(per night)</span>
            </div>

            <div className="w-full flex flex-wrap gap-x-4 gap-y-2">
                {priceRanges.map((range) => (
                    <button
                        key={range.id}
                        onClick={() => handlePriceRangeSelect(range.id)}
                        className="flex items-center gap-2 text-left hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors duration-200"
                    >
                        <CheckboxFormComponent checked={selectedPriceRange === range.id} />
                        <span className="text-sm font-medium text-gray-700 select-none whitespace-nowrap">
                            {range.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}