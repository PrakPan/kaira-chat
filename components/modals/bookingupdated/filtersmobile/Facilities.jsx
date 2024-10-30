export default function Facilities(props) {

    const handleFacilities = (facility) => {
        if (props.selectedFacilities.includes(facility)) {
            props.setSelectedFacilities(prev => prev.filter(item => item !== facility));
        } else {
            props.setSelectedFacilities(prev => [...prev, facility])
        }
    }

    const isSelectedFacility = (facility) => {
        return props.selectedFacilities.includes(facility);
    }

    return (
        <div className="flex flex-col justify-start items-baseline">
            <div className="mb-2 font-semibold">Facilities</div>

            <div className="flex flex-row items-center gap-2 flex-wrap">
                {props.facilities.map((facility, index) => (
                    <div
                        key={index}
                        onClick={() => handleFacilities(facility)}
                        style={{ background: isSelectedFacility(facility) ? "black" : "", color: isSelectedFacility(facility) ? "white" : "" }}
                        className="border-2 border-black p-2 rounded-lg cursor-pointer">{facility}</div>
                ))}
            </div>
        </div>
    )
}
