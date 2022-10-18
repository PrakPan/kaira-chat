import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../../ImageLoader';
import Tags from './Tags';
import {BsDot} from 'react-icons/bs'
const Container = styled.div`
width: 100%;
display: grid;
grid-template-columns: 2fr 2fr;
border-radius: 5px;
@media screen and (min-width: 768px){
    
}
`;
const ContentContainer = styled.div`
    padding: 0.5rem;
`;
const Name = styled.p`
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
`;
const AmenitiesContainer = styled.div`
    display: flex;
    margin-top: 1rem;
    flex-wrap: wrap;
`;
const Ammenity = styled.div`
    margin-right: 0.5rem;
    font-size: 0.75rem;
`;
const RoomType = (props) => {
    const [ammenities, setAmmenities] = useState(null);
    useEffect(() => {
        let ammenities_arr = [];
        if(props.data.room_facilities){
            for(var i=0; i<props.data.room_facilities.length; i++){
                ammenities_arr.push(
                    <Ammenity className='font-opensans'><BsDot></BsDot>{props.data.room_facilities[i]}</Ammenity>
                );
            }
            setAmmenities(ammenities_arr)
        }
      }, [props.data]);
   return(
      <Container className='border-thin'>
            <ImageLoader  fit="cover" url={props.images.length ? props.images[0].ImageUrl: 'media/website/grey.png'} dimensions={{width: 900, height: 900}} dimensionsMobile={{width: 600, height: 600}} width="100%"  margin="auto"/> 
            <ContentContainer>
                <Name className='font-opensans'>{props.data.room_type}</Name>
                {/* <Tags data={props.data}></Tags> */}
                <AmenitiesContainer>
                    {ammenities}            
                </AmenitiesContainer>
            </ContentContainer>
     </Container>
  );

}

export default RoomType;