import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../../ImageLoader';
import Tags from './Tags';
import {GoPrimitiveDot} from 'react-icons/go'
const Container = styled.div`
width: 100%;
display: grid;
grid-template-columns: 45vw auto;
border-radius: 5px;
@media screen and (min-width: 768px){
    
}
`;
const NoImageContainer = styled.div`
width: 100%;
display: grid;
 border-radius: 5px;
 padding: 2vw;
@media screen and (min-width: 768px){
    
}
`;
const ContentContainer = styled.div`
    padding: 0.5rem;
`;
const Name = styled.p`
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0 0;
    text-align: center;
`;
const AmenitiesContainer = styled.div`
    display: flex;
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
                // if(i === 5) break;
                ammenities_arr.push(
                    <Ammenity className='font-opensans'><GoPrimitiveDot style={{marginRight: '3px'}}></GoPrimitiveDot>{props.data.room_facilities[i]}</Ammenity>
                );
            }
            setAmmenities(ammenities_arr)
        }
      }, [props.data]);
      console.log('room', props.data)
      if(props.images.length)
   return(
      <Container className='border-thin'>
            <div style={{padding: '2vw'}}>
            <ImageLoader  fit="contain" url={props.images.length ? props.images[0].ImageUrl: 'media/website/grey.png'} dimensions={{width: 900, height: 900}} dimensionsMobile={{width: 600, height: 600}} width="100%" height="41vw" widthmobile="41vw"  margin="auto"/> 
                           <Name className='font-opensans'>{props.data.room_type}</Name>

            </div>
            <ContentContainer>
                {/* <Name className='font-opensans'>{props.data.room_type}</Name> */}
                {/* <Tags data={props.data}></Tags> */}
                <AmenitiesContainer>
                    {ammenities}            
                </AmenitiesContainer>
            </ContentContainer>
     </Container>
  );
  else return(
    <NoImageContainer className='border-thin'>
            
                 <Name style={{textAlign: 'left'}} className='font-opensans'>{props.data.room_type}</Name>
                 <AmenitiesContainer>
                    {ammenities}            
                </AmenitiesContainer>
      </NoImageContainer>
  )
// else return null;

}

export default RoomType;