import { useState, useEffect } from "react";

const CityNavigation = (props) => {
  const [activeCity, setActiveCity] = useState(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-15% 0px -100% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cityId = entry.target.getAttribute("data-city-id");
          setActiveCity(cityId);
        }
      });
    }, options);

    // Observe all city sections
    Object.values(props.cityRefs.current).forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToCity = (cityId) => {
    const element = props.cityRefs.current[cityId];
    if (!element) return;

    // Add a negative margin to account for the offset
    element.style.scrollMargin = "90px";
    element.scrollIntoView({ behavior: "smooth" });
  };

  console.log("CITIES",props?.cities);

  return (
    <div className="sticky top-11 z-50 pt-1 flex flex-row flex-wrap items-center gap-2 bg-white overflow-auto hide-scrollbar">
      {props.cities.map((city) => (
        <div
          key={city.id}
          onClick={() => scrollToCity(city.id)}
          className={`${
            activeCity === city.id && "bg-black text-[#F7E700]"
          } font-normal text-nowrap border-2 border-gray-300 rounded-lg py-1 px-4 hover:bg-black hover:text-[#F7E700] cursor-pointer transition-all`}
        >
          {city.name} ({city.duration}N)
        </div>
      ))}
    </div>
  );
};

export default CityNavigation;
