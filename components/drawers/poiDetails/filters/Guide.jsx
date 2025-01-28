export default function Guide(props) {
    const handleCategory = (category) => {
        if (props.selectedGuide.includes(category)) {
            if (category !== 'All') {
                props.setSelectedGuide(prev => prev.filter(item => item !== category));
            }
        } else {
            if (category === 'All') {
                props.setSelectedGuide(["All"]);
            } else {
                props.setSelectedGuide(prev => [...prev.filter(item => item !== "All"), category])
            }
        }
    }

    const isSelectedCategory = (category) => {
        return props.selectedGuide.includes(category);
    }

    return (
        <div className="flex flex-col justify-start items-baseline">
            <div className="mb-2 font-semibold">Guide</div>

            <div className="flex flex-row items-center gap-2 flex-wrap">
                <div
                    onClick={() => handleCategory("All")}
                    style={{ background: isSelectedCategory("All") ? "black" : "", color: isSelectedCategory("All") ? "white" : "" }}
                    className="border-2 border-black p-2 rounded-lg cursor-pointer">All</div>

                {props.guide.map((category, index) => (
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
