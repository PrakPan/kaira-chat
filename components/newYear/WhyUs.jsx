import Image from "next/image"
import { WHY_CHOOSE_US } from "../../public/content/newyear"

export default function WhyUs(props) {
    return (
        <div className="flex flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-3">
                <div className="text-[30px] md:text-[40px] font-bold">Why Choose Us?</div>
                <div className="text-[16]">Choose us for unforgettable experiences, expert guidance, and a commitment to making your journey memorable.</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {WHY_CHOOSE_US.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col gap-4 py-4 px-3 border-2 rounded-lg hover:bg-[#FFFDEB] hover:border-[#F7E700] transition-all"
                    >
                        <Image src={`https://d31aoa0ehgvjdi.cloudfront.net/${item.icon}`}
                            width={45}
                            height={45}
                        />

                        <div className="flex flex-col gap-2">
                            <div className="text-[16px] font-bold">{item.heading}</div>
                            <div className="text-[15px]">{item.tagline}</div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}
