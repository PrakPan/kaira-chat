import React from 'react';
 import styled from 'styled-components';
import media from '../../../media'; 
 import Button from '../../../ui/button/Index';
import ImageLoader from '../../../ImageLoader';
import {IoStarSharp} from 'react-icons/io5';
import { getHumanDate } from '../../../../services/getHumanDate';
const Container = styled.div`
    position: relative;
    padding: 0 0.5rem;
    margin: 0.5rem 0;
`;
const Name = styled.div`
    font-size: 1rem;
    font-weight: 700;
    display: inline;
    line-height: 1;
    margin-bottom: 0.75rem;
    @media screen and (min-width: 768px) {
        font-size: 1.5rem;

    }



`;
 
 
 
 
 
const TagsContainer = styled.div`
    display: flex;
    margin: 0 0 0.75rem 0;
`;
const Tag = styled.div`
    padding: 0.08rem 0.7rem;
    border-radius: 5px !important;
    margin-right: 0.5rem;
    font-size: 0.75rem;
`;
 
const RatingContainer = styled.div`
   
    width: max-content;
    padding: 0.25rem;
    margin-top: 0.25rem;
    background-color: green;
    color: white;
    font-size: 0.75rem;
    border-radius: 2px;
 `;
const Cost = styled.p`
    font-weight: 800;
    font-size: 1rem;
    line-height: 1;
    margin: 0rem 0 2px 0;

    @media screen and (min-width: 768px) {
        font-size: 1.2rem;

    }
 `;
const DesktopGridContainer = styled.div`
    display: grid;
    @media screen and (min-width: 768px) {

    grid-template-columns: auto max-content;
    }
`;
const Accommodation = (props) => {
   let isPageWide = media('(min-width: 768px)')
    const MEAL_TEXT = {
        "CP" : "Breakfast Included",
        "EP": "Room Only",
        "MAP": "Breakfast and Lunch / Dinner Included",
        "AP": "Breakfast, Lunch and Dinner Included"
    };
    const RANDOM_RATING = [8.8, 8.9, 9.0, 9.1,9.2,9.3,9.4,9.5,9.6,9.7,9.8];
    let color="rgba(18, 105, 4, 1)";
    if(props.rating){
 
    if(props.rating < 4 && props.rating > 3) color="orange";
    else if(props.rating < 3) color="red";
    }
    const getDate = (date) => {
        let year = date.substring(0,4)
        let month = date.substring(5,7);
        let day = date.substring(8,10);
        return(getHumanDate(day+"/"+month+"/"+year) );
    
    }
    let rooms = [];

    try{
        props.selectedBooking.costings_breakdown.map(data => {
            rooms.push(data);
        })
    }catch{

    }
  return(
      <Container className=''>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <Name className='font-lexend hover-pointer' onClick={props.setShowDetails}>
             {props.selectedBooking ? props.selectedBooking.name : null}
            </Name>
            
            {/* <Star src={star} style={{marginLeft: '0.25rem'}}></Star>
            <Star src={star} style={{marginLeft: '0.25rem'}}></Star>
            <Star src={star} style={{marginLeft: '0.25rem'}}></Star> */}

        </div>
        <TagsContainer>
                {props.star ? <Tag className='border'>
                    {props.star+" star"}
                </Tag> : null}
               
        </TagsContainer>
        <DesktopGridContainer style={{marginBottom: '0rem'}}>
        <div><div style={{display: 'flex',  gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <ImageLoader url="media/icons/bookings/calendar (1).png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        {props.selectedBooking.check_in ? <div>
                            <p  style={{fontWeight: '600', fontSize: '0.75rem', margin: '0 0 0 0'}} className='font-lexend'>Check In</p>
                            <p  style={{fontWeight: '300', fontSize: '0.75rem', margin: '0 0 0 0'}} className='font-lexend'>{getDate(props.selectedBooking.check_in)}</p>
                        </div> : null}
                        {props.selectedBooking.check_out ? <div> 
                            <p  style={{fontWeight: '600', fontSize: '0.75rem', margin: '0 0 0 0'}} className='font-lexend'>Check Out</p>
                            <p  style={{fontWeight: '300', fontSize: '0.75rem', margin: '0 0 0 0'}} className='font-lexend'>{getDate(props.selectedBooking.check_out)}</p>
                        </div> : null}
                    </div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'max-content auto',   gridGap: '0.5rem', marginBottom: '0.75rem'}}>
                    <ImageLoader url="media/icons/bookings/bed.png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        
                        { rooms.length ? 
                        rooms.map((room,i) => 
                            <div key={i} className='' style={{display: 'grid', gridTemplateColumns: 'max-content auto'}}>
                                 <p  style={{fontWeight: '300', fontSize: '0.75rem', margin: '0 0 0 0'}} className='font-lexend'>{room.number_of_rooms + " x "}</p>
                                 <p  style={{fontWeight: '300', fontSize: '0.75rem', margin: '0 0 0 0.25rem'}} className='font-lexend'>{room.room_type_name}</p>
                            </div>
                        )
                      : null }
                    </div>
                </div>
                {/* <div style={{display: 'flex',  gap: '0.5rem'}}>
                    <ImageLoader url="media/icons/bookings/tourist.png" height="1.5rem" width="1.5rem" widthmobile="1.5rem" dimensions={{width: 100, height: 100}} margin="0" leftalign></ImageLoader>
                    <div style={{display: 'flex', gap: '1rem'}}> 
                        <div className='center-div'>
                             <p  style={{fontWeight: '300', fontSize: '0.75rem', margin: '0 0 0 0'}} className='font-lexend'>2 Adults , 1 Child(s)</p>
                        </div>
                      
                    </div>
                </div> */}
                </div>
            {/* <p style={{color: 'hsl(0,0%,60%)', fontSize: '0.75rem', letterSpacing: '2px', fontWeight: '500', margin: '0 0 0.25rem 0'}} className='font-lexend'>AMMENITEIS</p> */}
            <div style={{display: 'flex', alignItems: 'center'}}>{props.rating &&  color!=='red'? <RatingContainer className="font-lexend hidden-mobile" style={{backgroundColor: color, lineHeight: '1'}}>
                        <IoStarSharp style={{fontSize: '1rem', margin: '0 0.25rem 0 0', color: 'white'}}/>
                        {props.rating ? props.rating + " / 5" : RANDOM_RATING[Math.floor(Math.random() * 10)]}
                    </RatingContainer> : null}</div>
        </DesktopGridContainer>
      {props.rating &&  color!=='red'? <RatingContainer className="font-lexend hidden-desktop" style={{backgroundColor: color, lineHeight: '1'}}>
                        <IoStarSharp style={{fontSize: '1rem', margin: '0 0.25rem 0 0', color: 'white'}}/>
                        {props.rating ? props.rating + " / 5" : RANDOM_RATING[Math.floor(Math.random() * 10)]}
                    </RatingContainer> : null}
        <div style={{flexDirection: 'row', gap: '0.5rem', display: 'flex', flexGrow : '1', justifyContent: 'flex-end' , alignItems:  isPageWide ? 'center' : 'flex-end'}}><div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row', margin: '0 0 0 0'}}>
                {/* <BsArrowDown style={{color: 'green', fontSize: '1.5rem'}}></BsArrowDown> */}
                {/* <Cost  className='font-lexend'>{"₹ "+getIndianPrice(props.selectedBooking.cost)+" /-"}</Cost> */}
        </div>
        <div className='hidden-mobile'><Button fontSizeDesktop="1.25rem" onclick={() => console.log('')} bgColor="black" color="white" borderRadius="10px" fontWeight="600" borderWidth="0px" padding="0.25rem 1.5rem">Selected</Button></div>
</div>
        
       </Container>
  );
  

}
 
export default Accommodation;