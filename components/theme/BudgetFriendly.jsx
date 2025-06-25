import { FaBed, FaTrain, FaBus, FaMapPin, FaCompass } from 'react-icons/fa';
import media from "../media";

const BudgetFriendly = () => {
  const features = [
    {
      title: "Stay Smart",
      description: "Handpicked basic hotels or hostels in affordable yet vibrant cities.",
      icon: <FaBed className="w-6 h-6 text-indigo-500" />,
      emoji: "🏨"
    },
    {
      title: "Easy Transfers",
      description: "Train & bus journeys to explore multiple destinations smoothly.",
      icon: <FaTrain className="w-6 h-6 text-emerald-500" />,
      emoji: "🚆"
    },
    {
      title: "Local Travel Made Easy",
      description: "Hop-on-hop-off buses and city transport passes.",
      icon: <FaBus className="w-6 h-6 text-amber-500" />,
      emoji: "🚌"
    },
    {
      title: "Experiences That Matter", 
      description: "Walking tours, river cruises, and must-visit attractions based on your interests.",
      icon: <FaMapPin className="w-6 h-6 text-rose-500" />,
      emoji: "🗺️"
    },
    // {
    //   title: "Self-Drive Options",
    //   description: "Road trips in stunning locations, customized to your preference.",
    //   icon: <FaCompass className="w-6 h-6 text-blue-500" />,
    //   emoji: "🚗"
    // }
  ];
  
  let isPageWide = media("(min-width: 768px)");
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto flex justify-center">
        <div className="md:hidden space-y-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-lg overflow-hidden p-6"
            >
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="ml-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-700">
                {feature.description} 
              </p>
            </div>
          ))}
        </div>

        {isPageWide && 
        <div className="md:flex flex-wrap py-4 gap-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex-shrink-0 w-full md:w-[17rem] lg:w-[14rem] xl:w-[16rem] items-center mb-6"
          >
            <div className="flex items-center mb-4">
              <div className="bg-gray-50 p-3 rounded-full">
                {feature.icon}
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">{feature.title}</h3>
            </div>
            <p className="text-sm text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
        }
      </div>
    </div>
  );
};

export default BudgetFriendly;