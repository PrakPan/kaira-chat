import { useRouter } from "next/router";
import { useState } from "react";
import TailoredFormMobileModal from "../modals/TailoredFomrMobile";
import openTailoredModal from "../../services/openTailoredModal";
import media from "../media"


export default function CraftNewTrip(props) {
    let isPageWide = media("(min-width: 768px)");
    const router = useRouter();
    const [showTailoredModal, setShowTailoredModal] = useState(false);

    const handlePlanButton = () => {
        // if (isPageWide) {
        //     setShowTailoredModal(true);
        // } else {
        //     openTailoredModal(router, props.page_id, props.destination);
        // }
        router.push({
        pathname: "/new-trip",
        query: { ...router.query,source: props?.destination || 'home' }
    });
    };

    return (
        <div>
            <button
                onClick={handlePlanButton}
                className="px-5 py-2 border-2 border-black rounded-lg hover:text-white hover:bg-black transition-all mx-auto flex">Craft a new trip!</button>

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
    )
}
