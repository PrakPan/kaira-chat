import Image from "next/image";
import { SocialShareDesktop } from "../containers/itinerary/booking1/SocialShare";
import { useState } from "react";

export default function TravelPartnerContact(props) {
    const [share, setShare] = useState(false);
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
            <button className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200">
                    <Image src={"/settings.svg"} height={22} width={22} className=" text-gray-600" />
                </button>
                <div className="relative">
                <button className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200" onClick={()=>setShare(true)}>
                    <Image src="/share.svg" height={22} width={22} className="text-gray-600" />
                </button>
                {share&&<div className="absolute top-10 right-0 z-[99]">
                    <SocialShareDesktop
                    social_title={props?.itinerary?.social_title}
                    social_description={props?.social_description}
                    itineraryName={props?.itinerary?.name}
                    itineraryImage={props?.itinerary?.images?.[0]}
                    share={share}
                    setShare={setShare}
                    />
                </div>}
                </div>
            </div>
        </div>
    );
}
