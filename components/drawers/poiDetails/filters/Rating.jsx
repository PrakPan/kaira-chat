import { IoMdStar } from "react-icons/io";


export default function Rating(props) {
    const handleRating = (star) => {
        if (props.selectedRating.includes(star)) {
            props.setSelectedRating(prev => prev.filter(item => item !== star));
        } else {
            props.setSelectedRating(prev => [...prev, star])
        }
    }

    const isSelectedRating = (star) => {
        return props.selectedRating.includes(star);
    }

    return (
        <div className="flex flex-col justify-start items-baseline">
            <div className="mb-2 font-normal">Rating</div>
            <div className="flex flex-row gap-1">
                {props.ratings.map((star, i) => (
                    <button
                        onClick={() => handleRating(star)}
                        className={`flex font-normal  text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${isSelectedRating(star)
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
