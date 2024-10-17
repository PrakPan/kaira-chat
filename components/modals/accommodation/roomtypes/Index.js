import React, { useState, useEffect } from "react";
import styled from "styled-components";
import RoomType from "./roomtype/Index";

const Bar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 1rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const Rooms = (props) => {
  const [rooms, setRooms] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(props.data[0].id)

  useEffect(() => {
    let rooms_arr = [];
    if (props.data) {
      for (var i = 0; i < props.data.length; i++) {
        if (props.data[i]?.final_rate) {
          rooms_arr.push(
            <RoomType
              price={props.data[i].final_rate}
              data={props.data[i]}
              selectedRoom={selectedRoom === props.data[i].id}
              setSelectedRoom={setSelectedRoom}
            ></RoomType>
          );
        }
      }
      setRooms(rooms_arr);
    }
  }, []);

  return (
    <div>
      {rooms}
    </div>
  );
};

export default Rooms;
