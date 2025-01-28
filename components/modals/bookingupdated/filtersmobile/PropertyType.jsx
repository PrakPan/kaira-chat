export default function PropertyType(props) {
    const handleTypes = (type) => {
        if (props.selectedTypes.includes(type)) {
            if (type !== 'All') {
                props.setSelectedTypes(prev => prev.filter(item => item !== type));
            }
        } else {
            if (type === 'All') {
                props.setSelectedTypes(["All"]);
            } else {
                props.setSelectedTypes(prev => [...prev.filter(item => item !== "All"), type])
            }
        }
    }

    const isSelectedType = (type) => {
        return props.selectedTypes.includes(type);
    }

    return (
        <div className="flex flex-col justify-start items-baseline">
            <div className="mb-2 font-semibold">Property type</div>

            <div className="flex flex-row items-center gap-2 flex-wrap">
                <div
                    onClick={() => handleTypes("All")}
                    style={{ background: isSelectedType("All") ? "black" : "", color: isSelectedType("All") ? "white" : "" }}
                    className="border-2 border-black p-2 rounded-lg cursor-pointer">All</div>

                {props.types.map((type, index) => (
                    <div
                        key={index}
                        onClick={() => handleTypes(type)}
                        style={{ background: isSelectedType(type) ? "black" : "", color: isSelectedType(type) ? "white" : "" }}
                        className="border-2 border-black p-2 rounded-lg cursor-pointer">{type}</div>
                ))}
            </div>
        </div>
    )
}
