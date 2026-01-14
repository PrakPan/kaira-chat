import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const defaultTestimonials = [
  {
    id: 0,
    name: "Riya & Karan, Delhi",
    heading: "An unforgettable honeymoon in Bali!",
    text: "TarzanWay made our Bali trip so personal — from a private villa setup to a surprise candlelight dinner by the beach. Everything felt curated just for us. Couldn’t have asked for a better start to our marriage!",
    image: "/01R.jpg",
  },
  {
    id: 1,
    name: "Tanya, Bangalore",
    heading: "Perfect winter escape to Europe",
    text: "I was worried about the visa process, but their team handled it so smoothly! We explored Germany and Austria during Christmas — it truly felt like a fairytale with all the markets and lights.",
    image: "/winterr.jpg",
  },
  {
    id: 2,
    name: "Rahul Mehta, Mumbai",
    heading: "Incredible service and constant support",
    text: "From the first call to landing back home, the TarzanWay team was just a message away. They even rebooked one of our activities in Vietnam last-minute with zero hassle. That kind of support is rare.",
    image: "/03R.jpg",
  },
  {
    id: 3,
    name: "Isha, Madhya Pradesh",
    heading: "Solo trip turned life-changing!",
    text: "I booked a solo trip to Japan — the AI itinerary suggested such offbeat places I’d never have found myself. Met amazing people, had local food tours, and even joined a pottery workshop!",
    image: "/04R.jpg",
  },
  {
    id: 4,
    name: "The Shah Family, Delhi",
    heading: "Best family vacation ever",
    text: "We did a 10-day trip to Dubai and Singapore with our kids. Every detail — from hotel selection to kid-friendly activities — was spot-on. It felt like traveling with a planner who knows your family personally.",
    image: "/05R.jpg",
  },
  {
    id: 5,
    name: "Oliver & Grace, Manchester",
    heading: "Truly personalized experience",
    text: "I’ve used a few travel platforms before, but TarzanWay’s customisation tool is next-level. They really get your travel style — ours was food + culture, and the itinerary delivered exactly that.",
    image: "/truly.jpg",
  },
  {
    id: 6,
    name: "Priya Menon, Bangalore",
    heading: "Kerala was a dream!",
    text: "The houseboat experience was straight out of a movie. The local guide they arranged was so warm and knowledgeable — it felt like exploring with a friend rather than a tour.",
    image: "/kerala.jpg",
  },
  {
    id: 7,
    name: "Daniel C, Goa",
    heading: "Exceeded expectations — and then some!",
    text: "I planned a last-minute New Year trip through them. The itinerary came together in hours, and everything went perfectly. This is my third trip with TarzanWay, and they keep raising the bar.",
    image: "/08R.jpg",
  },
];

const generateSidePositions = (count, side = "left") => {
  const positions = [];
  const spacing = 70;
  const startTop = -140;

  for (let i = 0; i < count; i++) {
    const top = startTop + i * spacing;
    const size = i % 2 === 1 ? 90 : 80;
    if (side === "left") {
      const left = 40 + (i % 2) * 100;
      positions.push({ top: `${top}px`, left: `${left}px`, size });
    } else {
      const right = 40 + (i % 2) * 100;
      positions.push({ top: `${top}px`, right: `${right}px`, size });
    }
  }

  return positions;
};

const TestimonialCarousel = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(
    props?.reviews ? props.reviews : defaultTestimonials
  );
  const [imageErrors, setImageErrors] = useState({});

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleImageClick = (index) => {
    setActiveIndex(index);
  };

  // Helper functions
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(",")[0].trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-teal-500",
    ];
    const index = name ? name.length % colors.length : 0;
    return colors[index];
  };

  const handleImageError = (imageId) => {
    setImageErrors((prev) => ({ ...prev, [imageId]: true }));
  };

  // ImageWithFallback component
  const ImageWithFallback = ({
    src,
    alt,
    className,
    style,
    onClick,
    imageId,
  }) => {
    const hasError = imageErrors[imageId];
    const hasValidSrc = src && src !== "null" && !src.includes("null");

    return (
      <>
        {!hasError && hasValidSrc ? (
          <img
            src={src}
            alt={alt}
            className={className}
            style={style}
            onClick={onClick}
            onError={() => handleImageError(imageId)}
          />
        ) : (
          <div
            className={`${className} ${getAvatarColor(
              alt
            )} flex items-center justify-center text-white font-bold cursor-pointer`}
            style={style}
            onClick={onClick}
          >
            <span
              style={{
                fontSize: style?.width
                  ? `${parseInt(style.width) * 0.4}px`
                  : "24px",
              }}
            >
              {getInitials(alt)}
            </span>
          </div>
        )}
      </>
    );
  };

  const sideImages = testimonials
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter((_, index) => index !== activeIndex);

  const leftImages = sideImages.filter((_, i) => i % 2 === 0);
  const rightImages = sideImages.filter((_, i) => i % 2 === 1);

  const leftPositions = generateSidePositions(leftImages.length, "left");
  const rightPositions = generateSidePositions(rightImages.length, "right");

  const activeTestimonial = testimonials[activeIndex];

  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

  return (
    <div className="min-h-[80vh] bg-white py-8 px-4 sm:px-2 lg:px-8 max-ph:!p-0 max-ph:min-h-[70vh]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        {!props?.headingNotVisible && (
          <h1 className="text-3xl max-sm:text-xl font-bold text-center mb-12 lg:mb-20 text-gray-900">
            What Our Happy Travelers Say
          </h1>
        )}

        <div className="max-ph:hidden">
          <div className="max-w-7xl mx-auto">
            {/* Image arrangement container */}
            <div className="relative flex items-center justify-center mb-16 min-h-[400px] px-8">
              {/* Left side images */}
              <div className="absolute left-8 xl:left-20 top-1/2 -translate-y-1/2 w-full">
                {leftImages.map((img, i) => {
                  const pos = leftPositions[i];
                  return (
                    <div
                      key={img.id}
                      className="absolute cursor-pointer transition-all duration-300 hover:scale-110"
                      style={pos}
                    >
                      <ImageWithFallback
                        src={
                          props.reviews
                            ? `${imgUrlEndPoint}${img.image}`
                            : img.image
                        }
                        alt={img.name}
                        style={{
                          width: `${pos.size}px`,
                          height: `${pos.size}px`,
                        }}
                        className="object-cover rounded-full border-4 border-white shadow-lg"
                        onClick={() => handleImageClick(img.originalIndex)}
                        imageId={`left-${img.id}`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Center - Active large image */}
              <div className="flex items-center justify-center flex-shrink-0 w-64 h-64 rounded-full shadow-2xl z-10 border-[#8DC046] border-[4px]">
                <ImageWithFallback
                  src={
                    props.reviews
                      ? `${imgUrlEndPoint}${activeTestimonial.image}`
                      : activeTestimonial.image
                  }
                  alt={activeTestimonial.name}
                  className="flex-shrink-0 w-60 h-60 object-cover rounded-full border-8 shadow-2xl z-10 border-[#fff]"
                  imageId={`center-${activeTestimonial.id}`}
                />
              </div>

              {/* Right side images */}
              <div className="absolute right-8 xl:right-20 top-1/2 -translate-y-1/2 w-full">
                {rightImages.map((img, i) => {
                  const pos = rightPositions[i];
                  return (
                    <div
                      key={img.id}
                      className="absolute cursor-pointer transition-all duration-300 hover:scale-110"
                      style={pos}
                    >
                      <ImageWithFallback
                        src={
                          props.reviews
                            ? `${imgUrlEndPoint}${img.image}`
                            : img.image
                        }
                        alt={img.name}
                        style={{
                          width: `${pos.size}px`,
                          height: `${pos.size}px`,
                        }}
                        className="object-cover rounded-full border-4 border-white shadow-lg"
                        onClick={() => handleImageClick(img.originalIndex)}
                        imageId={`right-${img.id}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review section - Desktop */}
            <div className="text-center max-w-3xl mx-auto px-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {activeTestimonial.heading}
              </h3>
              <div className="flex gap-5">
                <button
                  onClick={handlePrev}
                  className="text-black"
                  aria-label="Previous review"
                >
                  <FiChevronLeft size={24} />
                </button>

                <p className="text-gray-600 text-base leading-relaxed mb-4">
                  "{activeTestimonial.text}"
                </p>
                <button
                  onClick={handleNext}
                  className="text-black"
                  aria-label="Next review"
                >
                  <FiChevronRight size={24} />
                </button>
              </div>
              <p className="text-base font-bold text-gray-900 mb-6">
                - {activeTestimonial.name}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="block md:hidden">
          {/* Container for circular image arrangement */}
          <div className="relative flex justify-center items-center min-h-[300px] mb-8">
            {/* Side images arranged in a circle around center */}
            {sideImages.map((img, i) => {
              const angle = (i / sideImages.length) * 2 * Math.PI;
              const radius = 128;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);

              return (
                <div
                  key={img.id}
                  onClick={() => handleImageClick(img.originalIndex)}
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-110"
                  style={{
                    top: `calc(50% + ${y}px)`,
                    left: `calc(50% + ${x}px)`,
                    transform: "translate(-50%, -50%)",
                    width: "56px", // Fixed width
                    height: "56px", // Fixed height
                  }}
                >
                  <ImageWithFallback
                    src={
                      props.reviews
                        ? `${imgUrlEndPoint}${img.image}`
                        : img.image
                    }
                    alt={img.name}
                    style={{ width: "56px", height: "56px" }} // Explicit size
                    className="object-cover rounded-full border-4 border-white shadow-lg"
                    imageId={`mobile-side-${img.id}`}
                  />
                </div>
              );
            })}

            {/* Center active image */}
            <div className="z-10" style={{ width: "128px", height: "128px" }}>
              <ImageWithFallback
                src={
                  props.reviews
                    ? `${imgUrlEndPoint}${activeTestimonial.image}`
                    : activeTestimonial.image
                }
                alt={activeTestimonial.name}
                style={{ width: "128px", height: "128px" }} // Explicit size
                className="object-cover rounded-full border-4 border-[#8DC046] shadow-2xl"
                imageId={`mobile-center-${activeTestimonial.id}`}
              />
            </div>
          </div>

          {/* Review text and navigation - Now separate from image container */}
          <div className="flex flex-col items-center px-4 text-center w-full mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {activeTestimonial.heading}
            </h3>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
              "{activeTestimonial.text}"
            </p>

            <div className="flex gap-3 items-center justify-center">
              <button
                onClick={handlePrev}
                className="text-black p-2"
                aria-label="Previous review"
              >
                <FiChevronLeft size={20} />
              </button>

              <p className="text-base sm:text-lg font-bold text-gray-900">
                {activeTestimonial.name}
              </p>

              <button
                onClick={handleNext}
                className="text-black p-2"
                aria-label="Next review"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
