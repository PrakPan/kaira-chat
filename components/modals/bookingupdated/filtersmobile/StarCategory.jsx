import { IoMdStar } from "react-icons/io";


export default function StarCategory(props) {
    const handleStarCategory = (star) => {
        if (props?.selectedStarCategory?.includes(star)) {
            props.setSelectedStarCategory(prev => prev.filter(item => item !== star));
        } else {
            props.setSelectedStarCategory(star);
        }
    }

    const isSelectedStarCategory = (star) => {
        return props?.selectedStarCategory?.includes(star);
    }

    return (
        <div className="flex flex-col justify-start items-baseline">
            <div className="mb-md text-md font-500 leading-xl">Star category</div>

            <div className="flex flex-row flex-wrap  gap-md">
                {props.starCategory.map((star, index) => (
                    <div className="relative w-[44%]">
                        <label
                            key={index}
                            className="flex items-center gap-2 cursor-pointer ttw-custom-yellochekbox-label" >
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
