import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

const testimonials = [
  {
    id: 0,
    name: "Riya & Karan, Delhi",
    title: "An unforgettable honeymoon in Bali!",
    review: "TarzanWay made our Bali trip so personal — from a private villa setup to a surprise candlelight dinner by the beach. Everything felt curated just for us. Couldn’t have asked for a better start to our marriage!",
    image: "/01R.jpg"
  },
  {
    id: 1,
    name: "Tanya, Bangalore",
    title: "Perfect winter escape to Europe",
    review: "I was worried about the visa process, but their team handled it so smoothly! We explored Germany and Austria during Christmas — it truly felt like a fairytale with all the markets and lights.",
    image: "/02R.jpg"
  },
  {
    id: 2,
    name: "Rahul Mehta, Mumbai",
    title: "Incredible service and constant support",
    review: "From the first call to landing back home, the TarzanWay team was just a message away. They even rebooked one of our activities in Vietnam last-minute with zero hassle. That kind of support is rare.",
    image: "/03R.jpg"
  },
  {
    id: 3,
    name: "Isha, Madhya Pradesh",
    title: "Solo trip turned life-changing!",
    review: "I booked a solo trip to Japan — the AI itinerary suggested such offbeat places I’d never have found myself. Met amazing people, had local food tours, and even joined a pottery workshop!",
    image: "/04R.jpg"
  },
  {
    id: 4,
    name: "The Shah Family, Delhi",
    title: "Best family vacation ever",
    review: "We did a 10-day trip to Dubai and Singapore with our kids. Every detail — from hotel selection to kid-friendly activities — was spot-on. It felt like traveling with a planner who knows your family personally.",
    image: "/05R.jpg"
  },
  {
    id: 5,
    name: "Oliver & Grace, Manchester",
    title: "Truly personalized experience",
    review: "I’ve used a few travel platforms before, but TarzanWay’s customisation tool is next-level. They really get your travel style — ours was food + culture, and the itinerary delivered exactly that.",
    image: "/06R.jpg"
  },
  {
    id: 6,
    name: "Priya Menon, Bangalore",
    title: "Kerala was a dream!",
    review: "The houseboat experience was straight out of a movie. The local guide they arranged was so warm and knowledgeable — it felt like exploring with a friend rather than a tour.",
    image: "/07R.jpg"
  },
  {
    id: 7,
    name: "Daniel C, Goa",
    title: "Exceeded expectations — and then some!",
    review: "I planned a last-minute New Year trip through them. The itinerary came together in hours, and everything went perfectly. This is my third trip with TarzanWay, and they keep raising the bar.",
    image: "/08R.jpg"
  }
];


  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleImageClick = (index) => {
    setActiveIndex(index);
  };

  // Get images excluding the active one for side display
  const getDisplayImages = () => {
    return testimonials
      .map((item, index) => ({ ...item, originalIndex: index }))
      .filter((_, index) => index !== activeIndex);
  };

  const displayImages = getDisplayImages();
  const activeTestimonial = testimonials[activeIndex];

  // Split images: 4 left, 4 right
  const leftImages = displayImages.slice(0, 4);
  const rightImages = displayImages.slice(4, 8);

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-2 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl max-sm:text-xl  font-bold text-center mb-12 lg:mb-20 text-gray-900">
          What Our Happy Travelers Say
        </h1>

        <div className="max-ph:hidden">
          <div className="max-w-7xl mx-auto">
            {/* Image arrangement container */}
            <div className="relative flex items-center justify-center mb-16 min-h-[400px] px-8">
              {/* Left side images */}
              <div className="absolute left-8 xl:left-20 top-1/2 -translate-y-1/2">
                {/* Top left */}
                <div
                  onClick={() => handleImageClick(leftImages[0].originalIndex)}
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-110 min-w-max"
                  style={{ top: '-140px', left: '40px' }}
                >
                  <img
                    src={leftImages[0].image}
                    alt={leftImages[0].name}
                    className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>

                {/* Upper middle left */}
                <div
                  onClick={() => handleImageClick(leftImages[1].originalIndex)}
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-110 min-w-max"
                  style={{ top: '-70px', left: '140px' }}
                >
                  <img
                    src={leftImages[1].image}
                    alt={leftImages[1].name}
                    className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>

                {/* Lower middle left */}
                <div
                  onClick={() => handleImageClick(leftImages[2].originalIndex)}
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-110 min-w-max"
                  style={{ top: '50px', left: '0px' }}
                >
                  <img
                    src={leftImages[2].image}
                    alt={leftImages[2].name}
                    className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>

                {/* Bottom left */}
                <div
                  onClick={() => handleImageClick(leftImages[3].originalIndex)}
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-110 min-w-max"
                  style={{ top: '130px', left: '100px' }}
                >
                  <img
                    src={leftImages[3].image}
                    alt={leftImages[3].name}
                    className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>
              </div>

              {/* Center - Active large image */}
              <div className="flex-shrink-0 w-64 h-64 object-cover rounded-full border-8 shadow-2xl z-10 border-[#8DC046]">
                <div>
                <img
                  src={activeTestimonial.image}
                  alt={activeTestimonial.name}
                  className="flex-shrink-0 w-60 h-60 object-cover rounded-full border-8 shadow-2xl z-10 border-[#fff]"
                />
                </div>
              </div>

              {/* Right side images */}
              <div className="absolute right-8 xl:right-20 top-1/2 -translate-y-1/2">
                {/* Top right */}
                <div
                  onClick={() => handleImageClick(rightImages[0].originalIndex)}
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-110 min-w-max"
                  style={{ top: '-140px', right: '40px' }}
                >
                  <img
                    src={rightImages[0].image}
                    alt={rightImages[0].name}
                    className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>

                {/* Upper middle right */}
                <div
                  onClick={() => handleImageClick(rightImages[1].originalIndex)}
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-110 min-w-max"
                  style={{ top: '-70px', right: '140px' }}
                >
                  <img
                    src={rightImages[1].image}
                    alt={rightImages[1].name}
                    className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>

                {/* Lower middle right */}
                <div
                  onClick={() => handleImageClick(rightImages[2].originalIndex)}
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-110 min-w-max"
                  style={{ top: '50px', right: '0px' }}
                >
                  <img
                    src={rightImages[2].image}
                    alt={rightImages[2].name}
                    className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>

                {/* Bottom right */}
                {/* <div
                  onClick={() => handleImageClick(rightImages[3].originalIndex)}
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-110"
                  style={{ top: '130px', right: '100px' }}
                >
                  <img
                    src={rightImages[3].image}
                    alt={rightImages[3].name}
                    className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div> */}
              </div>
            </div>

            {/* Review section - Desktop */}
            <div className="text-center max-w-3xl mx-auto px-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {activeTestimonial.title}
              </h3>
              <div className='flex gap-5'>
                 <button
                  onClick={handlePrev}
                  className="text-black"
                  aria-label="Next review"
                >
                  <FiChevronLeft size={24} />
                </button>

              <p className="text-gray-600 text-base leading-relaxed mb-4">
                "{activeTestimonial.review}"
              </p>
               <button
                  onClick={handleNext}
                  className="text-black"
                  aria-label="Next review"
                >
                  <FiChevronRight size={24} />
                </button>
              </div>
              <p className="text-lg font-bold text-gray-900 mb-6">
                - {activeTestimonial.name}
              </p>


              {/* Navigation Buttons */}
              <div className="flex justify-center items-center gap-4">
                

               
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
       <div className="block md:hidden">

          <div className="flex flex-col items-center">
            {/* Top row of small images */}
            <div className="flex justify-center gap-4 mb-6">
              {displayImages.slice(0, 2).map((testimonial) => (
                <div
                  key={testimonial.id}
                  onClick={() => handleImageClick(testimonial.originalIndex)}
                  className="cursor-pointer transition-all duration-300 hover:scale-110"
                >
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>
              ))}
            </div>

            {/* Center large image with side images */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 w-full px-4">
              {/* Left side images */}
              <div className="flex flex-col gap-4">
                {displayImages.slice(2, 4).map((testimonial) => (
                  <div
                    key={testimonial.id}
                    onClick={() => handleImageClick(testimonial.originalIndex)}
                    className="cursor-pointer transition-all duration-300 hover:scale-110"
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                ))}
              </div>

              {/* Center active image */}
              <div className="flex-shrink-0">
                <img
                  src={activeTestimonial.image}
                  alt={activeTestimonial.name}
                  className="w-44 h-44 sm:w-56 sm:h-56 object-cover rounded-full border-8 border-green-400 shadow-2xl"
                />
              </div>

              {/* Right side images */}
              <div className="flex flex-col gap-4">
                {displayImages.slice(4, 6).map((testimonial) => (
                  <div
                    key={testimonial.id}
                    onClick={() => handleImageClick(testimonial.originalIndex)}
                    className="cursor-pointer transition-all duration-300 hover:scale-110"
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom row */}
            {displayImages.length > 6 && (
              <div className="flex justify-center gap-4 mb-8 text-md">
                {displayImages.slice(6).map((testimonial) => (
                  <div
                    key={testimonial.id}
                    onClick={() => handleImageClick(testimonial.originalIndex)}
                    className="cursor-pointer transition-all duration-300 hover:scale-110"
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Review section - Mobile */}
            <div className="text-center px-4 max-w-2xl">
              
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
                "{activeTestimonial.review}"
              </p>
             
              <div className='flex gap-3 items-center justify-center'>
                <button
                  onClick={handlePrev}
                  className="text-black"
                  aria-label="Next review"
                >
                  <FiChevronLeft size={20} />
                </button>
              <p className="text-lg sm:text-md font-bold text-gray-900">
                {activeTestimonial.name}
              </p>
               <button
                  onClick={handleNext}
                  className="text-black"
                  aria-label="Next review"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>

              {/* Navigation */}
              {/* <div className="flex justify-center items-center gap-4"> */}
                

                {/* <div className="flex gap-1.5">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeIndex === index
                          ? 'bg-green-500 w-6'
                          : 'bg-gray-300 w-2'
                      }`}
                      aria-label={`Go to review ${index + 1}`}
                    />
                  ))}
                </div> */}

                
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;