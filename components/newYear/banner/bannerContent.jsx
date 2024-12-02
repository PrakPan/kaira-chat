import { useState } from "react";
import { useRouter } from "next/router";
import TailoredForm from "../../tailoredform/Index";
import media from "../../media"
import TailoredFormMobileModal from "../../modals/TailoredFomrMobile";
import openTailoredModal from "../../../services/openTailoredModal";


export default function BannerContent(props) {
    let isPageWide = media("(min-width: 768px)");
    const [showTailoredModal, setShowTailoredModal] = useState(false);
    const router = useRouter();

    const handlePlanButton = () => {
        if (isPageWide) {
            setShowTailoredModal(true);
        } else {
            openTailoredModal(router, props.page_id, props.destination);
        }
    };

    return (
        <div className="w-full h-full flex flex-row">
            <div className="md:w-[50%] p-[5%] md:p-[10%]">
                <div className="text-[#F7E700] font-[700] text-[36px] leading-[46px]">
                    Celebrate New Year, Your Way!
                </div>

                <div className="text-white font-[400] text-[36px] leading-[46px]">
                    Unique Trips, Unforgettable Memories, and Experiences to Match Your Vibe.
                </div>

                <button onClick={handlePlanButton} className="mt-7 bg-[#F7E700] rounded-lg px-4 py-2">Plan Itinerary Now!</button>
            </div>

            {isPageWide && (
                <div className="w-[50%] pt-[5%] px-[12%]">
                    <TailoredForm
                        page_id={props.page_id}
                        children_cities={props.children_cities}
                        destination={props.destination}
                        cities={props.cities}
                        HeroBanner
                        eventDates={props.eventDates}
                    ></TailoredForm>
                </div>
            )}

            <TailoredFormMobileModal
                destinationType={"city-planner"}
                page_id={props.page_id}
                children_cities={props.children_cities}
                destination={props.destination}
                cities={props.cities}
                onHide={() => {
                    setShowTailoredModal(false);
                }}
                show={showTailoredModal}
                eventDates={props.eventDates}
            />
        </div>
    );
}

export const Banner2Content = (props) => {
    let isPageWide = media("(min-width: 768px)");
    const [showTailoredModal, setShowTailoredModal] = useState(false);
    const router = useRouter();

    const handlePlanButton = () => {
        if (isPageWide) {
            setShowTailoredModal(true);
        } else {
            openTailoredModal(router, props.page_id, props.destination);
        }
    };

    return (
        <div className="w-full h-full flex flex-row">
            <div className="md:w-[50%] p-[5%] md:p-[10%]">
                <div className="text-white font-[700] text-[36px] leading-[52px]">
                    Plan Your Dream <br/> New Year Trip!
                </div>

                <div className="text-white font-[400] text-[16px] leading-[26px]">
                    <div>
                        Unbeatable Discounts on Exclusive Tour Packages
                    </div>

                    <div>
                        – Plan Your Trip Today and Make Memories That Last Forever!
                    </div>
                </div>


                <button onClick={handlePlanButton} className="mt-7 bg-[#F7E700] rounded-lg px-4 py-2">Plan a Trip</button>
            </div>

            {isPageWide && (
                <div className="w-[50%] align-middle flex px-[12%]">
                    <TailoredForm
                        page_id={props.page_id}
                        children_cities={props.children_cities}
                        destination={props.destination}
                        cities={props.cities}
                        HeroBanner
                        eventDates={props.eventDates}
                    ></TailoredForm>
                </div>
            )}

            <TailoredFormMobileModal
                destinationType={"city-planner"}
                page_id={props.page_id}
                children_cities={props.children_cities}
                destination={props.destination}
                cities={props.cities}
                onHide={() => {
                    setShowTailoredModal(false);
                }}
                show={showTailoredModal}
                eventDates={props.eventDates}
            />
        </div>
    );
}
