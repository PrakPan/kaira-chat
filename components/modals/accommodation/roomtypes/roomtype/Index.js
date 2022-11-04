import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../../ImageLoader';
import Tags from './Tags';
import {GoPrimitiveDot} from 'react-icons/go'
import { getIndianPrice } from '../../../../../services/getIndianPrice';
import Button from '../../../../ui/button/Index';
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
const Cost = styled.p`
font-weight: 800;
font-size: 1rem;
line-height: 1;
margin: 0 0 2px 0;

@media screen and (min-width: 768px) {

    font-size: 1.25rem;
    }
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
      let image = 'media/website/grey.png';
      if(props.images.length){
        for(var i = 0 ; i < props.images.length ; i++){
            if(props.images[i].ImageType === '2'){
                image=props.images[i].ImageUrl;
                break;
            }
        }
      }
      if(true)
   return(
      <Container className='border-thin'>
            <div style={{padding: '2vw'}}>
            <ImageLoader  fit="contain" url={props.images.length ? image: 'media/website/grey.png'} dimensions={{width: 900, height: 900}} dimensionsMobile={{width: 600, height: 600}} width="100%" height="41vw" widthmobile="41vw"  margin="auto"/> 
                           <Name className='font-opensans'>{props.data.room_type}</Name>

            </div>
            <ContentContainer style={{display: 'flex', flexDirection: 'column'}}>
                {/* <Name className='font-opensans'>{props.data.room_type}</Name> */}
                {/* <Tags data={props.data}></Tags> */}
                <div ><AmenitiesContainer>
                    {ammenities  ? ammenities.length ? ammenities.length > 5 ?  ammenities.splice(0,4) : ammenities : null : null}            
                </AmenitiesContainer>
                {ammenities  ? ammenities.length ? ammenities.length > 5 ?  <p style={{fontSize: '0.75rem', marginLeft: '3px', marginTop: '0.5rem', textDecoration: 'underline' , color:  'rgba(91, 89, 89, 1)'}} className="font-opensans">View All</p> : null : null : null}
                </div>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: '1', alignItems : 'flex-end', justifyContent: 'flex-end'}}>
                    <Cost>
                    {"₹ " + getIndianPrice(Math.round(500000/100)) +" /-"}
                    </Cost>
                    <div>
                        <Button onclick={() => console.log('')} bgColor="#f7e700" borderWidth="0" fontSize="0.75rem" padding="0.25rem 1rem" borderRadius="5px" bold margin="0.5rem 0 0 0">Select</Button>
                    </div>
                </div>
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