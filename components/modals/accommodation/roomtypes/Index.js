import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import RoomType from './roomtype/Index';
const Container = styled.div`
  display: grid;

  @media screen and (min-width: 768px) {
  }
`;
const Bar = styled.div`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-x: scroll;
  width: 100%;
`;
const Rooms = (props) => {
  const [rooms, setRooms] = useState(null);
  useEffect(() => {
    let rooms_arr = [];
    if (props.data.rooms_available) {
      for (var i = 0; i < props.data.rooms_available.length; i++) {
        try {
          if (props.data.rooms_available[i].prices.min_price)
            rooms_arr.push(
              <RoomType
                data={props.data.rooms_available[i]}
                images={props.data.rooms_available[i].images}
              ></RoomType>
            );
        } catch {}
      }
      setRooms(rooms_arr);
    }
  }, [props.data]);
  return (
    <Container>
      <div className="font-semibold lg:text-3xl text-xl text-black mb-2 lg:mb-4">
        Rooms
      </div>
      <Bar className="flex w-full flex-row ">{rooms}</Bar>

      {/* <ImageLoader url={props.image ? props.image: 'media/website/grey.png'} dimensions={{width: 900, height: 900}} dimensionsMobile={{width: 600, height: 600}} width="60%" margin="auto"/>  */}
    </Container>
  );
};

export default Rooms;
