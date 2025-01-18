import Image from "next/image";
import React from "react";

const ThemeTestimonial = ({ title, description, name, image, rating }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-[350px] text-ellipsis flex flex-col justify-evenly">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 flex-none">{title}</h3>
        <p className="mt-2 text-sm  text-gray-600 h-auto">
          {description}
        </p>
      </div>
      <div className="mt-6 flex items-center">
        {/* Image Section */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image
            className="rounded-full"
            src={"https://d31aoa0ehgvjdi.cloudfront.net/media/website/IMG-20221231-WA0027.jpg"}
            alt={`${name}'s Testimonial`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        {/* Text Section */}
        <div className="ml-4 flex flex-col justify-center">
          <p className="text-sm font-semibold text-gray-800 mb-0">{"Kartik and Avani"}</p>
          <p className="text-yellow-500">
            {"★".repeat(rating)}{" "}
            <span className="text-gray-400">
              {"☆".repeat(5 - rating)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeTestimonial;
