import { useState, useEffect } from 'react';
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { imgUrlEndPoint } from '../../components/theme/ThemeConstants';



const ImageCarousel = ({ slug, images = [], title = "The Gallery Section" }) => {
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

  let sampleImages = [];



  if(slug == "la-tomatina-spain-2025"){
    sampleImages = [
      `${imgUrlEndPoint}media/themes/la tomatina festival/1.jpg`,
      `${imgUrlEndPoint}media/themes/la tomatina festival/2.jpg`,
      `${imgUrlEndPoint}media/themes/la tomatina festival/2126.jpg`,
      `${imgUrlEndPoint}media/themes/la tomatina festival/4.jpg`,
      `${imgUrlEndPoint}media/themes/la tomatina festival/5.jpg`,
      `${imgUrlEndPoint}media/themes/la tomatina festival/la.jpg`,
      `${imgUrlEndPoint}media/themes/la tomatina festival/ll.jpg`,
      `${imgUrlEndPoint}media/themes/la tomatina festival/gg.jpg`,
    ];
  }

  if(slug == "japan-in-autumn-2025"){
    sampleImages = [
      `${imgUrlEndPoint}media/themes/Yukata or kimono rental + cultural photo walk web.png`,
      `${imgUrlEndPoint}media/themes/Traditional tea ceremony under maple trees web.png`,
      `${imgUrlEndPoint}media/themes/Guided foliage walks with a local web.png`,
      `${imgUrlEndPoint}media/themes/fuji five lakes web.png`,
      `${imgUrlEndPoint}media/themes/kanazawa web.png`,
      `${imgUrlEndPoint}media/themes/Onsen stays in fall mountain towns web.png`,
      `${imgUrlEndPoint}media/themes/nikko web.png`,
      `${imgUrlEndPoint}media/themes/kyoto web.png`,
    ];
  }

  const displayImages = images.length > 0 ? images : sampleImages;
  const slidesToShow = 4; 


  const canGoNext = currentIndex + slidesToShow < displayImages.length;
  const canGoPrev = currentIndex > 0;

  const nextSlide = () => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goToSlide = (pageIndex) => {
    setCurrentIndex(pageIndex * 4);
  };

  const totalPages = Math.ceil(displayImages.length / 4);
  const currentPage = Math.floor(currentIndex / 4);



return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        
        <div className="flex gap-3">
          <button
            onClick={prevSlide}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              canGoPrev 
                ? 'bg-gray-300 hover:bg-gray-400 cursor-pointer' 
                : 'bg-gray-200 cursor-not-allowed opacity-50'
            }`}
            disabled={!canGoPrev}
          >
            <FaChevronCircleLeft className={`w-6 h-6 ${canGoPrev ? 'text-gray-700' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={nextSlide}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              canGoNext 
                ? 'bg-black hover:bg-gray-800 cursor-pointer' 
                : 'bg-gray-400 cursor-not-allowed opacity-50'
            }`}
            disabled={!canGoNext}
          >
            <FaChevronCircleRight className={`w-6 h-6 ${canGoNext ? 'text-white' : 'text-gray-300'}`} />
          </button>
        </div>
      </div>

      <div className="relative">
        {isDesktop ? (
          <div className="grid grid-cols-4 grid-rows-2 gap-4 h-96">
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
          <div className="grid grid-cols-2 gap-3 h-80">
            <div className="flex flex-col gap-3">
              <ImageCard 
                key={currentIndex}
                src={displayImages[currentIndex]}
                index={0}
                isDesktop={false}
                mobilePosition="left-top"
              />
              <ImageCard 
                key={currentIndex + 1}
                src={displayImages[currentIndex + 1]}
                index={1}
                isDesktop={false}
                mobilePosition="left-bottom"
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <ImageCard 
                key={currentIndex + 2}
                src={displayImages[currentIndex + 2]}
                index={2}
                isDesktop={false}
                mobilePosition="right-top"
              />
              <ImageCard 
                key={currentIndex + 3}
                src={displayImages[currentIndex + 3]}
                index={3}
                isDesktop={false}
                mobilePosition="right-bottom"
              />
            </div>
          </div>
        )}

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => goToSlide(pageIndex)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentPage === pageIndex 
                  ? 'bg-yellow-500 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ImageCard = ({ src, index, isDesktop, mobilePosition }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getCardClass = () => {
    if (isDesktop) {
      switch (index) {
        case 0:
          return "col-span-1 row-span-2"; // Tall left
        case 1:
          return "col-span-2 row-span-1"; // Wide top
        case 2:
          return "col-span-1 row-span-2"; // Tall right
        case 3:
          return "col-span-2 row-span-1"; // Wide bottom
        default:
          return "col-span-1 row-span-1";
      }
    } else {
      if (mobilePosition === "right-top") {
        return "h-3/5";
      } else if (mobilePosition === "right-bottom") {
        return "h-2/5"; 
      } else {
        return "h-1/2"; 
      }
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gray-200 ${getCardClass()}`}>
      {!imageError ? (
        <img
          src={src}
          alt={`Gallery image ${index + 1}`}
          className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 cursor-pointer ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center">
          <span className="text-red-600 text-sm font-semibold">Festival</span>
        </div>
      )}

      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse" />
      )}

      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300" />
    </div>
  );
};

export default ImageCarousel;