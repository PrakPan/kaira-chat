import { useState, useEffect } from 'react';
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { imgUrlEndPoint } from '../../components/theme/ThemeConstants';

const ImageCarousel = ({ images = [], title = "Gallery Section" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const sampleImages = [
    `${imgUrlEndPoint}media/themes/la tomatina festival/1.jpg`,
    `${imgUrlEndPoint}media/themes/la tomatina festival/2.jpg`,
    `${imgUrlEndPoint}media/themes/la tomatina festival/2126.jpg`,
    `${imgUrlEndPoint}media/themes/la tomatina festival/4.jpg`,
    `${imgUrlEndPoint}media/themes/la tomatina festival/5.jpg`,
    `${imgUrlEndPoint}media/themes/la tomatina festival/la.jpg`,
    `${imgUrlEndPoint}media/themes/la tomatina festival/ll.jpg`,
    `${imgUrlEndPoint}media/themes/la tomatina festival/gg.jpg`,
  ];

  const displayImages = images.length > 0 ? images : sampleImages;
  const slidesToShow = isDesktop ? 4 : 1;

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + slidesToShow >= displayImages.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, displayImages.length - slidesToShow) : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          {title}
        </h2>
        
        {/* Desktop Navigation */}
        {isDesktop && (
          <div className="flex gap-3">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors duration-200"
              disabled={currentIndex === 0}
            >
              <FaChevronCircleLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors duration-200"
              disabled={currentIndex + slidesToShow >= displayImages.length}
            >
              <FaChevronCircleRight className="w-6 h-6 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Desktop Grid Layout */}
        {isDesktop ? (
          <div className="grid grid-cols-4 gap-4 h-96">
            {displayImages.slice(currentIndex, currentIndex + 4).map((image, index) => (
              <ImageCard 
                key={currentIndex + index}
                src={image}
                index={index}
                isDesktop={true}
              />
            ))}
          </div>
        ) : (
          /* Mobile Single Image */
          <div className="relative h-80 overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out h-full"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`
              }}
            >
              {displayImages.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <ImageCard 
                    src={image}
                    index={index}
                    isDesktop={false}
                  />
                </div>
              ))}
            </div>

            {/* Mobile Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
            >
              <FaChevronCircleLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
            >
              <FaChevronCircleRight className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* Mobile Dots Indicator */}
        {!isDesktop && (
          <div className="flex justify-center gap-2 mt-6">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-black' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ImageCard = ({ src, index, isDesktop }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);


  const getDesktopCardClass = () => {
    if (!isDesktop) return "w-full h-full";
    
    switch (index) {
      case 0:
        return "col-span-1 row-span-2"; 
      case 1:
        return "col-span-2 row-span-1"; // Wide top image
      case 2:
        return "col-span-1 row-span-2"; // Tall right image
      case 3:
        return "col-span-2 row-span-1"; // Wide bottom image
      default:
        return "col-span-1 row-span-1";
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gray-200 ${getDesktopCardClass()}`}>
      {!imageError ? (
        <img
          src={src}
          alt={`Gallery image ${index + 1}`}
          className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <span className="text-gray-600 text-lg">Image {index + 1}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse" />
      )}
    </div>
  );
};

export default ImageCarousel;