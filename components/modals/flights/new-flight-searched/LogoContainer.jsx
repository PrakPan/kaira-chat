import { useState } from "react";
import Image from "next/image";

import SkeletonCard from "../../../ui/SkeletonCard";
import media from "../../../media";

export default function LogoContainer({ data, height, width }) {
  return (
    <div className="flex">
      <Logo src={data?.segments?.[0]?.airline?.code || data?.[0]?.airline?.code} ht={height} wd={width} />
    </div>
  );
}

export const Logo = ({ src, wd, ht }) => {
  let isPageWide = media("(min-width: 768px)");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const defaultWidth = isPageWide ? 64 : 48; 
  const defaultHeight = isPageWide ? 64 : 48; 
  const finalWidth = wd || defaultWidth;
  const finalHeight = ht || defaultHeight;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="relative" style={{ width: finalWidth, height: finalHeight }}>
    
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 z-10">
          <SkeletonCard
            width={`${finalWidth}px`}
            height={`${finalHeight}px`}
            borderRadius="4px" 
          />
        </div>
      )}

      <div
        className="relative"
        style={{
          width: finalWidth,
          height: finalHeight,
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <Image
          alt={`${src} airline logo`}
          src={`https://d31aoa0ehgvjdi.cloudfront.net/media/airlines/${src}.png`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          width={finalWidth}
          height={finalHeight}
          style={{ objectFit: 'contain',overflow: 'hidden' }}
        />
      </div>

      {imageError && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-medium rounded border"
          style={{ width: finalWidth, height: finalHeight }}
        >
          {src?.toUpperCase() || '?'}
        </div>
      )}
    </div>
  );
};