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
    let roomCounter = 0; 
    
    if (props.data) {
      for (var i = 0; i < props.data.length; i++) {
        // if (props.data[i]?.final_rate) {
          const currentRooms = getRooms(props.data[i]);
          
          rooms_arr.push(
            <RoomType
              currentBooking={props?.currentBooking}
              key={i}
              index={roomCounter} 
              price={props.data[i].final_rate}
              data={props.data[i]}
              rooms={currentRooms}
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
          
          roomCounter += currentRooms.length;
        // }
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

  return (<><div className="flex flex-col gap-3">{rooms} <div>
                  {props?.cancellationPolicy && (
                    <div
                      className="text-[14px]"
                      dangerouslySetInnerHTML={{
                        __html: props?.cancellationPolicy,
                      }}
                    ></div>
                  )}
          </div></div></>)
};

export default Rooms;