import React from 'react'

const svgIcons = {
    'close':<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.99999 3.70746L8.29082 0.416626L9.58332 1.70913L6.29249 4.99996L9.58332 8.29079L8.29082 9.58329L4.99999 6.29246L1.70916 9.58329L0.416656 8.29079L3.70749 4.99996L0.416656 1.70913L1.70916 0.416626L4.99999 3.70746Z" fill="black"/>
</svg>
}


function FilterChips(props) {
    const handleRemove = (type, value) => {

        let isBudgetClear = false;
        if (type === "budget") {
            props.setFilters((prev) => ({
                ...prev,
                budget: props.defaultBudget,
                applyFilter: !props.filters.applyFilter,
            }));
            isBudgetClear = true;
        }

        if (type === "star_category") {
            const updated = props?.filters.star_category.filter(item => item !== value)
            props._updateStarFilterHandler(updated)
        }

        if (type === "user_ratings") {
            const updated = props?.filters?.user_ratings.filter(item => item !== value)
            props.updateUserStarHandler(updated)
        }

        if (type === "type") {
            const updated = props?.filters?.type.filter(item => item !== value)
            props._addFilterHandler(updated, "type")
        }

        if (type === "facilities") {
            const updated = props?.filters.facilities.filter(item => item !== value)
            props._addFilterHandler(updated, "facilities")
        }

        const allCleared =
            (isBudgetClear || (props.filters.budget.price_lower_range === props.defaultBudget.price_lower_range &&
                props.filters.budget.price_upper_range === props.defaultBudget.price_upper_range)) &&
            props.filters.star_category.length === 0 &&
            props.filters.user_ratings.length === 0 &&
            (props.filters.type.length === 0 || (props.filters.type.length === 1 && props.filters.type[0] === "All")) &&
            props.filters.facilities.length === 0

        if (allCleared) {
            props?.setIsFilterChangesApplied(false);
        }
    }


    return (
        <div>
            <div className='flex flex-row gap-xs flex-wrap'>

                {/* Price */}
                {(props?.filters?.budget?.price_lower_range != props.defaultBudget?.price_lower_range || props?.filters?.budget?.price_upper_range != props.defaultBudget?.price_upper_range) &&
                    <div className='border-sm rounded-5xl border-text-disabled px-md py-xs whitespace-nowrap flex items-center'>
                        <span className='text-sm-md font-400 leading-xl'>{props?.filters?.budget.price_lower_range} - {props?.filters?.budget?.price_upper_range}</span>
                        <button className='ml-xs' onClick={() => handleRemove("budget")}>{svgIcons.close}</button>
                    </div>
                }

                {/* star category */}
                {props?.filters?.star_category?.length > 0 && props?.filters?.star_category.map((item, index) => (
                    <div className='border-sm rounded-5xl border-text-disabled px-md py-xs whitespace-nowrap flex items-center' key={index}>
                        <span className='text-sm-md font-400 leading-xl'>{item} Star </span>
                        <button className='ml-xs' onClick={() => handleRemove("star_category", item)}>{svgIcons.close}</button>
                    </div>
                ))}


                {/* user rating */}
                {props?.filters?.user_ratings?.length > 0 && props?.filters?.user_ratings.map((item, index) => (
                    <div className='border-sm rounded-5xl border-text-disabled px-md py-xs whitespace-nowrap flex items-center' key={index}>
                        <span className='text-sm-md font-400 leading-xl'>{props?.FILTERS?.user_ratings_label[item] || item + ' Rating'}</span>
                        <button className='ml-xs' onClick={() => handleRemove("user_ratings", item)}>{svgIcons.close}</button>
                    </div>
                ))}


                {/* type */}
                {props?.filters?.type?.length > 0 && props?.filters?.type.map((item, index) => (<>
                    {item != 'All' &&
                        <div className='border-sm rounded-5xl border-text-disabled px-md py-xs whitespace-nowrap flex items-center' key={index}>
                            <span className='text-sm-md font-400 leading-xl'>{item}</span>
                            <button className='ml-xs' onClick={() => handleRemove("type", item)}>{svgIcons.close}</button>
                        </div>
                    }
                </>
                ))}

                {/* facilities */}
                {props?.filters?.facilities?.length > 0 && props?.filters?.facilities.map((item, index) => (
                    <div className='border-sm rounded-5xl border-text-disabled px-md py-xs whitespace-nowrap flex items-center' key={index}>
                        <span className='text-sm-md font-400 leading-xl'>{item}</span>
                        <button className='ml-xs' onClick={() => handleRemove("facilities", item)}>{svgIcons.close}</button>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default FilterChips