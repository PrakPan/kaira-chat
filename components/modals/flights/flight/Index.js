import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import media from '../../../media';
import Info from './Info';
// import Gallery from './gallery/Index';
import ImageLoader from '../../../ImageLoader';
import axiosflightlogoinstance from '../../../../services/bookings/FetchAirlineLogo';

const Container = styled.div`
    margin: 0 0 0rem 0;
    border-style: none none solid none;
    border-color: #e4e4e4;
    border-width: 1px;
    border-radius: 0px;
    padding: 1rem; 0

    @media screen and (min-width: 768px) {
        padding: 1rem 0;

    }
`;

const GridContainer = styled.div`
    display: grid; 
    grid-gap: 1rem;
    grid-template-columns: 1fr 5fr;
    grid-gap: 0.25rem;
    @media screen and (min-width: 768px) {

    }

`;

const ImageContainer = styled.div`
    
`;


const Accommodation = (props) => {
   let isPageWide = media('(min-width: 768px)')
  const [showPhotos, setShowPhotos] = useState(false);
  const [images, setImages] = useState([]);
  const [url,setUrl] =useState('media/website/grey.png');
  const closePhotosHandler = () => {
     setImages(null);
    setShowPhotos(false);
    }
  
    useEffect(() => {
      if(props.data)
      if(props.data.FareRules)
          // axiosflightlogoinstance.get('/?airline_code='+props.data.AirlineCode).then( res => {
          //      setUrl(res.data["image"])

          // }
          // )
          setUrl("https://d31aoa0ehgvjdi.cloudfront.net/media/airlines/"+props.data.AirlineCode+".png");
    }, [props.data]);
 //   if(!showPhotos)
  return(
      <Container className='border-thn'>
           <GridContainer>
              <ImageContainer className='cente-div'>
                {/* <ImageLoader width="50%" margin="auto" url={url} dimensions={{width: 300, height: 300}} ></ImageLoader> */}
                <img src={url} onError={() => setUrl("https://d31aoa0ehgvjdi.cloudfront.net/media/airlines/flight.webp")}   style={{width: '2.5rem', height:  '2.5rem', display: 'block', margin: 'auto'}}></img>
                {/* <Gallery images={props.accommodation.images} review_score={props.review_score} review_count={props.review_count}></Gallery> */}
                {props.data ? props.data.Segments?      <div className='font-opensans text-center' style={{fontWeight: '300', fontSize: '0.75rem', margin: '0rem'}}>{props.data.Segments[0][0].Airline.AirlineName}</div>  : null  : null}

                {props.data ? props.data.Segments?      <div className='font-opensans text-center' style={{fontWeight: '300', fontSize: '0.75rem', margin: '0rem'}}>{props.data.Segments[0][0].Airline.AirlineCode + " " + props.data.Segments[0][0].Airline.FlightNumber}</div>  : null : null}

              </ImageContainer>
                <Info itinerary_id={props.itinerary_id} tailored_id={props.tailored_id} data={props.data}  selectedBooking={props.selectedBooking} _updateBookingHandler={props._updateBookingHandler} />
          </GridContainer>
      </Container>
  );
//   else return(
//       <FullScreenGallery images={images} closeGalleryHandler={closePhotosHandler}></FullScreenGallery>
//   )
  

}
 
export default Accommodation;