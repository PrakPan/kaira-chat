import { useState, useEffect } from "react"
import Link from "next/link";
import { RiArrowDropDownLine } from "react-icons/ri";
import styled from "styled-components";
import ImageLoader from "../ImageLoader";
import { logEvent } from "../../services/ga/Index";
import { getIndianPrice } from "../../services/getIndianPrice";
import media from "../media";
import { MobileSkeleton } from "../containers/plannerlocations/LocationSkeleton";
import SwiperCarousel from "../SwiperCarousel";
import { DOMESTIC_PACKAGES, INTERNATIONAL_PACKAGES } from "../../public/content/newyear";

const MobileCardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

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


export default function Packages(props) {
    const [activeTab, setActiveTab] = useState('All');
    const [domestic, setDomestic] = useState(true);

    return (
        <div className="flex flex-col gap-3">
            <div className="font-bold text-[30px] md:text-[40px]">What’s Your Vibe Package</div>

            <Navigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                domestic={domestic}
                setDomestic={setDomestic}
            />

            <Carousel activeTab={activeTab} packages={domestic ? DOMESTIC_PACKAGES : INTERNATIONAL_PACKAGES} />
        </div>
    )
}


const Navigation = ({ activeTab, setActiveTab, domestic, setDomestic }) => {
    const Tabs = [
        { id: 1, name: "All" },
        { id: 2, name: "Party" },
        { id: 3, name: "Serene" },
        { id: 4, name: "Religious" },
        { id: 5, name: "Adventure" },
        { id: 6, name: "Unique Experential" }
    ]
    const [showMenu, setShowMenu] = useState(false);

    const handleClick = (name) => {
        setActiveTab(name);
    }

    const handleMenu = (domestic) => {
        setDomestic(domestic);
        setShowMenu(false);
    }

    return (
        <div className="flex flex-col gap-3 items-start md:flex-row md:items-center md:justify-between">
            <div className="w-full flex flex-row items-center gap-3 overflow-x-auto hide-scrollbar">
                {Tabs.map((tab) => (
                    <div key={tab.id}
                        onClick={() => handleClick(tab.name)}
                        className={`text-nowrap cursor-pointer border-1 rounded-full px-3 md:px-5 py-2 md:py-3 font-semibold text-[15px] text-[#7C7C7C] ${activeTab == tab.name ? "border-black bg-[#F7E700] text-black" : ""}`}>
                        {tab.name}
                    </div>
                ))}
            </div>

            <div className="relative flex items-center justify-center">
                <div
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center justify-center border-1 px-3 py-2 md:px-5 md:py-3 text-[15px] font-semibold rounded-full cursor-pointer">
                    {domestic ? "Domestic" : "International"}
                    <RiArrowDropDownLine className="text-3xl inline-flex" />

                </div>

                {showMenu && (
                    <div className="z-50 px-3 py-2 md:px-4 md:py-2 flex flex-col gap-3 absolute -bottom-[100%] bg-white border-2 rounded-lg cursor-pointer">
                        <div onClick={() => handleMenu(false)} className="hover:text-blue]">International</div>
                        <div onClick={() => handleMenu(true)}>Domestic</div>
                    </div>
                )}
            </div>
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
            if (props.activeTab === 'All' || props.packages[i].category === props.activeTab) {
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
                    ></Card>
                );
            }
        }

        setCards(cardsArr);
        setMobileCardsToShowJSX(cardsArr);
    }, [props.activeTab, props.packages]);

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

    const handleImageClick = (e) => {
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
        <Link className="hover-pointer group" href={"/" + props.path}>
            <ImageContainer
                className={`w- full ${loading ? "bg-gray-200 animate-pulse" : ""}`}
                onClick={handleImageClick}
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
                                /- per person
                            </div>

                        </div>
                    )}

                    <button className="w-full bg-[#F7E700] rounded-lg text-[15px] text-black font-semibold text-center px-2 py-2">
                        Plan a trip
                    </button>
                </div>
            </ImageContainer>
        </Link>
    );
}
