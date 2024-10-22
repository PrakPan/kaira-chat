import { GoArrowRight } from "react-icons/go";
import Button from "../../components/ui/button/Index"
import ImageLoader from "../../components/ImageLoader";
import media from "../../components/media";


export default function WhatWeOffer(props) {
    let isPageWide = media("(min-width: 768px)");

    return (
        <div className="mt-5 py-5 flex flex-col gap-2 md:flex-row">
            <div className="px-2 md:px-0">
                <ImageLoader url={"media/corporates/whatweoffer.jpeg"} width={isPageWide ? 580 : 290} height={isPageWide ? 600 : 300} borderRadius={8} />
            </div>
            <div className="pl-3 pr-3 md:pt-0 md:px-16 flex flex-col justify-between">
                <div className="text-[27px] md:text-[40px] font-[700] leading-[52px]">What We Offer?</div>
                <div className="flex flex-col gap-3 text-[16px] font-[350] leading-[28px]">
                    <div className="">
                        Explore the world with curated travel experiences that cater to every adventurer. We offer personalized itineraries, unique accommodations, and immersive activities that go beyond the typical tourist spots. Whether you're seeking a tranquil retreat, an adrenaline-pumping adventure, or a cultural deep dive, our expertly crafted trips ensure you experience the best of each destination. Let us handle the details while you focus on creating unforgettable memories.
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row items-center gap-2">
                            <GoArrowRight className="text-3xl" />
                            Customized Itineraries
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <GoArrowRight className="text-3xl" />
                            Unique Accommodations
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <GoArrowRight className="text-3xl" />
                            24/7 Support
                        </div>
                    </div>
                </div>

                <Button
                    fontWeight="500"
                    borderColor="black"
                    borderWidth="1px"
                    hoverBgColor="black"
                    hoverColor="white"
                    bgColor="#F7e700"
                    borderRadius="6px"
                    margin={isPageWide ? "4rem 0 0 0" : "2rem 0 0 0"}
                    padding="1rem 2rem"
                    onclick={props.setEnquiryOpen}
                >
                    Schedule a Callback
                </Button>
            </div>
        </div>
    )
}
