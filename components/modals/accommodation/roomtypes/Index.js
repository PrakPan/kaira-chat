import React, { useState, useEffect } from "react";
import RoomType from "./roomtype/Index";

const Rooms = (props) => {
  const [rooms, setRooms] = useState(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const handleUpdateBooking = (index) => {
    const rates = props.data[index].rates.map((rate) => {
      return {
        rate_id: rate.id,
        room_id: rate.rooms[0].id,
        adults: rate.rooms[0].number_of_adults,
        child_ages: [],
      };
    });
    props.updateBooking(props.data[index].id, rates);
  };

  useEffect(() => {
    let rooms_arr = [];
    if (props.data) {
      for (var i = 0; i < props.data.length; i++) {
        if (props.data[i]?.final_rate) {
          rooms_arr.push(
            <RoomType
              currentBooking={props?.currentBooking}
              key={i}
              index={i}
              price={props.data[i].final_rate}
              data={props.data[i]}
              rooms={getRooms(props.data[i])}
              handleUpdateBooking={handleUpdateBooking}
              selectedRecommendation={
                selectedRecommendation && selectedRecommendation === i
              }
              setSelectedRecommendation={setSelectedRecommendation}
              checkInDate={props.check_in?.date}
              city={props.city}
              duration={props?.duration}
              cancellationPolicy={props?.cancellationPolicy}
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
      // for (const rate of rates) {
      rooms.push(...rates?.rooms);
      // }
      return rooms;
    }
    return [];
  };

  return <div className="flex flex-col gap-3">{rooms}</div>;
};

export default Rooms;
