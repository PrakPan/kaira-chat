const ItineraryOverview = (props) => {
  const details = [
    {
      title: "Destination",
      value: "France",
    },
    {
      title: "Type of travel",
      value: "Romantic",
    },
    {
      title: "Traveller type",
      value: "Couple",
    },
    {
      title: "Budget range",
      value: "₹30,000 - ₹60,000 per night",
    },
    {
      title: "Date of travelling (6 days)",
      value: "Feb 03,2023 - Feb 09,2023",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="text-[36px] font-semibold">
        Romantic Getaway to France{" "}
      </div>
      <div className="flex items-center gap-4 md:gap-5 overflow-auto hide-scrollbar">
        {details.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 text-[14px] text-nowrap"
          >
            <div className="text-[#7A7A7A] text-nowrap">{item.title}</div>
            <div className="font-medium">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryOverview;
