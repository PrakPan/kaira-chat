import { IoIosStar } from "react-icons/io";
import TRAVELERS from "./NewCaseStudies/ReviewsData";
import Image from "next/image";

export default function OurCustomers(params) {
    return (
        <div className="flex flex-col gap-5 px-3">
            <div className="flex flex-col gap-3 items-center">
                <div className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]">What Our Customers Say About Us.</div>
                <div className="text-[16px] font-[400] leading-[24px]">
                    Hear from our travelers! Discover how we've made their journeys unforgettable through personalized experiences and seamless service.
                </div>
            </div>

            <div className="h-[250px] md:h-[500px] bg-red-200 rounded-lg flex items-center justify-center">
                Video
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {TRAVELERS.map((traveler, index) => (
                    index < 3 && <Review text={traveler.review} name={traveler.name} image={traveler.image} />
                ))}
            </div>
        </div>
    )
}


const Review = ({ text, name, image }) => {
    return (
        <div className="flex flex-col gap-[100px] bg-white drop-shadow-2xl p-4 rounded-lg">
            <div className="text-[16px] font-[400] leading-[26px] text-[#323232]">
                {text}
            </div>

            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-1 w-[75%]">
                    <div className={`font-buffalo text-[#FB5F66] text-[40px] font-[400] leading-[56px] w-[90%] truncate`}>
                       {name}
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                        <IoIosStar className="text-lg text-[#FEB739]" />
                        <IoIosStar className="text-lg text-[#FEB739]" />
                        <IoIosStar className="text-lg text-[#FEB739]" />
                        <IoIosStar className="text-lg text-[#FEB739]" />
                        <IoIosStar className="text-lg text-[#FEB739]" />
                    </div>
                </div>
                <div className="">
                    <Image className="rounded-full" src={`https://d31aoa0ehgvjdi.cloudfront.net/${image}`} alt="" width={64} height={64}/>
                </div>
            </div>
        </div>
    )
}
