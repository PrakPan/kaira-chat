import { useRouter } from "next/router";
import { useState, useEffect } from "react"
import styled from "styled-components";
import ImageLoader from "../ImageLoader";
import { logEvent } from "../../services/ga/Index";
import { getIndianPrice } from "../../services/getIndianPrice";
import media from "../media";
import { MobileSkeleton } from "../containers/plannerlocations/LocationSkeleton";
import SwiperCarousel from "../SwiperCarousel";
import { NEW_YEAR_UNIQUE } from "../../public/content/newyear";
import TailoredFormMobileModal from "../modals/TailoredFomrMobile";
import openTailoredModal from "../../services/openTailoredModal";
import CraftNewTrip from "./CraftNewTrip";
import Image from "next/image";


const ImageFade = styled.div`
  width: 100%;
  height: auto;
  transition: 0.2s all ease-in-out;
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    ${ImageFade} {
      transition: 0.2s all ease-in-out;
      transform: scale(1.1);
    }
  }
  @media screen and (min-width: 768px) {
    height: 50vh;
  }
`;

export default function NewYearUnique(props) {
    let isPageWide = media("(min-width: 768px)");
    const router = useRouter();
    const [showTailoredModal, setShowTailoredModal] = useState(false);
    const [pageId, setPageId] = useState(null);
    const [destination, setDestination] = useState(null);

    const handlePlanButton = (pageId, destination) => {
        if (isPageWide) {
            setPageId(pageId);
            setDestination(destination);
            setShowTailoredModal(true);
        } else {
            openTailoredModal(router, pageId, destination);
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-4">

                <div className="relative w-fit mx-auto font-bold text-[30px] md:text-[40px] text-center">
                    <Image src={`https://d31aoa0ehgvjdi.cloudfront.net/media/new-year/bg.png`}
                        width={350}
                        height={60}
                        className="absolute -top-10 -right-[14rem]"
                    />

                    <Image src={`https://d31aoa0ehgvjdi.cloudfront.net/media/new-year/cap.png`}
                        width={60}
                        height={60}
                        className="absolute -top-4 left-2 md:-top-2 md:-left-5"
                    />
                    Explore Unique New Year Traditions Across the World</div>
                <div className="text-[16px] text-center">
                    Discover diverse customs and celebrations that make New Year’s Eve unforgettable around the globe.
                </div>

                <Carousel handlePlanButton={handlePlanButton} packages={NEW_YEAR_UNIQUE} />

                <CraftNewTrip />
            </div>

            <TailoredFormMobileModal
                destinationType={"city-planner"}
                page_id={pageId}
                children_cities={props.children_cities}
                destination={destination}
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

const Carousel = (props) => {
    let isPageWide = media("(min-width: 768px)");
    const [MobilecardsToShowJSX, setMobileCardsToShowJSX] = useState([]);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        let cardsArr = [];
        for (let i = 0; i < props.packages.length; i++) {
            cardsArr.push(
                <Card
                    key={props.packages[i].id}
                    // path={props.packages[i].path}
                    heading={props.packages[i].heading}
                    tagline={props.packages[i].tagline}
                    img={props.packages[i].image}
                    budget={props.packages[i].budget}
                    // slug={props.packages[i].link}
                    // link={props.packages[i].link}
                    // country={props.country}
                    page={'New Year Page'}
                    data={props.packages[i]}
                    handlePlanButton={props.handlePlanButton}
                ></Card>
            );
        }

        setCards(cardsArr);
        setMobileCardsToShowJSX(cardsArr);
    }, [props.packages]);

    if (isPageWide)
        return (
            <div>
                {cards.length ? (
                    <SwiperCarousel
                        navigationButtons={true}
                        slidesPerView={4}
                        cards={cards}
                    ></SwiperCarousel>
                ) : null}
            </div>
        );
    else
        return (
            <div>
                <div style={{ padding: "1rem 0" }}>
                    {MobilecardsToShowJSX.length ? (
                        <SwiperCarousel
                            navigationButtons={true}
                            slidesPerView={1}
                            cards={MobilecardsToShowJSX}
                            pageDots
                        ></SwiperCarousel>
                    ) : (
                        <MobileSkeleton />
                    )}
                </div>
            </div>
        );
}

const Card = (props) => {
    const [loading, setLoading] = useState(true);

    const handleImageClick = (pageId, destination) => {
        props.handlePlanButton(pageId, destination);

        logEvent({
            action: "View_Destination",
            params: {
                page: "New Year Page",
                event_category: "Click",
                event_label: "View Destination",
                event_value: props?.heading ? props.heading : "",
                event_action: `Plan a Trip`,
            },
        });
    };

    return (
        <ImageContainer
            className={`w-full hover-pointer group ${loading ? "bg-gray-200 animate-pulse" : ""}`}
            onClick={() => handleImageClick(props.data.pageId, props.heading)}
        >
            <ImageFade>
                <ImageLoader
                    url={props.img}
                    dimensions={{ width: 500, height: 500 }}
                    dimensionsMobile={{ width: 800, height: 800 }}
                    height="50vh"
                    style={{ filter: "brightness(0.9)" }}
                    onload={() => {
                        setLoading(false);
                    }}
                ></ImageLoader>
            </ImageFade>

            <div
                className={`w-full flex flex-col px-3 gap-4 rounded-[10px] absolute bottom-0 pb-4 translate-y-[63px] transition-all ${!loading &&
                    "bg-gradient-to-t from-black from-60% group-hover:translate-y-0"
                    }`}
            >
                {loading ? (
                    <div className="w-full flex flex-col items-start gap-2">
                        <div className="w-[80%] h-10 bg-gray-300 rounded-lg"></div>
                        <div className="w-[60%] h-8 bg-gray-300 rounded-lg"></div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full flex flex-col gap-1">
                            <div className="text-white text-[18px] font-bold">
                                {props.heading}
                            </div>

                            <div className="text-white text-[15px]">
                                {props.tagline}
                            </div>
                        </div>

                        <div className="text-white text-[14px]">
                            From{" "}
                            <span className="font-bold">
                                ₹{getIndianPrice(props.budget)}
                            </span>
                            /- per day
                        </div>

                    </div>
                )}

                <button className="w-full bg-[#F7E700] rounded-lg text-[15px] text-black font-semibold text-center px-2 py-2">
                    Plan a trip
                </button>
            </div>
        </ImageContainer>
    );
}
