import React, { useState } from "react";
import styled from "styled-components";
import FullImg from "../../components/FullImage";
import FullImgContent from "./FullImgContent";
import HowItWorks from "../../components/containers/HowItWorksSlideshow";
import media from "../../components/media";
import travelsupportcontent from "../../public/content/travelsupport";
import Logos from "./Logos";
import { ScheduleCallModal } from "./enquiry/Index";
import BannerMobile from "./banner/Mobile";
import WhatWeOffer from "./WhatWeOffer";
import WhyChooseUs from "./WhyChooseUs";
import OurCustomers from "./OurCustomers";
import Faqs from "./Faqs";
import Activities from "./Activities";
import Locations from "./Locations";
import DesktopBanner from "./banner/DesktopBanner";
import SecondaryHeading from "../../components/heading/Secondary";
import HeroSection from "./HeroSection";
import OurCorporatesOffering from "./OurCorporatesOffering";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import { DestinationCard } from "../../components/revamp/common/components/card";
import Carousel3D from "../../components/theme/CurveImageGallery";
import TestimonialCarousel from "../../components/theme/TestimonialCarousel";
import FaqSection from "../../components/revamp/home/FaqSection";
import CtaBoardingSection from "../../components/revamp/home/CtaBoardingSection";
import CorporatePlanning from "./CorporatePlanning";
import TravelerMadeItinerariesSection from "../../components/revamp/home/TravelerMadeItinerariesSection";
import { useRouter } from "next/router";
import axiosbdinstance from "../../services/leads/bd";
import POIDetailsDrawer from "../../components/drawers/poiDetails/POIDetailsDrawer";

const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 80%;
  }
`;

const HowItWorksText = styled.div`
  font-size: 1rem;
  width: 100%;
  margin: 0 0;
  font-weight: 300;

  @media screen and (min-width: 768px) {
    font-size: 1rem;
    margin: 0 0;
    font-weight: 300;
  }
`;

const HowItWorksHeading = styled.p`
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
  @media screen and (min-width: 768px) {
    font-size: 1.25rem;
    margin: 1rem 0 0.5rem 0;
  }
`;

const HowItWorksContainer = styled.div`
  @media screen and (min-width: 768px) {
    margin: auto;
  }
`;

const CardListItem = styled.li`
  font-size: 0.9rem;
  font-weight: 300;
  margin-bottom: 0.9rem;
  line-height: 1.3;
  @media screen and (min-width: 768px) {
    text-align: left;
  }
`;

const HowitWorksHeadingsArr = [
  <HowItWorksHeading className="">Leisure Travel</HowItWorksHeading>,

  <HowItWorksHeading className="">Booking Needs</HowItWorksHeading>,

  <HowItWorksHeading className="">Support & Conferences</HowItWorksHeading>,
];

const HowitWorksContentsArr = [
  <HowItWorksText>
    <CardListItem>
      Workcation to travel, work, and collaborate with all your employees
    </CardListItem>
    <CardListItem>
      Weekend getaways for team building and exploring together
    </CardListItem>
    <CardListItem>
      Unique experiences to instill team bonding with activites
    </CardListItem>
  </HowItWorksText>,

  <HowItWorksText>
    <CardListItem>
      Book flights & hotels at cheap prices for employees
    </CardListItem>
    <CardListItem>
      Track your bookings & get a dedicated travel expert
    </CardListItem>
    <CardListItem>24/7 travel support and booking support</CardListItem>
  </HowItWorksText>,

  <HowItWorksText>
    <CardListItem>
      Townhall meetings with activities during the day
    </CardListItem>
    <CardListItem>
      Travel to an offsite location and meet with the team
    </CardListItem>
    <CardListItem>
      Work offsite for a weekend or week while exploring
    </CardListItem>
  </HowItWorksText>,
];

const AffiliatePage = (props) => {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  let isPageWide = media("(min-width: 768px)");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [companyError, setCompanyError] = useState(null);
  const [personNameError, setPersonNameError] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    contactNumber: "",
    personName: "",
    email: "",
    planningType: [],
  });

  const [selectedCategory, setSelectedCategory] = useState("in_office");

   const [activeDrawer, setActiveDrawer] = useState(null);

  const handleOpenDrawer = (data, type) => {
    setActiveDrawer({ data, type });
  };
  const handleCloseDrawer = () => {
    setActiveDrawer(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const validEmail = validateEmail(formData.email);
    const validPhone = validatePhone(formData.contactNumber);

    if (!validEmail || !validPhone) {
      setLoading(false);
      return;
    }

    if (formData.planningType.length === 0) {
      alert("Please select at least one planning type");
      setLoading(false);
      return;
    }

    axiosbdinstance
      .post("/", {
        organization_name: formData.companyName,
        phone: formData.contactNumber,
        person_name: formData.personName,
        email: formData.email,
        service: "wiejdn",
        datetime: new Date().toISOString(),
        type: formData.planningType.join(", "),
      })
      .then((res) => {
        setLoading(false);
        setFormData({
          companyName: "",
          contactNumber: "",
          email: "",
          personName: "",
          planningType: [],
        });
        setIsModalOpen(false);
        router.push("/corporates/thank-you");
      })
      .catch((err) => {
        setLoading(false);

        if (err?.response?.data?.email) {
          setEmailError(err.response.data.email[0]);
        }

        if (err?.response?.data?.phone) {
          setPhoneError(err.response.data.phone[0]);
        }

        if (err?.response?.data?.organization_name) {
          setCompanyError(err.response.data.organization_name[0]);
        }
        if (err?.response?.data?.person_name) {
          setCompanyError(err.response.data.person_name[0]);
        }
      });
  };

  const handleCheckboxChange = (value) => {
    setFormData((prev) => {
      const currentTypes = prev.planningType;
      if (currentTypes.includes(value)) {
        return {
          ...prev,
          planningType: currentTypes.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          planningType: [...currentTypes, value],
        };
      }
    });
  };

  function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Enter a valid email address.");
      return false;
    }
    setEmailError(null);
    return true;
  }

  function validatePhone(phone) {
    const phonePattern = /^(\+?[0-9]{1,3} ?)?[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      setPhoneError("Enter a valid phone number.");
      return false;
    }
    setPhoneError(null);
    return true;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Define categories with their data
  const categories = [
    {
      id: "in_office",
      label: "In-office Activations",
      title: "In Office Activations",
      description:
        "Bring the excitement to your workspace with dynamic activities that foster creativity, engagement, and team bonding, right within your office walls.",
      data: props.in_office_activities || [],
    },
    {
      id: "corporate_gateways",
      label: "City Offsites",
      title: "Corporate Getaways",
      description:
        "Escape the office and rejuvenate with inspiring retreats designed to recharge teams and fuel fresh ideas in scenic, peaceful locations.",
      data: props.corporate_gateways_activities || [],
    },
    {
      id: "team_outing",
      label: "Events & Conferences",
      title: "Team Outing Activities",
      description:
        "Strengthen bonds and inspire camaraderie with outdoor adventures and customized activities that make teamwork fun and unforgettable.",
      data: props.team_outing_activities || [],
    },
    {
      id: "conference",
      label: "Outstation Offsites",
      title: "Conferences",
      description:
        "Elevate your corporate events with seamless planning and exceptional facilities for conferences that are as engaging as they are productive.",
      data: props.conference_activities || [],
    },
    {
      id: "weekend_excursions",
      label: "Weekend Excursions",
      title: "Weekend Excursions",
      description:
        "Step away from the daily routine with weekend escapes that blend relaxation, adventure, and team connection in unique destinations.",
      data: props.weekend_excursions_activities || [],
    },
    {
      id: "add_on",
      label: "Add On Activities",
      title: "Add On Activities",
      description:
        "Enhance your event experience with curated add-ons, from wellness sessions to team-building games, tailored to enrich and energize your group.",
      data: props.add_on_activities || [],
    },
  ];

  const activeCategory = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="w-full">
      <HeroSection
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        setFormData={setFormData}
        formData={formData}
      />
      <OurCorporatesOffering />

      <TravelerMadeItinerariesSection />

      {/* <Logos></Logos> */}

      {/* <SetWidthContainer className="space-y-[100px]"> */}
      {/* <WhatWeOffer setEnquiryOpen={() => setEnquiryOpen(true)} /> */}
      <div className="w-full bg-white">
        {/* Navigation Tabs */}
        <div className="max-w-[1400px] mx-auto px-4 py-12 mb-2 lg:mb-4">
          <h2 className="text-2xl text-center sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-8 leading-[48px]">
            Explore By Activity Category.
          </h2>

          {/* Tab Navigation */}
          <div className="flex justify-center items-center overflow-x-auto whitespace-nowrap gap-2 mb-8 border-b border-gray-200 no-scrollbar">

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 text-sm md:text-base font-medium transition-all relative ${
                  selectedCategory === category.id
                    ? "text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {category.label}
                {selectedCategory === category.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                )}
              </button>
            ))}
          </div>

          {/* Activity Cards with Swiper */}
          {activeCategory && activeCategory.data.length > 0 && (
            <div className="mt-8 flex flex-col gap-5">
              {/* Swiper Carousel */}
              <div className="relative px-2 sm:px-0">
                <Swiper
                  style={{ height: "auto" }}
                  modules={[Navigation]}
                  spaceBetween={16}
                  slidesPerView={1}
                  navigation={{
                    nextEl: `.swiper-next-${selectedCategory}`,
                    prevEl: `.swiper-prev-${selectedCategory}`,
                    clickable: true,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 1.5,
                      spaceBetween: 16,
                    },
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 4,
                      spaceBetween: 24,
                    },
                  }}
                >
                  {activeCategory.data.map((destination) => (
                    <SwiperSlide key={destination.id}>
                      <div className="w-full px-1">
                        <DestinationCard
                          title={destination.title || destination.name}
                          description={
                            destination.description || destination.tagline || destination.short_description
                          }
                          image={destination.image}
                          rating={destination.rating}
                          one_liner_description={
                            destination?.one_liner_description
                          }
                          reviewCount={destination.user_ratings_total}
                          showImageText={false}
                          height="280px"
                          tags={
                            destination.tags ||
                            (destination.continent
                              ? [destination.continent]
                              : [])
                          }
                          gradientOverlay={destination.gradientOverlay}
                          onClick={() => {
                            handleOpenDrawer(destination, "activity")
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Prev Button */}
                <div className={`swiper-prev-${selectedCategory}`} aria-hidden>
                  <div
                    className="absolute left-3 sm:-left-[0.55rem] z-10"
                    style={{
                      top: "calc(280px / 2)",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="text-white group-hover:text-white text-md transition-colors duration-300 transform"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Next Button */}
                <div className={`swiper-next-${selectedCategory}`} aria-hidden>
                  <div
                    className="absolute right-3 sm:-right-[0.55rem] z-10"
                    style={{
                      top: "calc(280px / 2)",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-white hover:text-white text-md transition-colors duration-300 transform"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-lg px-5 py-2 mx-auto text-black bg-[#f7e700] transition-all"
              >
                Schedule a Callback Now!
              </button>
            </div>
          )}

          {/* Empty State */}
          {activeCategory && activeCategory.data.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No activities available in this category.
              </p>
            </div>
          )}
        </div>
      </div>

      <CorporatePlanning />

      <Carousel3D className="lg:w-[190%]" />
      <TestimonialCarousel />
      <FaqSection />
      <CtaBoardingSection />
      {/* </SetWidthContainer> */}

      <br></br>

      {/* <ScheduleCallModal
        show={enquiryOpen}
        onhide={() => setEnquiryOpen(false)}
      ></ScheduleCallModal> */}

      {isPageWide ? (
        <DesktopBanner onclick={() => setIsModalOpen(true)} />
      ) : (
        <div>
          <BannerMobile
            onclick={() => setIsModalOpen(true)}
            text="Want to craft your own travel experience?"
            buttontext="Start Now"
            color="black"
            buttonbgcolor="#f7e700"
          ></BannerMobile>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[8888] flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 lg:p-8 relative">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setLoading(false);
                }}
                className="absolute top-4 right-4 lg:top-6 lg:right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                Get in touch with our experts
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name *"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                  />
                  {companyError && (
                    <div className="text-red-500 text-sm mt-1">
                      {companyError}
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="personName"
                    placeholder="Contact Person Name *"
                    required
                    value={formData.personName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                  />
                  {personNameError && (
                    <div className="text-red-500 text-sm mt-1">
                      {personNameError}
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder="Contact Number *"
                    required
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                  />
                  {phoneError && (
                    <div className="text-red-500 text-sm mt-1">
                      {phoneError}
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                  />
                  {emailError && (
                    <div className="text-red-500 text-sm mt-1">
                      {emailError}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3 text-sm">
                    What are you planning?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleCheckboxChange("team-outings")}
                      className={`w-full px-4 py-3 rounded-full border-2 text-sm font-medium transition-all ${
                        formData.planningType.includes("team-outings")
                          ? "bg-purple-100 border-purple-500 text-purple-700"
                          : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      Team Outings (Same City/ Outstation)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCheckboxChange("event-conference")}
                      className={`w-full px-4 py-3 rounded-full border-2 text-sm font-medium transition-all ${
                        formData.planningType.includes("event-conference")
                          ? "bg-purple-100 border-purple-500 text-purple-700"
                          : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      Event/Conference (Same City/ Outstation)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCheckboxChange("team-building")}
                      className={`w-full px-4 py-3 rounded-full border-2 text-sm font-medium transition-all ${
                        formData.planningType.includes("team-building")
                          ? "bg-purple-100 border-purple-500 text-purple-700"
                          : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      Team Building Session/In Office activations
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FFD700] text-gray-900 font-semibold py-3 lg:py-4 rounded-lg hover:bg-[#FFC700] transition-colors mt-6 text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Schedule a Callback"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeDrawer?.type === "poi" && (
          <POIDetailsDrawer
            show={true}
            iconId={activeDrawer.data.id}
            handleCloseDrawer={handleCloseDrawer}
            name={activeDrawer.data.name}
            id={activeDrawer.data.id}
            activityData={{
              type: "poi",
              id: activeDrawer.data.id,
            }}
            removeDelete={true}
            removeChange={true}
          />
        )}

        {activeDrawer?.type === "activity" && (
          <POIDetailsDrawer
            show={true}
            ActivityiconId={activeDrawer.data.id}
            handleCloseDrawer={handleCloseDrawer}
            name={activeDrawer.data.name}
            removeDelete={true}
          ></POIDetailsDrawer>
        )}
    </div>
  );
};

export default AffiliatePage;
