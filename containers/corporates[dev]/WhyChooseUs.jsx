import ImageLoader from "../../components/ImageLoader";
import media from "../../components/media";
import Image from "next/image";

export default function WhyChooseUs() {
    let isPageWide = media("(min-width: 768px)");

    return (
        <div className="bg-[#F9F9F9] flex flex-col gap-5 pl-3 pr-3 pt-3 pb-3 md:p-[50px]">
            <div className="flex flex-col items-center gap-3">
                <div className="text-[27px] md:text-[40px] font-[700]">Why Choose Us</div>
                <div className="text-[16px] font-[350] leading-[26px] text-center text-[#7C7C7C]">
                    Experience personalized journeys, seamless planning, and exceptional support. We go beyond standard travel to offer unique, immersive experiences tailored just for you.
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-row items-center gap-3">
                    <div className="w-[76px] h-[76px] md:w-[96px] md:h-[96px] p-2 bg-[#F8AE4033] flex items-center justify-center rounded-lg">
                        <Image src={"https://d31aoa0ehgvjdi.cloudfront.net/media/corporates/whychooseus-1.png"} width={isPageWide ? 48 : 38} height={isPageWide ? 48 : 38} />
                    </div>
                    <div className="w-fit flex flex-col md:gap-2">
                        <div className="text-[18px] md:text-[22px] font-[700] leading-[32px]">
                            Personalization in seconds
                        </div>
                        <div className="text-[14px] md:text-[16px] font-[400] leading-[24px] text-[#7C7C7C]">
                            Personalized and flexible itineraries crafted by our AI-powered planner.
                        </div>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-3">
                    <div className="w-[76px] h-[76px] md:w-[96px] md:h-[96px] p-2 bg-[#E8584133] flex items-center justify-center rounded-lg">
                        <Image src={"https://d31aoa0ehgvjdi.cloudfront.net/media/corporates/whychooseus-2.png"} width={isPageWide ? 48 : 38} height={isPageWide ? 48 : 38} />
                    </div>
                    <div className="w-fit flex flex-col md:gap-2">
                        <div className="text-[18px] md:text-[22px] font-[700] leading-[32px]">
                            Real-Time Negotiated Bookings
                        </div>
                        <div className="text-[14px] md:text-[16px] font-[400] leading-[24px] text-[#7C7C7C]">
                            Dedicated travel experts negotiate the best prices within your budget.
                        </div>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-3">
                    <div className="w-[76px] h-[76px] md:w-[96px] md:h-[96px] p-2 bg-[#665CE834] flex items-center justify-center rounded-lg">
                        <Image src={"https://d31aoa0ehgvjdi.cloudfront.net/media/corporates/whychooseus-3.png"} width={isPageWide ? 48 : 38} height={isPageWide ? 48 : 38} />
                    </div>
                    <div className="w-fit flex flex-col md:gap-2">
                        <div className="text-[18px] md:text-[22px] font-[700] leading-[32px]">
                            Book-it-all in one click
                        </div>
                        <div className="text-[14px] md:text-[16px] font-[400] leading-[24px] text-[#7C7C7C]">
                            Book all your personalized and flexible travel needs in just one click.
                        </div>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-3">
                    <div className="w-[76px] h-[76px] md:w-[96px] md:h-[96px] p-2 bg-[#0070E132] flex items-center justify-center rounded-lg">
                        <Image src={"https://d31aoa0ehgvjdi.cloudfront.net/media/corporates/whychooseus-4.png"} width={isPageWide ? 48 : 38} height={isPageWide ? 48 : 38} />
                    </div>
                    <div className="w-fit flex flex-col md:gap-2">
                        <div className="text-[18px] md:text-[22px] font-[700] leading-[32px]">
                            24x7 Live Assistance
                        </div>
                        <div className="text-[14px] md:text-[16px] font-[400] leading-[24px] text-[#7C7C7C]">
                            24x7 support that keeps you swinging all day and night, no monkey business!
                        </div>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-3">
                    <div className="w-[76px] h-[76px] md:w-[96px] md:h-[96px] p-2 bg-[#B02DB933] flex items-center justify-center rounded-lg">
                        <Image src={"https://d31aoa0ehgvjdi.cloudfront.net/media/corporates/whychooseus-5.png"} width={isPageWide ? 48 : 38} height={isPageWide ? 48 : 38} />
                    </div>
                    <div className="w-fit flex flex-col md:gap-2">
                        <div className="text-[18px] md:text-[22px] font-[700] leading-[32px]">
                            Offbeat Experiences, curated for you
                        </div>
                        <div className="text-[14px] md:text-[16px] font-[400] leading-[24px] text-[#7C7C7C]">
                            Discover offbeat adventures, activities & experiences.
                        </div>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-3">
                    <div className="w-[76px] h-[76px] md:w-[96px] md:h-[96px] p-2 bg-[#35C78134] flex items-center justify-center rounded-lg">
                        <Image src={"https://d31aoa0ehgvjdi.cloudfront.net/media/corporates/whychooseus-6.png"} width={isPageWide ? 48 : 38} height={isPageWide ? 48 : 38} />
                    </div>
                    <div className="w-fit flex flex-col md:gap-2">
                        <div className="text-[18px] md:text-[22px] font-[700] leading-[32px]">
                            Transparent Pricing
                        </div>
                        <div className="text-[14px] md:text-[16px] font-[400] leading-[24px] text-[#7C7C7C]">
                            Transparent pricing with no hidden fees - pay only a small service fee!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
