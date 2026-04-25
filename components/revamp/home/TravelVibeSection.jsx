import React from "react";
import { TravelVibeCard } from "../common/components/card";
import { useRouter } from "next/router";
import { imgUrlEndPoint } from "../../theme/ThemeConstants";

/* ------------------ Dynamic Image Helpers ------------------ */
const getImageUrl = (key, width, height) => {
  const payload = {
    bucket: "thetarzanway-web",
    key,
    edits: {
      resize: {
        width,
        fit: "cover",
      },
    },
  };
  if (height) payload.edits.resize.height = height;

  return `${imgUrlEndPoint}/${btoa(JSON.stringify(payload))}`;
};

const getSrcSet = (src) =>
  [360, 600, 900].map((w) => `${getImageUrl(src, w)} ${w}w`).join(", ");
/* ------------------------------------------------------------ */

const TravelVibeSection = (props) => {
  // Sample travel vibe data - replace with your actual data
  const router = useRouter();

  const travelVibes = [
    {
      id: 1,
      title: "Honeymoon Trip Planner",
      description: "ROMANTIC ESCAPES",
      image: `${imgUrlEndPoint}media/page/173815280124938845634460449219.jpg`,
      tags: ["TTW Exclusive"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "theme/honeymoon-2025",
    },
    {
      id: 2,
      title: "Road Trips 2025",
      description: "DRIVE DIARIES",
      image: `${imgUrlEndPoint}media/page/174860004456110548973083496094.jpg`,
      tags: ["Trending"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link:"theme/roadtrips-2025"
    },
    {
      id: 3,
      title: "Perfect Proposals",
      description: "SAY YES SPOTS",
      image: `${imgUrlEndPoint}media/page/174120792530050110816955566406.png`,
      tags: ["TTW Exclusive"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link:"theme/perfect-proposals-2026"
    },
    {
      id: 4,
      title: "Japan In Autumn",
      description: "GOLDEN GATEWAYS",
      image: `${imgUrlEndPoint}media/page/176061499439999198913574218750.jpg`,
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "theme/japan-cherry-blossom",
    },
    {
      id: 5,
      title: "Europe Under 1 Lakh",
      description: "BIG TRIPS, SMALL BUDGET",
      image: `${imgUrlEndPoint}media/website/compressedImage (7).jpeg`,
      tags: [],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "theme/europe-under-1-lakh-2025",
    },
  ];

  const getLink = (link) => {
  if (props?.isTheme) {
    return link.replace(/^theme\//, "");
  }
  return link;
};

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-0 sm:px-4 lg:px-8 bg-white">
      <div className="w-full sm:max-w-7xl sm:mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Travel to Match Your Vibe
          </h2>
          <p
            className="text-gray-600 max-w-2xl mx-auto px-2 sm:px-0 text-base"
            style={{ fontSize: "16px" }}
          >
            Find a plan that feels just right — whether you're planning a
            honeymoon, a road trip, or your next solo escape.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 px-2 sm:px-0">
          {/* Top Row - First card spans 2 columns, second card spans 1 column */}
          <div className="lg:col-span-2">
            <TravelVibeCard
              key={travelVibes[0].id}
              title={travelVibes[0].title}
              description={travelVibes[0].description}
              image={travelVibes[0].image}
              tags={travelVibes[0].tags}
              gradientOverlay={travelVibes[0].gradientOverlay}
              height="376px"
              onClick={() => router.push(getLink(travelVibes[0].link))}
            />
          </div>

          <div className="lg:col-span-1">
            <TravelVibeCard
              key={travelVibes[1].id}
              title={travelVibes[1].title}
              description={travelVibes[1].description}
              image={travelVibes[1].image}
              tags={travelVibes[1].tags}
              gradientOverlay={travelVibes[1].gradientOverlay}
              height="376px"
              onClick={() => router.push(getLink(travelVibes[1].link))}
            />
          </div>

          {/* Bottom Row - Three equal cards, each spanning 1 column */}
          <div className="lg:col-span-1">
            <TravelVibeCard
              key={travelVibes[2].id}
              title={travelVibes[2].title}
              description={travelVibes[2].description}
              image={travelVibes[2].image}
              tags={travelVibes[2].tags}
              gradientOverlay={travelVibes[2].gradientOverlay}
              height="376px"
              onClick={() => router.push(getLink(travelVibes[2].link))}
            />
          </div>

          <div className="lg:col-span-1">
            <TravelVibeCard
              key={travelVibes[3].id}
              title={travelVibes[3].title}
              description={travelVibes[3].description}
              image={travelVibes[3].image}
              tags={travelVibes[3].tags}
              gradientOverlay={travelVibes[3].gradientOverlay}
              height="376px"
              onClick={() => router.push(getLink(travelVibes[3].link))}
            />
          </div>

          <div className="lg:col-span-1">
            <TravelVibeCard
              key={travelVibes[4].id}
              title={travelVibes[4].title}
              description={travelVibes[4].description}
              image={travelVibes[4].image}
              tags={travelVibes[4].tags}
              gradientOverlay={travelVibes[4].gradientOverlay}
              height="376px"
              onClick={() => router.push(getLink(travelVibes[4].link))}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelVibeSection;
