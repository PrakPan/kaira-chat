import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faStar, faImages, faWifi, faMale, faBaby, faChild} from '@fortawesome/free-solid-svg-icons';
import ImageLoader  from '../../ImageLoader';
import right from '../../../public/assets/right-arrow-flight.png';
import ImageContainer from './imagecontainer/Index';
// import Button from '../../Button';
// import Button from "../../ui/button/Index"
import { getHumanTime } from '../../../services/getHumanTime';
import { getHumanDate } from '../../../services/getHumanDate';
import {BsCheckLg} from 'react-icons/bs';
import {BiPlus} from 'react-icons/bi';
import Button from '../../ui/button/Index'
import axiosflightlogoinstance from '../../../services/bookings/FetchAirlineLogo';
import media from '../../media'
const Container = styled.div`
    width: 100%;        

    background-color: white;
    border-radius: 10px;
    @media screen and (min-width: 768px){
        border-radius: 10px;
        position: relative;
    }
    
`;




 
 
const ButtonContainer = styled.div`
    position: absolute;
    display: flex;
    bottom: 0.5rem;
    gap: 0.25rem;
    right: 0.5rem;
`;
const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 5fr;
`;
const LogoContainer   = styled.div`

`;
const DetailsGridContainer = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
margin-bottom: 4rem;
grid-gap: 0.25rem;
`;
const Selected = styled.div`
 border-radius: 2rem;
border-width: 1px;
padding:0.25rem 1rem;
background-color: #f7e700;

@media screen and (min-width: 768px){
    font-size: 0.75rem;
     &:hover{

     }
}


`;
 const Select = styled.div`
 border: 1px solid black;
 border-radius: 2rem;
 padding:0.25rem 1rem;
 box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
 @media screen and (min-width: 768px){
    font-size: 0.75rem;
     &:hover{
        background-color: black;
        color: white;
        cursor: pointer;
     }
 
 `;
const getTime = (datetime) => {
    return(getHumanTime(datetime.substring(11,16)));
}
const getDate = (datetime) => {
    let date = datetime.substring(0,10);
    let year = date.substring(0,4)
    let month = date.substring(5,7);
    let day = date.substring(8,10)
     let actualdate = (date.slice(5)+"-"+date.substring(0,4)).replaceAll('-','/') + " "+ date.substring(0,4)
    return(getHumanDate(day+"/"+month+"/"+year) + " " + year);
}
const  minuteToHours = (n) => {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return  rhours + " h " + rminutes + " m";
    }
const Booking = (props) =>{
    let isPageWide = media('(min-width: 768px)')

    // let date = new Date(props.data.check_in)
      const [url, setUrl] = useState('media/website/grey.png')
    useEffect(() => {
        if(props.data.costings_breakdown)
        if(props.data.costings_breakdown.Segments)
            // axiosflightlogoinstance.get('/?airline_code='+props.data.costings_breakdown.Segments[0][0].Airline.AirlineCode).then( res => {
            //      setUrl(res.data["image"])

            // }
            setUrl("https://d31aoa0ehgvjdi.cloudfront.net/media/airlines/"+props.data.costings_breakdown.Segments[0][0].Airline.AirlineCode+".png")
            
      }, [props.data]);
   
  
    if(true)
    return(
        <Container className="border-thin" style={{borderColor: props.is_selected ? "#f7e700" : '#e4e4e4', borderWidth: '2px'}}>
            <ImageContainer getTime={getTime} getDate={getDate} data={props.data} tag={props.tag} are_prices_hidden={props.are_prices_hidden} _setImagesHandler={props.setImagesHandler} check_in={props.check_in} check_out={props.check_out} city={props.city} price={props.price} type={props.type} setShowBookingModal={props.setShowBookingModal} heading={props.heading} details={props.details} blur={props.blur} images={props.images} setImagesHandler={props.setImagesHandler}></ImageContainer>
            <div>
                {/* <Accordion> */}
                <div style={{padding: "0.5rem", height: '100%'}}>
                    {/* {props.type === "Accommodation" && props.rating &&  color!=='red'? <RatingContainer style={{backgroundColor: color}}>
                        <FontAwesomeIcon icon={faStar} style={{fontSize: '0.75rem', margin: '0 0.25rem 0 0', color: 'white'}}/>
                        {props.rating ? Math.round(props.rating * 10) / 10+ " / 10" : RANDOM_RATING[Math.floor(Math.random() * 10)]}
                    </RatingContainer> : null} */}
                    {/* <Heading className="font-opensans">Details</Heading> */}
                    <GridContainer>
                        <LogoContainer>
                                {/* <ImageLoader
                                url={url}
                                dimensions={{width: 200, heght: 200}}
                                width="70%"
                                >
                                
                                </ImageLoader> */}
                                 {props.data.costings_breakdown? props.data.costings_breakdown.Segments?  
                                <img onError={() => setUrl("https://d31aoa0ehgvjdi.cloudfront.net/media/airlines/flight.webp")} width={"40px"}  alt="airline logo" height={"40px"} src={url}></img>
                                    :null : null }
                                {props.data.costings_breakdown? props.data.costings_breakdown.Segments?     <div className='font-opensans text-center' style={{fontWeight: '300', fontSize: '0.75rem', margin: '0rem'}}>{props.data.costings_breakdown.Segments[0][0].Airline.AirlineCode + " " + props.data.costings_breakdown.Segments[0][0].Airline.FlightNumber}</div> : null : null}
                        </LogoContainer>
                        <DetailsGridContainer>
                            <div style={{display: 'flex', gap: '0.25rem'}}>
                                {props.data.check_in ? <div style={{ margin: '0', fontWeight: '700' , fontSize: '0.85rem'}} className='font-opensans'>{getTime(props.data.check_in)}</div>: <div></div>}
                                {props.data.origin_city_iata_code? <div style={{ margin: '0', fontWeight: '300', fontSize: '0.85rem'}} className='font-opensans'>{"("+props.data.origin_city_iata_code+")"}</div>  : null}
                            </div>
                            <div style={{margin: '0'}}>
                                <img  height='1rem' src={right} style={{height: '1.25rem', width: '100%', margin: 'auto', display: 'block'}}></img>
                            </div>
                            <div style={{display: 'flex', gap: '0.25rem'}}>
                                {props.data.check_out ? <div style={{ margin: '0', fontWeight: '700' , fontSize: '0.85rem'}} className='font-opensans'>{getTime(props.data.check_out)}</div> : <div></div>}
                                {props.data.destination_city_iata_code? <div style={{ margin: '0', fontWeight: '300', fontSize: '0.85rem'}} className='font-opensans'>{"("+props.data.destination_city_iata_code+")"}</div> : null}
                            </div>
                            <div>
                                {props.data.check_in ? <div className='font-opensans' style={{fontSize: '0.75rem', fontWeight: '300'}}>{getDate(props.data.check_in)}</div> : <div></div>}
                                {props.data.costings_breakdown? props.data.costings_breakdown.Segments ? props.data.costings_breakdown.Segments[0][0].Origin.Airport.Terminal !=="" ?  <div className='font-opensans' style={{fontSize: '0.75rem', fontWeight: '300'}}>{"Terminal "+props.data.costings_breakdown.Segments[0][0].Origin.Airport.Terminal}</div> : null : null : null}
                            </div>
                            <div >
                            {props.data.costings_breakdown ? props.data.costings_breakdown.Segments ? props.data.costings_breakdown.Segments[0].length > 1 ? <div className='font-opensans text-center' style={{fontSize: '0.55rem', fontWeight: '300'}}>{'via '+props.data.costings_breakdown.Segments[0][1].Origin.Airport.CityName}</div> : null: null : null}
                            {props.data.costings_breakdown ? props.data.costings_breakdown.Segments?  props.data.costings_breakdown.Segments[0].length > 1 ? <div className='font-opensans text-center' style={{fontSize: '0.55rem', fontWeight: '300'}}>{minuteToHours(props.data.costings_breakdown.Segments[0][1].GroundTime)}</div> : null : null : null}


                            </div>
                            <div>
                                {props.data.check_out ? <div className='font-opensans' style={{fontSize: '0.75rem', fontWeight: '300'}}>{getDate(props.data.check_out)}</div> : <div></div>}
                                {props.data.costings_breakdown ? props.data.costings_breakdown.Segments?  props.data.costings_breakdown.Segments[0].length ?  props.data.costings_breakdown.Segments[0][props.data.costings_breakdown.Segments[0].length-1].Destination.Airport.Terminal !=="" ?  <div className='font-opensans' style={{fontSize: '0.75rem', fontWeight: '300'}}>{"Terminal "+props.data.costings_breakdown.Segments[0][props.data.costings_breakdown.Segments[0].length-1].Destination.Airport.Terminal}</div> : null : null : null : null}
                            </div>
                        </DetailsGridContainer>
                    </GridContainer>

                    <ButtonContainer>
                    {props.is_selected? 
                <Selected className='font-opensans'>
                    <BsCheckLg style={{fontSize: '0.75rem', marginRight: '0.25rem'}}></BsCheckLg>
                    Selected</Selected> : !props.is_stock ?
                    <Select className='font-opensans'>
                        <BiPlus style={{fontSize: '1rem', marginRight: '0.25rem', marginTop: '-0.1rem'}}></BiPlus>
                        Select</Select> : null}
                {!props.is_stock && isPageWide? <Button boxShadow onclick={props.setShowFlightModal} onclickparams={null} fontSizeDesktop="0.75rem" borderRadius="2rem" borderWidth='1px' padding="0.25rem 1rem" hoverBgColor="#f7e700" hoverBorderColor="#f7e700" hoverColor='black'>Change</Button> : null}
            </ButtonContainer>
                    </div>
            {/* </Accordion> */}
            </div>
        </Container>
    );
    
   
}

export default React.memo(Booking);