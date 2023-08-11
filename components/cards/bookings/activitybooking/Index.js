import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
 import { getHumanDate } from '../../../../services/getHumanDate';

  
import ImageContainer from './imagecontainer/Index';
 import media from '../../../media';
 import SectionOne from './SectionOne';
 import SectionTwo from './SectionTwo';
 import SectionThree from './SectionThree';
 import SectionFour from './SectionFour';
 const Container = styled.div`
    width: 100%;        
    background-color: white;
     border-radius: 10px;
    display: flex;
    flex-flow: column;
    height: 100%;
    @media screen and (min-width: 768px){
        border-radius: 10px;
        position: relative;

    }
`;

 
 

const Detail = styled.p`
    font-size: 0.75rem;
    margin: 0 0 0.25rem 0;
    font-weight: 300;
`;
 
 
const Booking = (props) => {     
    
     let roomsJSX = [];
     useEffect(() => {
       if (props.type === "Accommodation")
         for (var i = 0; i < props.rooms.length; i++) {
           if (props.rooms[i].number_of_rooms)
             roomsJSX.push(
               <Detail key={i} className="font-lexend">
                 {props.rooms[i].room_type
                   ? props.rooms[i].number_of_rooms +
                     " x " +
                     props.rooms[i].room_type
                   : props.rooms[i].number_of_rooms + " x Private Room"}
               </Detail>
             );
           else
             roomsJSX.push(
               <Detail key={i} className="font-lexend">
                 {props.rooms[i].room_type
                   ? props.rooms[i].room_type
                   : "Private Room"}
               </Detail>
             );
         }
     }, [props.rooms]);
    
    let imagesarr = []
    if(props.images)
     for(var i =0 ; i < props.images.length; i++){
        imagesarr.push(props.images[i].image)
    }
    let mealplan = "";
     if(props.price_type === "EP" ) mealplan="Room Only";
    else if(props.price_type === "CP" ) mealplan="Breakfast Included";
    else if(props.price_type === "MAP" ) mealplan="Breakfast and Lunch / Dinner included";
    else if(props.price_type === "AP" ) mealplan="Breakfast, Lunch and Dinner Included";
const getDate = (date) => {
    let year = date.substring(0,4)
    let month = date.substring(5,7);
    let day = date.substring(8,10);
    return(getHumanDate(day+"/"+month+"/"+year) + " " + year);

}
    
     return(
        <div style={{height: 'max-content'}}>
            <div style={{margin: '0 0 1rem 0', fontSize: '18px'}} className='font-lexend'><b>{props.data ? props.data.city ? props.data.city : '' : ''}</b>{props.data ? props.data.duration ? " - "+props.data.duration + " night(s) stay": '' : ''}</div>
        <Container className='border' style={{borderRadius: "10px"}}>
            <ImageContainer star_category={props.data.star_category} images={props.data.images} are_prices_hidden={props.are_prices_hidden} _setImagesHandler={props.setImagesHandler}  setShowBookingModal={props.setShowBookingModal} setImagesHandler={props.setImagesHandler}></ImageContainer>
            <div  style={{padding: "",   flex: '1 1 auto', display:  'flex', flexFlow: 'column'}}>
                <div   style={{padding: "",   flex: '1 1 auto', display:  'flex', flexFlow: 'column', height: '100%'}} >
                    {/* {props.type === "Accommodation" && props.rating &&  color!=='red'? <RatingContainer style={{backgroundColor: color, lineHeight: '1'}}>
                        <FontAwesomeIcon icon={faStar} style={{fontSize: '0.75rem', margin: '0 0.25rem 0 0', color: 'white'}}/>
                        {props.rating ? props.rating + " / 5" : RANDOM_RATING[Math.floor(Math.random() * 10)]}
                    </RatingContainer> : null} */}
                    <SectionOne data={props.data}  ></SectionOne>
                    <SectionTwo  is_registration_needed={props.is_registration_needed}  isDatePresent={props.isDatePresent} data={props.data}></SectionTwo>
                    <SectionThree  is_registration_needed={props.is_registration_needed} are_prices_hidden={props.are_prices_hidden} setShowLoginModal={props.setShowLoginModal} token={props.token}  _deselectBookingHandler={props._deselectActivityBookingHandler} data={props.data}  is_selecting={props.is_selecting}></SectionThree>
                    {!props.is_registration_needed ? <SectionFour setShowBookingModal={props.setShowBookingModal}></SectionFour> : null}
                    {/* {props.type === "Accommodation" ? 
                    <div>
                        {props.check_in ? <Detail  className='font-lexend'>{ 'Check in: ' + getDate(props.check_in)}</Detail>:null}
                        {props.check_out ? <Detail  className='font-lexend'>{ 'Check out: ' + getDate(props.check_out) }</Detail>:null}

                        {RoomsJSX}
                        {props.plan?  
                            <div style={{fontSize: '0.75rem', marginBottom: '0.25rem'}}>
                            <FontAwesomeIcon icon={faMale} style={{marginRight: '0.25rem'}}></FontAwesomeIcon>
                            <p className='font-lexend' style={{marginRight: '1rem', display: 'inline', fontWeight: '100'}}>{props.plan.number_of_adults}</p>
                            <FontAwesomeIcon icon={faChild} style={{marginRight: '0.25rem'}}></FontAwesomeIcon>
                            <p className='font-lexend' style={{marginRight: '1rem', display: 'inline', fontWeight: '100'}}>{props.plan.number_of_children}</p>
                            <FontAwesomeIcon icon={faBaby} style={{marginRight: '0.25rem'}}></FontAwesomeIcon>
                        <p className='font-lexend' style={{marginRight: '1rem', display: 'inline', fontWeight: '100'}}>{props.plan.number_of_infants}</p>
                        </div>    : null}
                        <Detail  className='font-lexend'>{mealplan}</Detail>
                        <FontAwesomeIcon icon={faWifi} style={{fontSize: '0.75rem', fontWeight: '300'}}></FontAwesomeIcon>
                        </div>
                 : detailsarr.length ?  <ul style={{padding: '0', marginLeft: '0.5rem'}}>{detailsarr}</ul> : null} */}

                {/* {!props.experience ? <ButtonContainer>
                {props.is_selected? 
                <Selected className='font-lexend'>
                    <BsCheckLg style={{fontSize: '0.75rem', marginRight: '0.25rem'}}></BsCheckLg>
                    Selected</Selected> : 
                    <Select className='font-lexend' onClick={_handleTaxiSelection}>
                        {props.cardUpdateLoading === props.booking_id ? <Spinner display="inline" size={12} margin="0 0.25rem 0 0"></Spinner> : <AiOutlinePlus style={{fontSize: '1rem', marginRight: '0.25rem'}}></AiOutlinePlus>}
                        Select</Select>
                        }
                 {!props.is_stock && props.type=="Accommodation"? <Button boxShadow onclick={props.setShowBookingModal} onclickparams={null} fontSizeDesktop="0.75rem" borderRadius="2rem" borderWidth='1px' padding="0.25rem 1rem" hoverBgColor="black" hoverBorderColor="black" hoverColor='white'>Change</Button> : null}
            </ButtonContainer>: null} */}
                    </div>
            </div>
         
        </Container>
        </div>
    );
 
}

export default  (Booking);