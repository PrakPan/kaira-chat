import React, { useState, useEffect } from "react";

import { dateFormat } from "../../../../helper/DateUtils";
import RoomType from "./roomtype/Index";

const Rooms = (props) => {
  const [rooms, setRooms] = useState(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  
  const handleUpdateBooking = (index) => {
    const recommendation = props.data[index];
    const rates = recommendation.rates.map(rate => {
      return rate.rooms.map(room => ({
        rate_id: rate.id,
        room_id: room.id,
        adults: room.number_of_adults,
        children: room.number_of_children,
        child_ages: room.child_ages || []
      }));
    }).flat(); 
    
    props.updateBooking(recommendation.id, rates)
  }

  useEffect(() => {
    let rooms_arr = [];
    if (props.data) {
      for (var i = 0; i < props.data.length; i++) {
        if (props.data[i]?.total_rate) {
          rooms_arr.push(
            <RoomType
              key={i}
              index={i}
              price={props.data[i].total_rate}
              data={props.data[i]} 
              rates={props.data[i].rates} 
              rooms={getRooms(props.data[i].rates)} 
              handleUpdateBooking={handleUpdateBooking}
              recommendationId={props.data[i].id} 
              isSelected={selectedRecommendation === i}
              setSelectedRecommendation={setSelectedRecommendation}
              checkInDate={dateFormat(props.checkInDate)}
              city={props.city}
              duration={props?.duration}
            />
          );
        }
      }
      setRooms(rooms_arr);
    }
  }, [props.data, selectedRecommendation]); // Added dependencies

  const getRooms = (rates) => {
    if (rates && Array.isArray(rates)) {
      let rooms = [];
      for (const rate of rates) {
        if (rate?.rooms && Array.isArray(rate.rooms)) {
          rooms.push(...rate.rooms);
        }
      }
      return rooms;
    }
    return [];
  }

  return (
    <div className="flex flex-col gap-3">
      {rooms}
    </div>
  );
};

export default Rooms;