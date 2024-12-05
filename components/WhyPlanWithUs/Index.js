import media from "../../components/media";
import Image from "next/image";
import { WHY_CHOOSE_US } from "../../public/content/newyear"

const WhyPlanWithUsOld = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <div className=" mx-2 grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex flex-row items-center gap-3">
        <div className="w-[76px] h-[76px] md:w-[96px] md:h-[96px] p-2 bg-[#F8AE4033] flex items-center justify-center rounded-lg">
          <Image src={"https://d31aoa0ehgvjdi.cloudfront.net/media/corporates/whychooseus-1.png"} width={isPageWide ? 48 : 38} height={isPageWide ? 48 : 38} />
        </div>
        <div className="w-fit flex flex-col md:gap-2">
          <div className="text-[18px] md:text-[22px] font-[700] leading-[32px]">
            Personalization in seconds
          </div>
          <div className="text-[14px] md:text-[16px] font-[350] leading-[24px] text-[#7C7C7C]">
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
          <div className="text-[14px] md:text-[16px] font-[350] leading-[24px] text-[#7C7C7C]">
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
          <div className="text-[14px] md:text-[16px] font-[350] leading-[24px] text-[#7C7C7C]">
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
          <div className="text-[14px] md:text-[16px] font-[350] leading-[24px] text-[#7C7C7C]">
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
          <div className="text-[14px] md:text-[16px] font-[350] leading-[24px] text-[#7C7C7C]">
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
          <div className="text-[14px] md:text-[16px] font-[350] leading-[24px] text-[#7C7C7C]">
            Transparent pricing with no hidden fees - pay only a small service fee!
          </div>
        </div>
      </div>
    </div>
  );
};

const WhyPlanWithUs = (props) => {
  return (
    <div className="flex flex-col items-center gap-5 px-3 md:px-0">
      {/* <div className="flex flex-col items-center gap-3">
        <div className="text-[30px] md:text-[40px] font-bold">Why Choose Us?</div>
        <div className="text-[16]">Choose us for unforgettable experiences, expert guidance, and a commitment to making your journey memorable.</div>
      </div> */}

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

export default WhyPlanWithUs;
