import React from "react";
import Flickity from "./Flickity/Index";

const FullImgContent = (props) => {
  const data = [
    {
      heading: "Sandeep Morey, Senior Lead HR, TEG Analytics",
      text: "Tarzan Way has helped us for more than 5 offsite workation bookings all over India and we can trust them with all our corporate retreats and bookings, the best part is they take care of all the bookings of flights, hotels, and activities smoothly",
    },
    {
      heading: "Siddhant Beri, Asst. Manager Data Analytics, PwC",
      text: "Our corporate retreats could not have been better, The Tarzan Way helped us with curating team-building activities and making sure we get the most out of our weekend away. Highly recommended for companies looking for a vacation with employees.",
    },
    {
      heading: "Rakesh Dhiman, SAMA",
      text: "We planned our Kashmir trip with The Tarzan Way and everything for the trip went smoothly. The on-ground coordinator Mr. Hyder was helpful and knew everything about the location. We saved almost 15% of our budget while planning with them",
    },
    {
      heading: "Mayank Jain, Physics Wallah",
      text: "The Tarzan Way has made travel booking for us a lot easier. We need 1000+ flight & hotel bookings every week for our company and The Tarzan Way has always offered the best price and booked everything on time seamlessly.",
    },
  ];
  return (
    <div className="font-lexend">
      <Flickity data={data}></Flickity>
    </div>
  );
};

export default FullImgContent;
