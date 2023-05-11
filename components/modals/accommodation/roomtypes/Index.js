import React, { useState , useEffect} from 'react';
import styled from 'styled-components';
import Room from './roomtype/Index'
const Container = styled.div`
display: grid;
grid-gap: 0.5rem;
@media screen and (min-width: 768px){
   
}
`;


const Rooms = (props) => {
    const [rooms, setRooms] = useState(null);
    useEffect(() => {
        let rooms_arr = [];
        if(props.data.rooms_available){
            for(var i=0; i<props.data.rooms_available.length; i++){
                try{
                if(props.data.rooms_available[i].prices.min_price)
                rooms_arr.push(
                    <Room data={props.data.rooms_available[i]} images={props.data.rooms_available[i].images}></Room>
                );
                }catch{

                }
            }
            setRooms(rooms_arr)
        }
      }, [props.data]);
  return(
      <Container>
       {rooms}

            {/* <ImageLoader url={props.image ? props.image: 'media/website/grey.png'} dimensions={{width: 900, height: 900}} dimensionsMobile={{width: 600, height: 600}} width="60%" margin="auto"/>  */}
     </Container>
  );

}

export default Rooms;