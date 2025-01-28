export default function Category(props) {
    const handleCategory = (category) => {
        if (props.selectedCategories.includes(category)) {
            if (category !== 'All') {
                props.setSelectedCategories(prev => prev.filter(item => item !== category));
            }
        } else {
            if (category === 'All') {
                props.setSelectedCategories(["All"]);
            } else {
                props.setSelectedCategories(prev => [...prev.filter(item => item !== "All"), category])
            }
        }
    }

    const isSelectedCategory = (category) => {
        return props.selectedCategories.includes(category);
    }

    return (
        <div className="flex flex-col justify-start items-baseline">
            <div className="mb-2 font-semibold">Category</div>

            <div className="flex flex-row items-center gap-2 flex-wrap">
                <div
                    onClick={() => handleCategory("All")}
                    style={{ background: isSelectedCategory("All") ? "black" : "", color: isSelectedCategory("All") ? "white" : "" }}
                    className="border-2 border-black p-2 rounded-lg cursor-pointer">All</div>

                {props.categories.map((category, index) => (
                    <div
                        key={index}
                        onClick={() => handleCategory(category)}
                        style={{ background: isSelectedCategory(category) ? "black" : "", color: isSelectedCategory(category) ? "white" : "" }}
                        className="border-2 border-black p-2 rounded-lg cursor-pointer">{category}</div>
                ))}
            </div>
        </div>
    )
}
