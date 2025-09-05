import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Using v5 solid icons; substituted newer naming with closest v5 equivalents
import {
  faHeart,
  faShieldAlt,
  faMapMarkerAlt,
  faMagic,
  faTasks,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";

/*
  WhatMakesUsSection
  Centered circular Japan image with six floating icon pills around it and two columns of feature copy.
*/
const featuresLeft = [
  {
    icon: faHeart,
    title: "Tailored by AI,\nPerfected by People.",
    desc: "Crafted by AI, perfected by locals — your journey reflects your mood, preferences, and real on-ground hacks.",
  },
  {
    icon: faMapMarkerAlt,
    title: "Routed & Ready.",
    desc: "Timings sorted, transitions smooth. From hotel check-ins to sunset spots — every day flows like clockwork.",
  },
  {
    icon: faMagic,
    title: "Your Signature Moment.",
    desc: "One surprise activity or curated experience — our little way of making your trip unforgettable.",
  },
];

const featuresRight = [
  {
    icon: faShieldAlt,
    title: "All-Cover Shield.",
    desc: "From travel insurance tips to emergency contacts, we've got your back — before, during, and after your trip.",
  },
  {
    icon: faHeadset,
    title: "In Your Pocket.",
    desc: "24×7 Concierge. Flight delayed? Can't find your cab? Need a café nearby? We're one message away, any time, any day.",
  },
  {
    icon: faTasks,
    title: "Plan B, Always Ready.",
    desc: "If something changes last minute, don't worry — you'll always have an alternate plan ready to go.",
  },
];

const IconPill = ({ icon, className }) => (
  <div
    className={`w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-primary-indigo text-xl ${className}`}
  >
    <FontAwesomeIcon icon={icon} />
  </div>
);

export default function WhatMakesUsSection() {
  // Attempt to locate a Japan related image. Fallback to a placeholder if not found.
  const japanImg = "/assets/icons/test.jpeg"; // TODO: replace with actual Japan image path when available
  return (
    <section className="w-full bg-white py-16 px-4 md:px-10 lg:px-20 font-inter">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-primary-indigo mb-14">
        What Makes Us Wander-ful.
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center max-w-[1320px] mx-auto">
        {/* Left copy */}
        <div
          className="flex flex-col justify-center pr-8"
          style={{ height: "616px" }}
        >
          <div className="space-y-12">
            {featuresLeft.map((f) => (
              <div key={f.title} className="max-w-sm">
                <h3 className="font-semibold text-sm md:text-base tracking-wide text-primary-indigo whitespace-pre-line">
                  {f.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-text-default">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Center visual */}
        <div className="relative flex justify-center">
          <div
            className="relative rounded-full overflow-hidden"
            style={{ width: "432px", height: "560px" }}
          >
            <Image
              src={japanImg}
              alt="Traveler in Japan overlooking lake and cliffs"
              fill
              className="object-cover"
            />
          </div>

          {/* Floating pills */}
          <IconPill
            icon={faHeart}
            className="absolute -top-4 left-1/2 -translate-x-1/2"
          />
          <IconPill icon={faShieldAlt} className="absolute top-1/4 -right-4" />
          <IconPill icon={faHeadset} className="absolute bottom-1/3 -right-6" />
          <IconPill
            icon={faTasks}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2"
          />
          <IconPill icon={faMagic} className="absolute bottom-1/3 -left-6" />
          <IconPill
            icon={faMapMarkerAlt}
            className="absolute top-1/4 -left-4"
          />
        </div>

        {/* Right copy */}
        <div
          className="flex flex-col justify-center pl-8"
          style={{ height: "616px" }}
        >
          <div className="space-y-12">
            {featuresRight.map((f) => (
              <div key={f.title} className="max-w-sm">
                <h3 className="font-semibold text-sm md:text-base tracking-wide text-primary-indigo">
                  {f.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-text-default">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
