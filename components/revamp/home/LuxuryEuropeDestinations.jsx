import { useRef,useState } from "react";
import { DestinationCard } from "../common/components/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { imgUrlEndPoint } from "../../theme/ThemeConstants";
import Button from "../common/components/button";
import Link from "next/link";
import TailoredFormMobileModal from "../../modals/TailoredFomrMobile";


const getImageUrl = (key, width, height) => {
  let payload = {
    bucket: "thetarzanway-web",
    key,
    edits: {
      resize: {
        width,
        fit: "cover",
      },
    },
  };
  if (height) {
    payload.edits.resize['height'] = height
  }

  return `${imgUrlEndPoint}/${btoa(JSON.stringify(payload))}`;
};
const getSrcSet = (src) =>
  [360, 400, 600, 800].map((w) => `${getImageUrl(src, w)} ${w}w`).join(", ");

const LuxuryEuropeDestinations = () => {
  const destinations = [
    {
      id: 1,
      title: "France",
      description:
        "Journey through a land of iconic landmarks, world-class cuisine, and timeless romance that will captivate all of your senses.",
      tags: [
        "Adventure and Outdoors",
        "Spiritual",
        "Nature and Retreat",
        "Art and Culture",
        "Hidden Gem",
        "Very Popular",
      ],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "europe/france",
      image: `media/website/france.jpg`,
    },
    {
      id: 2,
      title: "Italy",
      description:
        "Immerse yourself in a land where timeless art, rich history, and exquisite cuisine create an eternal allure of passion and beauty.",
      tags: [
        "Historical Landmark",
        "Cultural Heartbeat",
        "Culinary Hub",
        "Artistic Soul",
      ],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "europe/italy",
      image: `media/countries/168441961093255019187927246094.jpg`,
    },
    {
      id: 3,
      title: "Spain",
      description:
        "Immerse yourself in a vibrant tapestry of passionate dance, stunning architecture, and lively streets that embody Spain's fiery soul.",
      tags: [
        "Cultural Heartbeat",
        "Lively & Vibrant",
        "Architectural Wonder",
        "Artistic Soul",
      ],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "europe/spain",
      image: `media/countries/175344481739372777938842773438.jpg`,
    },
    {
      id: 4,
      title: "Finland",
      description:
        "Escape to a land of serene lakes, enchanting forests, and the magical glow of the Northern Lights.",
      tags: [
        "Nature's Paradise",
        "Peaceful & Serene",
        "Winter Wonderland",
        "Offbeat Wonder",
      ],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "europe/finland",
      image: `media/countries/168442263137298607826232910156.jpg`,
    },
    {
      id: 5,
      title: "Singapore",
      description:
        "Discover a dynamic city where futuristic skyline, lush gardens, and vibrant multiculturalism ignite your senses and inspire wonder.",
      tags: ["Adventure and Outdoors", "Art and Culture", "Shopping"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "asia/singapore",
      image: `media/cities/170359716563205981254577636719.jpg`,
    },
    {
      id: 6,
      title: "Prague",
      description:
        "Welcome to Prague, the city that has captured the heart of many travellers for centuries!",
      tags: [
        "Adventure and Outdoors",
        "spiritual",
        "Nature and Retreat",
        "Heritage",
        "Art and Culture",
        "Hidden Gem",
        "Very Popular",
        "Romantic",
      ],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "asia/indonesia/bali",
      image: `media/cities/168553058279981160163879394531.jpeg`,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [showMoiblePlanner,setShowMobilePlanner] = useState(false)
  const swiperRef = useRef(null);

  const handleSwiper = (swiper) => {
    swiperRef.current = swiper;
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-0 sm:px-4 lg:px-8 bg-white">
      <div className="w-full sm:max-w-7xl sm:mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
            Elevating Luxury Across Europe
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto px-2 sm:px-0 text-base">
            Discover iconic cities, elite resorts, and unforgettable experiences
            crafted for discerning travelers.
          </p>
        </div>

        {/* Destinations Slider */}
        <div className="relative px-2 sm:px-0">
          <Swiper
            style={{ height: "376px" }}
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            onSwiper={handleSwiper}
            preloadImages={false}
            lazy={{ loadPrevNext: true }}
            navigation={{
              nextEl: ".fullslider-n",
              prevEl: ".fullslider-p",
              clickable: true,
            }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
            {destinations.map((destination) => (
              <SwiperSlide key={destination.id}>
                <DestinationCard
                  placesBragSection={true}
                  title={destination.title}
                  description={destination.description}
                  image={destination.image}
                  imageSrcSet={getSrcSet(destination.image)}
                  imageSizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
                  imageFallback={getImageUrl(destination.image, 410, 376)}
                  tags={destination.tags}
                  link={destination.link}
                  gradientOverlay={destination.gradientOverlay}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Prev Button */}
          <div className="fullslider-p" aria-hidden>
            <div
              aria-label="Previous destinations"
              className="absolute -left-3 sm:left-2 top-1/2 -translate-y-1/2 z-10 p-1"
            >
              <div className="w-10 h-10 bg-[#01202B] backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-white text-md transition-colors duration-300 transform w-full"
                />
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="fullslider-n" aria-hidden>
            <div
              aria-label="Next destinations"
              className="absolute -right-3 sm:right-2 top-1/2 -translate-y-1/2 z-10 p-1"
            >
              <div className="w-10 h-10 bg-[#01202B] backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-white transition-colors duration-300 transform"
                />
              </div>
            </div>
          </div>
        </div>

       <div className=" flex items-center justify-center mt-8 lg:mt-10">
                {/* <Link href="/new-trip"> */}
                  <Button
                    variant="filled"
                    size="medium"
                    onClick={() => {
                      setShowMobilePlanner(true);
                    }}
                    className="!bg-primary-indigo !border-primary-indigo !text-white hover:!bg-primary-indigo/90 !font-medium !text-base !px-6 !py-3 !rounded-lg"
                  >
                    + Create a Trip Now!
                  </Button>
                {/* </Link> */}
              </div>
      </div>
      <TailoredFormMobileModal
        destinationType={"city-planner"}
        onHide={() => {
          setShowMobilePlanner(false);
          // closeTailoredModal(router);
        }}
        show={showMoiblePlanner}
      />

    </section>
  );
};

export default LuxuryEuropeDestinations;
