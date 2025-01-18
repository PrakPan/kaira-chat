import React from "react";

const FeaturedPackage = ({ image, title, duration }) => {
    return (
      <div className="relative rounded-lg overflow-hidden shadow-md">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-yellow-400 px-2 py-1 text-sm font-semibold rounded">
          {duration}
        </div>
        <div className="p-4 bg-white">
          <h3 className="font-bold text-xl">{title}</h3>
        </div>
      </div>
    );
  };
  
  export default FeaturedPackage;
  