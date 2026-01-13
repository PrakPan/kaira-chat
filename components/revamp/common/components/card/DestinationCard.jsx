import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { imgUrlEndPoint } from "../../../../theme/ThemeConstants";
import { AiFillStar } from "react-icons/ai";
import { useRouter } from "next/router";
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
  ...props
}) => {
  const router = useRouter();

  const [imageQuality, setImageQuality] = useState(100);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      if (img.width > 400 || img.height > 500) { // very large images
        setImageQuality(75);
      } else {
        setImageQuality(100);
      }
    };
  }, [image]);
  // console.log("tags in destination card:",one_liner_description,showImageText)
  return (
    <div onClick={() => {
      if (link) {
        router.push(link);
      }
    }} className="w-full">
      <div
        className={`relative group cursor-pointer rounded-lg sm:rounded-2xl overflow-hidden w-full ${className}`}
        style={{ height }}
        onClick={onClick}
        {...props}
      >
        {/* Background Image with Next.js Image */}
        <div className="absolute inset-0">
          <Image
            src={placesBragSection ? image : `${imgUrlEndPoint}${image}` || image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading={"lazy"}
            quality={75} // fixed quality, no extra fetch needed
            placeholder="blur"
          />
          {/* Gradient Overlay */}
          {showImageText && (
            <div
              className="absolute inset-0"
              style={{
                background: gradientOverlay,
              }}
            />
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-wrap gap-1 sm:gap-2">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 bg-[#F2F2F2E5] backdrop-blur-sm text-black text-xs sm:text-sm font-medium rounded-full border border-white/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Arrow Icon */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white backdrop-blur-sm border border-white/30 group-hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:group-hover:scale-110">
            <FontAwesomeIcon
              icon={faArrowUp}
              className="text-black group-hover:text-black text-xs sm:text-sm transition-colors duration-300 transform rotate-45"
            />
          </div>
        </div>

        {/* Content */}
        {showImageText && (
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
            <h3 className="text-white font-semibold mb-2 text-lg sm:text-xl">
              {title}
            </h3>
            <p className="text-white/90 leading-relaxed text-sm">
              {one_liner_description || description}
            </p>
          </div>
        )}




        {/* Hover Effect Overlay removed (no hover) */}
      </div>

      {showImageText === false && (
        <div className="pt-3 sm:pt-4" style={{ backgroundColor: 'white', minHeight: '80px' }}>
          <h3 className="text-gray-900 font-semibold mb-1 text-base text-md" style={{ color: '#000' }}>
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2" style={{ color: '#666' }}>
            {one_liner_description || description}
          </p>

          {/* Rating Section */}
          {(rating || reviewCount) ? (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <AiFillStar
                  key={index}
                  style={{ width: '16px', height: '16px', color: '#FBBF24' }}
                />
              ))}
              {reviewCount ? (
                <span className="text-gray-600 text-sm ml-1" style={{ color: '#666' }}>
                  {rating} ({reviewCount.toLocaleString()})
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </div>

  );
};

export default DestinationCard;
