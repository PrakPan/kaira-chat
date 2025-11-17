import { IoMdStar } from "react-icons/io";


export default function StarCategory(props) {
   const handleStarCategory = (star) => {
       
        if (props.selectedStarCategory === star) {
            props.setSelectedStarCategory(null);
        } else {
            props.setSelectedStarCategory(star);
        }
    }

    const isSelectedStarCategory = (star) => {
        return props.selectedStarCategory === star;
    }

    return (
        <div className="flex flex-col justify-start items-baseline">
            <div className="mb-2 font-normal">Star category</div>
            <div className="flex flex-row gap-1 mt-[0.65rem]">
                {props.starCategory.map((star, i) => (
                    <button
                        onClick={() => handleStarCategory(star)}
                        className={`flex font-normal  text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${isSelectedStarCategory(star)
                            ? "text-white border-0 bg-black "
                            : "border-2 bg-white text-black"
                            } active:text-white  border-[#D0D5DD]  rounded-lg px-2 py-1`}
                        key={i}
                    >
                        {star}
                        <IoMdStar />
                    </button>
                ))}
            </div>
        </div>
    );
}
