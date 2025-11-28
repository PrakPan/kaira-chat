import { IoMdStar } from "react-icons/io";

export default function StarCategory(props) {
    const handleStarCategory = (star) => {
        // If the same star is clicked again, unselect it
        if (props?.selectedStarCategory === star) {
            props.setSelectedStarCategory(null);
        } else {
            // Otherwise, select only this star (single selection)
            props.setSelectedStarCategory(star);
        }
    }

    const isSelectedStarCategory = (star) => {
        return props?.selectedStarCategory === star;
    }

    return (
        <div className="flex flex-col justify-start items-baseline">
            <div className="mb-md text-md font-500 leading-xl">Star category</div>

            <div className="flex flex-row flex-wrap gap-md">
                {props.starCategory.map((star, index) => (
                    <div key={index} className="relative w-[44%]">
                        <label className="flex items-center gap-2 cursor-pointer ttw-custom-yellochekbox-label">
                            <input
                                type="checkbox"
                                checked={isSelectedStarCategory(star)}
                                onChange={() => handleStarCategory(star)}
                                className="w-4 h-4 accent-primary-yellow cursor-pointer ttw-custom-yellochekbox"
                            />
                            <span className="font-md font-400 text-black">{star} Star</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}