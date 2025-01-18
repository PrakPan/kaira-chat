import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import DesktopBanner from "../../components/containers/Banner";
import Experiences from "../../components/containers/Experiences";
import media from "../../components/media";
import BannerTwo from "./BannerTwo";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import Reviews from "./CaseStudies/Index";
import ExperienceCard from "../../components/cards/newitinerarycard-main/ExperienceCard";
import Overview from "./Overview";
import Button from "../../components/ui/button/Index";
import Locations from "../themes/ThemeLocations.jsx";
import MobileBanner from "./MobileBanner";
import WhyPlanWithUs from "../../components/WhyPlanWithUs/PlanWithUsWithEnquiry";
import ThemeBanner from "../../components/containers/ThemeBanner/ThemeBanner";
import openTailoredModal from "../../services/openTailoredModal";
import dynamic from "next/dynamic";
import AsSeenIn from "../testimonial/AsSeenIn";
import { logEvent } from "../../services/ga/Index";
import H3 from "../../components/heading/H3";
import SecondaryHeading from "../../components/heading/Secondary.jsx";
import WhyChoosePackages from "../themes/WhyChoosePackages.jsx";
import FeaturedPackage from "../themes/FeaturedPackage.jsx";
import ActivityCard from "../themes/ActivityCard.jsx";
import SwiperCarousel from "../../components/SwiperCarousel.js";
import ThemeTestimonial from "../themes/ThemeTestimonial.jsx";
import BannerCards from "../../components/newYear/BannerCards.jsx";
import Recommendations from "../../components/theme/Recommendations.jsx";
import Image from "next/image.js";
import HoneymoonPackages from "../../components/theme/HoneymoonPackages.jsx";
import ThemeBannerCards from "../../components/theme/ThemeBannerCards.jsx";
import ThemeFaqs from "../themes/ThemeFaqs.jsx";
const MapBox = dynamic(() => import("../../components/Map.js"), {
  ssr: false,
});

const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 85%;
  }
`;

const MapInfo = styled.div`
  b {
    font-weight: 600;
  }
`;

const MapGridContainer = styled.div`
  display: grid;
  grid-gap: 30px;
  @media screen and (min-width: 768px) {
    width: 100%;
    grid-template-columns: auto 500px;
    grid-gap: 40px;
    margin: 0 auto 0 auto;
  }
`;

const MapContainer = styled.div`
  @media screen and (min-width: 768px) {
    padding-top: 116px;
  }
`;

export default function ThemePage(props) {
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");
  const [userItineraries, setUserItineraries] = useState([]);
  const [TTWItineraries, setTTWItineraries] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [desktopBannerLoading, setDesktopBannerLoading] = useState(false);
  const [overviewHeading, setOverviewHeading] = useState(null);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    let iti_exclusive = [];
    let iti_customer = [];
    try {
      for (var i = 0; i < props.experienceData.itinerary_data.length; i++) {
        if (props.experienceData.itinerary_data[i].owner === "TTW")
          iti_exclusive.push(
            <ExperienceCard
              data={props.experienceData.itinerary_data[i]}
              key={props.experienceData.itinerary_data[i].short_text}
              hardcoded={
                props.experienceData.itinerary_data[i].payment_info
                  ? true
                  : false
              }
              filter={
                props.experienceData.itinerary_data[i].experience_filters
                  ? props.experienceData.itinerary_data[i].experience_filters[0]
                  : null
              }
              rating={props.experienceData.itinerary_data[i].rating}
              slug={props.experienceData.itinerary_data[i].slug}
              id={props.experienceData.itinerary_data[i].id}
              number_of_adults={
                props.experienceData.itinerary_data[i].number_of_adults
              }
              locations={
                props.experienceData.itinerary_data[i]["itinerary_locations"]
              }
              text={props.experienceData.itinerary_data[i].short_text}
              experience={props.experienceData.itinerary_data[i].name}
              cost={
                props.experienceData.itinerary_data[i].payment_info
                  ? props.experienceData.itinerary_data[i].payment_info.length
                    ? props.experienceData.itinerary_data[i].payment_info[0]
                        .cost
                    : null
                  : null
              }
              duration_number={
                props.experienceData.itinerary_data[i].duration_number
              }
              duration_unit={
                props.experienceData.itinerary_data[i].duration_unit
              }
              location={
                props.experienceData.itinerary_data[i]["experience_region"]
              }
              starting_cost={
                props.experienceData.itinerary_data[i].payment_info
                  ? props.experienceData.itinerary_data[i].payment_info
                      .per_person_total_cost
                  : props.experienceData.itinerary_data[i].starting_price
              }
              images={props.experienceData.itinerary_data[i].images}
            ></ExperienceCard>
          );
        else
          iti_customer.push(
            <ExperienceCard
              data={props.experienceData.itinerary_data[i]}
              key={props.experienceData.itinerary_data[i].short_text}
              hardcoded={
                props.experienceData.itinerary_data[i].payment_info
                  ? true
                  : false
              }
              filter={
                props.experienceData.itinerary_data[i].experience_filters
                  ? props.experienceData.itinerary_data[i].experience_filters[0]
                  : null
              }
              rating={props.experienceData.itinerary_data[i].rating}
              slug={props.experienceData.itinerary_data[i].slug}
              id={props.experienceData.itinerary_data[i].id}
              number_of_adults={
                props.experienceData.itinerary_data[i].number_of_adults
              }
              locations={
                props.experienceData.itinerary_data[i]["itinerary_locations"]
              }
              text={props.experienceData.itinerary_data[i].short_text}
              experience={props.experienceData.itinerary_data[i].name}
              cost={
                props.experienceData.itinerary_data[i].payment_info
                  ? props.experienceData.itinerary_data[i].payment_info.length
                    ? props.experienceData.itinerary_data[i].payment_info[0]
                        .cost
                    : null
                  : null
              }
              duration_number={
                props.experienceData.itinerary_data[i].duration_number
              }
              duration_unit={
                props.experienceData.itinerary_data[i].duration_unit
              }
              location={
                props.experienceData.itinerary_data[i]["experience_region"]
              }
              starting_cost={
                props.experienceData.itinerary_data[i].payment_info
                  ? props.experienceData.itinerary_data[i].payment_info
                      .per_person_total_cost
                  : props.experienceData.itinerary_data[i].starting_price
              }
              images={props.experienceData.itinerary_data[i].images}
            ></ExperienceCard>
          );
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (props.experienceData?.headings) {
      let headings = props.experienceData?.headings;
      headings.sort((a, b) => a?.priority - b?.priority);
      setHeadings(headings);
    }
  }, [props.experienceData?.headings]);

  useEffect(() => {
    const user = [];
    const ttw = [];
    if (props.experienceData.itinerary_data) {
      props.experienceData.itinerary_data.map((e) => {
        if (e.owner !== "TTW") user.push(e);
        else ttw.push(e);
      });
    }
    setUserItineraries(user);
    setTTWItineraries(ttw);
  }, [props.experienceData.itinerary_data]);

  useEffect(() => {
    // The counter changed!
    setOverviewHeading(props.experienceData.overview_heading);
    return () => setOverviewHeading(null);
  }, [router.query.link, props.experienceData]);

  var country;
  if (props.experienceData.ancestors) {
    if (
      props.experienceData.ancestors.length &&
      props.experienceData.ancestors[0].level == "Country" &&
      props.experienceData.ancestors[0].name
    ) {
      country = props.experienceData.ancestors[0].name;
    }
  }

  const InfoWindowContainer = (location) => (
    <MapInfo>
      <b>{location.name}</b>
      <div>
        {location.most_popular_for?.map((e, i) =>
          i != 0 ? <span key={i}>{", " + e}</span> : <span key={i}>{e}</span>
        )}
      </div>
    </MapInfo>
  );

  const handlePlanButtonClick = (location) => {
    openTailoredModal(
      router,
      props.experienceData.id,
      props.experienceData.destination
    );

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: "State Page",
        event_category: "Button Click",
        event_label: "Create your travel plan now!",
        event_action: location,
      },
    });
  };

  const activities = [
    {
      image: "https://d31aoa0ehgvjdi.cloudfront.net/media/themes/activity-1.png",
      title: "Private Yacht Dinner Cruises",
      description: "Savor a romantic dinner on the water, with stunning views and unmatched intimacy.",
    },
    {
      image: "https://d31aoa0ehgvjdi.cloudfront.net/media/themes/activity-2.png",
      title: "Couple Spa Treatments",
      description: "Relax, unwind, and indulge in a soothing experience designed for two.",
    },
    {
      image: "https://d31aoa0ehgvjdi.cloudfront.net/media/themes/activity-3.png",
      title: "Hot Air Balloon Rides",
      description: "Soar above stunning landscapes for a romantic, breathtaking adventure in the skies.",
    },
    {
      image: "https://d31aoa0ehgvjdi.cloudfront.net/media/themes/activity-4.png",
      title: "Stargazing Nights",
      description: "Embrace the magic of the night sky, hand in hand, under a blanket of stars.",
    },
    {
      image: "https://d31aoa0ehgvjdi.cloudfront.net/media/themes/activity-2.png",
      title: "Couple Spa Treatments",
      description: "Indulge in rejuvenating experiences...",
    },
    {
      image: "https://d31aoa0ehgvjdi.cloudfront.net/media/themes/activity-2.png",
      title: "Hot Air Balloon Rides",
      description: "Fly high and create unforgettable moments...",
    },
    {
      image: "https://d31aoa0ehgvjdi.cloudfront.net/media/themes/activity-2.png",
      title: "Stargazing Nights",
      description: "Escape into the magic of the night sky...",
    },
  ];

  const packages = [
    {
      image: "media/website/logo-only.svg",
      title: "Romantic Retreat – Tuscany & Amalfi Coast",
      duration: "6 Nights/7 Days",
    },
    {
      image: "media/themes/banner.png",
      title: "Tropical Bliss – Maldives Escape",
      duration: "4 Nights/5 Days",
    },
  ];

  const testimonials = [
    {
      title: "Magical Honeymoon Experience",
      description:
        "Our honeymoon with The Tuscany Way was nothing short of magical! From the moment we arrived, everything was perfectly planned...",
      name: "",
      image: "media/themes/banner.png",
      rating: 5,
    },
    {
      title: "Perfect Blend of Adventure and Romance",
      description:
        "We wanted a honeymoon that combined adventure and relaxation, and Tuscany Way delivered beyond our expectations...",
      name: "",
      image: "media/themes/banner.png",
      rating: 5,
    },
    {
      title: "Seamless Planning, Unforgettable Memories",
      description:
        "Planning our honeymoon felt overwhelming, but Tuscany Way took care of everything with ease and precision...",
      name: "",
      image: "media/themes/banner.png",
      rating: 5,
    },
    {
      title: "Magical Honeymoon Experience",
      description:
        "Our honeymoon with The Tuscany Way was nothing short of magical! From the moment we arrived, everything was perfectly planned...",
      name: "",
      image: "media/themes/banner.png",
      rating: 5,
    },
    {
      title: "Perfect Blend of Adventure and Romance",
      description:
        "We wanted a honeymoon that combined adventure and relaxation, and Tuscany Way delivered beyond our expectations...",
      name: "Kavita & Rajesh",
      image: "media/themes/banner.png",
      rating: 5,
    },
  ];

  return (
    <div className="w-full overflow-x-hidden">
    <div
      className={"Homepage"}
      id="homepage-anchor"
      style={{ visibility: props.hidden ? "hidden" : "visible" }}
    >
      <ThemeBanner
        image={props.experienceData.image}
        page_id={props.experienceData.id}
        destination={props.experienceData.destination}
        cities={props.experienceData.locations}
        children_cities={props.experienceData.children}
        title={props.experienceData.banner_heading}
        subheading={props.experienceData.banner_text}
        page={"State Page"}
        eventDates={props.eventDates}
      />
      <div className="relative ">
        <div className="absolute -top-10 -z-10 w-full h-[10rem]">
          <Image
            src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/Hearts.png`}
            fill
            className="absolute bottom-0 object-fill"
          />
        </div>
      </div>

      <SetWidthContainer>
        {props.locations && props.locations.length ? (
          <>
            <div className="flex items-center justify-center">
              <H3
                style={{
                  color: "black",
                  margin: !isPageWide
                    ? "auto" //"2.5rem 0.5rem 1.5rem 0.5rem"
                    : "3rem 0 2rem 0",
                  padding: "5px",
                }}
              >
                Explore the World’s Most Romantic Getaways
              </H3>
            </div>
            <HoneymoonPackages />
          </>
        ) : null}

        <WhyChoosePackages />

        <div className="text-center my-6 mt-[4rem] ">
          <h1 className="text-4xl font-bold">
            Crafting Unforgettable Couple Activities
          </h1>
          <p className="text-gray-500 mt-2">
            From intimate moments to thrilling adventures, we design unique
            experiences that bring you closer together <br /> creating memories
            you’ll cherish forever
          </p>
        </div>

        <div className="">
          <div className="my-8">
            <SwiperCarousel
              cards={activities.map((activity, index) => (
                <ActivityCard key={index} {...activity} />
              ))}
              slidesPerView={4}
              spaceBetween={20}
              navigationButtons={true}
              buttonSize={40}
              navButtonBackground="#01202b"
              navButtonColor="#fff"
              navButtonsTop="30%"
            />
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 mt-[4rem]">
        {packages.map((pkg, index) => (
          <FeaturedPackage key={index} {...pkg} />
        ))}
      </div> */}

        <ThemeBannerCards />

        <div className="flex flex-col mb-[4rem]">
          <div className="flex items-center justify-start ">
            <H3
              style={{
                color: "black",
                margin: !isPageWide
                  ? "auto" //"2.5rem 0.5rem 1.5rem 0.5rem"
                  : "3rem 0 2rem 0",
                padding: "5px",
              }}
            >
              The Tarzan Way's Recommendations
            </H3>
          </div>
          <Recommendations />
        </div>

        <div className="relative">
          <div
            className="absolute top-2 -right-20 w-[12rem] h-[16rem] overflow-hidden"
            style={{ transform: "rotate(45deg)" }}
          >
            <Image
              src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/tilted-heart.png`}
              className="object-fill"
              alt="Tilted Hearts"
              height={200}
              width={200}
            />
          </div>
        </div>
        <div className="my-12">
          {/* Title and Description */}
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Stories of Love and Adventure
          </h2>
          <div className="text-center">
            <p className="mt-4 text-center text-gray-600">
              Hear from couples who've turned their dream honeymoons into
              unforgettable memories.
              <br />
              Real stories, real experiences—each one an adventure in love.
            </p>
          </div>

          <div className="mt-8">
            <SwiperCarousel
              slidesPerView={3}
              spaceBetween={20}
              navigationButtons={true}
              cards={testimonials.map((testimonial, index) => (
                <ThemeTestimonial key={index} {...testimonial} />
              ))}
            ></SwiperCarousel>
          </div>
        </div>
        <div classname="mb-5">
          <div className="relative">
            <div
              className="absolute -top-[6rem] w-[18rem] h-[18rem]"
              style={{ transform: "rotate(-12deg)" }}
            >
              <Image
                src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/tilted-heart.png`}
                className="object-fill"
                alt="Tilted Hearts"
                height={200}
                width={200}
              />
            </div>
          </div>

          <ThemeFaqs />
        </div>
      </SetWidthContainer>
    </div>
    </div>
  );
}
