import React, { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import media from "../../components/media"
import { MobileSkeleton } from "../../components/containers/plannerlocations/LocationSkeleton";
import SwiperCarousel from "../../components/SwiperCarousel";
import ImageLoader from "../../components/ImageLoader";
import { logEvent } from "../../services/ga/Index";
import { getIndianPrice } from "../../services/getIndianPrice";

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
    height: 35vh;
  }
`;

const MobileCardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const ThemeLocations = (props) => {
    let isPageWide = media("(min-width: 768px)");
    const [MobilecardsToShowJSX, setMobileCardsToShowJSX] = useState([]);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        if (props.locations) {
            let cardsArr = [];
            let MobileCardsArr = [];
            let count = 0;
            for (let i = 0; i < props.locations.length; i++) {
                if (i % 4 == 0 && i != 0) {
                    let n = cardsArr.length;
                    const el = cardsArr.slice(n - 4, n);
                    MobileCardsArr.push(
                        <MobileCardsContainer>
                            {el.map((e, i) => (
                                <div key={i}>{e}</div>
                            ))}
                        </MobileCardsContainer>
                    );
                    count++;
                }
                cardsArr.push(
                    <Card
                        key={props.locations[i].id}
                        path={props.locations[i].path}
                        location={props.locations[i].destination || props.locations[i].name}
                        heading={props.locations[i].tagline}
                        img={props.locations[i].image}
                        slug={props.locations[i].link}
                        link={props.locations[i].link}
                        country={props.country}
                        page={props.page}
                        data={props.locations[i]}
                        setEnquiryOpen={props.setEnquiryOpen}
                    ></Card>
                );
            }
            if (count % 4 != 0 || count == 0) {
                const el = cardsArr.slice(count * 4, cardsArr.length);
                MobileCardsArr.push(
                    <MobileCardsContainer>
                        {el.map((e, i) => (
                            <div key={i}>{e}</div>
                        ))}
                    </MobileCardsContainer>
                );
            }
            setCards(cardsArr);
            setMobileCardsToShowJSX(MobileCardsArr);
        }
    }, []);

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
};

export default ThemeLocations;

const Card = (props) => {
    const [loading, setLoading] = useState(true);

    const handleImageClick = (e) => {
        props.setEnquiryOpen(true)

        logEvent({
            action: "View_Destination",
            params: {
                page: props?.page ? props.page : "",
                event_category: "Click",
                event_label: "View Destination",
                event_value: props?.location ? props.location : "",
                event_action: `Destinations in India for Corporate Getaways`,
            },
        });
    };

    return (
        <div className="hover-pointer group">
            <ImageContainer
                className={`w-full ${loading ? "bg-gray-200 animate-pulse" : ""}`}
                onClick={handleImageClick}
            >
                <ImageFade>
                    <ImageLoader
                        url={props.img}
                        dimensions={{ width: 500, height: 500 }}
                        dimensionsMobile={{ width: 800, height: 800 }}
                        height="35vh"
                        style={{ filter: "brightness(0.9)" }}
                        onload={() => {
                            setLoading(false);
                        }}
                    ></ImageLoader>
                </ImageFade>

                <div
                    className={`w-full flex flex-col px-3 gap-4 rounded-[10px] absolute bottom-0 pb-4 translate-y-[60px] transition-all ${!loading &&
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
                            <div className="text-white text-lg font-bold leading-[16px]">
                                {props.location}
                            </div>
                            {props.data?.budget ? (
                                <div className="text-white text-sm font-light leading-[14px]">
                                    From{" "}
                                    <span className="font-bold">
                                        ₹{getIndianPrice(props.data.budget)}
                                    </span>
                                    /- per day
                                </div>
                            ) : (
                                <div className="text-white text-md font-light leading-[16px]">
                                    {props.heading}
                                </div>
                            )}
                        </div>
                    )}

                    <button className="w-full bg-[#F7E700] rounded-lg text-sm text-black text-center px-2 py-2">
                        Plan a Trip
                    </button>
                </div>
            </ImageContainer>
        </div>
    );
}
