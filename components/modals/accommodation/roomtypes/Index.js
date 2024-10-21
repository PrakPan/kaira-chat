import React, { useState, useEffect } from "react";
import RoomType from "./roomtype/Index";


const Rooms = (props) => {
  const [rooms, setRooms] = useState(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  const handleUpdateBooking = (index) => {
    props.updateBooking(props.data[index].rates, props.data[index].id)
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
              data={props.data[i].rates[0]}
              rooms={getRooms(props.data[i].rates)}
              handleUpdateBooking={handleUpdateBooking}
              selectedRecommendation={selectedRecommendation && selectedRecommendation === i}
              setSelectedRecommendation={setSelectedRecommendation}
            ></RoomType>
          );
        }
      }
      setRooms(rooms_arr);
    }
  }, []);

  const getRooms = (rates) => {
    if (rates) {
      let rooms = [];
      for (const rate of rates) {
        rooms.push(...rate?.rooms)
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
