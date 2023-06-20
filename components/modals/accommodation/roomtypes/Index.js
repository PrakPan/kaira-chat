import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import RoomType from './roomtype/Index';
const Container = styled.div`

`;
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
  useEffect(() => {
    let rooms_arr = [];
    if (props.data.rooms_available) {
      for (var i = 0; i < props.data.rooms_available.length; i++) {
          if (props.data.rooms_available[i].prices.min_price){
            rooms_arr.push(
              <RoomType
                data={props.data.rooms_available[i]}
                images={props.data.rooms_available[i].images}
              ></RoomType>
            );
          }
      }
      setRooms(rooms_arr);
    }
  }, []);
  return (
    <Container>
      <Bar>{rooms}</Bar>

      {/* <ImageLoader url={props.image ? props.image: 'media/website/grey.png'} dimensions={{width: 900, height: 900}} dimensionsMobile={{width: 600, height: 600}} width="60%" margin="auto"/>  */}
    </Container>
  );
};

export default Rooms;
