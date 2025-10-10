import { useRouter } from "next/router";
import useMediaQuery from "../../media";

export default function RouteOverviewModal({ setShowRouteOverview }) {
    const router = useRouter()
    const isDesktop = useMediaQuery("(min-width:768px)");

    const handleSkip = () => {
        setShowRouteOverview(false);
        router.push({
            pathname: '/new-trip',
            query: {
                slideIndex: 2,
            },
        })
    }
    const handleNext = () => {
        setShowRouteOverview(false);
        router.push({
            pathname: '/new-trip',
            query: {
                slideIndex: 1,
            },
        })
    }
    return (
        <div className="max-w-[611px]">

            <h2 className="Heading2SB">
                Route Overview
            </h2>

            <p className="Body2R_14">
                Want to overview the route now? You can skip and always edit the same on the itinerary page.
            </p>

            {isDesktop ?
                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleNext}
                        className="MediumIndigoOutlinedButton"
                    >
                        View Route
                    </button>
                    <button
                        onClick={handleSkip}
                        className="MediumIndigoButton"
                    >
                        Ask me later
                    </button>
                </div>
                :
                <div className="flex justify-between gap-[20px]">
                    <button
                        onClick={handleNext}
                        className="MediumIndigoOutlinedButton w-1/2"
                    >
                        View Route
                    </button>
                    <button
                        onClick={handleSkip}
                        className="MediumIndigoButton !w-1/2"
                    >
                        Ask me later
                    </button>
                </div>}
        </div>
    )
}
