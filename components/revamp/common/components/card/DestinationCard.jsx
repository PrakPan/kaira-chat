import React from "react";
import Image from "next/image";
import SkeletonCard from "../../../../ui/SkeletonCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { imgUrlEndPoint } from "../../../../theme/ThemeConstants";
import { AiFillStar } from "react-icons/ai";
import { useRouter } from "next/router";
import { getIndianPrice } from "../../../../../services/getIndianPrice";
import ImageLoader from "../../../../ImageLoader";
const DestinationCard = ({
  title,
  one_liner_description,
  description,
  rating,
  reviewCount,
  image,
  tags = [],
  gradientOverlay = "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
  height = "376px",
  onClick,
  className = "",
  showImageText = true,
  placesBragSection,
  link,
  total_price,
  imageFallback,
  imageSrcSet,
  imageSizes,
  ...props
}) => {
  const router = useRouter();
  const [imgLoaded, setImgLoaded] = React.useState(false);

  const imgSrc = placesBragSection ? image : `${imgUrlEndPoint}${image}`;

  return (
    <div
      onClick={() => {
        if (link) router.push(link);
      }}
      className="w-full"
    >
      {/* dummy load  */}
      <Image
        src={imageFallback || imgSrc || image}
        srcSet={imageSrcSet}        
        sizes={imageSizes}         
        fill
        alt={title}
        className="object-cover"
        onLoad={() => setImgLoaded(true)}
        onLoadingComplete={() => setImgLoaded(true)}
        loading="lazy"
        fetchPriority="low"
        style={{ opacity: 0 }}
        quality={0}
      />


      {/* SKELETON VERSION */}
      {!imgLoaded && (
        <div className="w-full">
          {/* Skeleton Image box */}
          <div className="relative w-full" style={{ height }}>
            <SkeletonCard width="100%" height="100%" borderRadius="16px" variant="wave" isNotAnimate="true" />

            {/* Skeleton Tags */}
            {tags.length > 0 && (
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex gap-2">
                {tags.slice(0, 2).map((_, i) => (
                  <SkeletonCard key={i} width={i === 0 ? "110px" : "85px"} height="32px" borderRadius="50px" />
                ))}
              </div>
            )}

            {/* Skeleton Arrow */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
              <SkeletonCard width="50px" height="50px" borderRadius="50%" />
            </div>

            {/* Skeleton Text */}
            {showImageText && (
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 space-y-2">
                <SkeletonCard width="55%" height="20px" borderRadius="8px" />
                <SkeletonCard width="100%" height="10px" borderRadius="8px" />
                <SkeletonCard width="95%" height="10px" borderRadius="8px" />
                <SkeletonCard width="75%" height="10px" borderRadius="8px" />
              </div>
            )}
          </div>

          {/* Skeleton Price */}
          {total_price && (
            <div className="pt-3">
              <SkeletonCard width="120px" height="24px" borderRadius="8px" />
            </div>
          )}

          {/* Skeleton Rating */}
          {(rating || reviewCount) && !showImageText && (
            <div className="pt-2 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <SkeletonCard key={i} width="16px" height="16px" borderRadius="4px" />
              ))}
              <SkeletonCard width="90px" height="14px" borderRadius="6px" ml="6px" />
            </div>
          )}
        </div>
      )}

      {/* REAL CARD VERSION */}
      {imgLoaded && (
        <div
          className={`relative group cursor-pointer rounded-lg sm:rounded-2xl overflow-hidden w-full ${className}`}
          style={{ height }}
          onClick={onClick}
          {...props}
        >
          <div className="absolute inset-0">
            <picture>
              <source
                srcSet={imageSrcSet}
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
              />
              <img
                src={ imgSrc || image} 
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </picture>
            {/* <Image
              src={imageFallback || imgSrc || image}
              srcSet={imageSrcSet}        // NEW
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onLoad={() => setImgLoaded(true)}
              onLoadingComplete={() => setImgLoaded(true)}
              fetchPriority="low"
            /> */}


            {showImageText && (
              <div className="absolute inset-0" style={{ background: gradientOverlay }} />
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-wrap gap-1 sm:gap-2 z-30">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-[#F2F2F2E5] backdrop-blur-[50px] text-xs sm:text-sm font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Arrow */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-30">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white group-hover:!bg-primary-yellow rounded-full flex items-center justify-center transition-all duration-300 sm:group-hover:scale-110">
              <FontAwesomeIcon icon={faArrowUp} className="text-black text-xs sm:text-sm transform rotate-45" />
            </div>
          </div>

          {/* Text */}
          {showImageText && (
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-30">
              <h3 className="text-white font-semibold mb-2 text-lg sm:text-xl">{title}</h3>
              <p className="text-white/90 text-sm">{one_liner_description || description}</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Content when image text OFF */}
      {imgLoaded && !showImageText && (
        <div className="pt-3 sm:pt-4 bg-white h-auto">
          <h3 className="font-semibold mb-1 text-md text-black">{title}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{one_liner_description || description}</p>

          {/* Rating */}
          {(rating || reviewCount) && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <AiFillStar key={i} className="text-yellow-400 w-4 h-4" />
              ))}
              {reviewCount && (
                <span className="text-sm text-gray-600 ml-1">
                  {rating} ({reviewCount.toLocaleString()})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          {total_price && (
            <div className="flex flex-row items-center text-[20px] font-bold pt-2">
              ₹{getIndianPrice(total_price)}/-
              <span className="text-[12px] font-[400] ml-2">per person</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DestinationCard;
