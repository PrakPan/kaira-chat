import React, { useState } from 'react';

const HotelType = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const items = ['Hostels', 'Cottages', '5 Star', '4 Star'];

  return (
    <div className='flex gap-3'>
      {items.map((item) => (
        <div
          key={item}
          className={`rounded-2xl border-[2px] border-[rgba(236,234,234,1)] shadow-[0px_3px_0px_0px_rgba(240,240,240,1)] text-black px-2 cursor-pointer ${
            selectedItem === item ? 'bg-[rgba(247,231,0,0.3)]' : 'bg-white'
          }`}
          onClick={() => setSelectedItem(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default HotelType;
