

import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components'
//  import { getHumanDate } from '../../../../services/getHumanDate';
import right from '../../../../../public/assets/right-arrow-flight-11.png';
import arrow from '../../../../../public/assets/right-arrow-flight-12.png';

  import media from '../../../../media';
  import { getHumanTime } from '../../../../../services/getHumanTime';
  import { getHumanDate } from '../../../../../services/getHumanDate';
import ImageLoader from '../../../../ImageLoader';
import axiosflightlogoinstance from '../../../../../services/bookings/FetchAirlineLogo';


 
const DetailsGridContainer = styled.div`
display: grid;
grid-template-columns: max-content auto max-content;
grid-column-gap: 0.5rem;
grid-row-gap: 0.2rem;
line-height: 1;

height: max-content;
`;

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 6fr;
    padding: 1rem 0.5rem;
    border-style: none none solid none;
border-width: 1px;
border-color: rgba(238,238,238,1);
`;
const LogoContainer   = styled.div`

`;
 
const Booking = (props) =>{
    
    const  minuteToHours = (n) => {
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return  rhours + " h " + rminutes + " m";
        }
    let isPageWide = media('(min-width: 768px)')
    const [url, setUrl] = useState('https://d31aoa0ehgvjdi.cloudfront.net/crm/flight.webp')
    useEffect(() => {
        if(props.data.costings_breakdown)
        if(props.data.costings_breakdown.Segments)
        if(props.data.costings_breakdown.Segments.length)

        setUrl("https://d31aoa0ehgvjdi.cloudfront.net/media/airlines/"+props.data.costings_breakdown.Segments[0][0].Airline.AirlineCode+".png");

         
            
      }, [props.data]);
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
      return(
        <GridContainer>

        <LogoContainer>
        <img
        src={url}
        dimensions={{width: 200, heght: 200}}
        style={{filter: !props.data.user_selected ? 'blur(0.5rem)' : 'blur(0)'}}
        width="80%"
        leftalign
        widthmobile="80%"
        >
        
        </img>
    {props.data.costings_breakdown? props.data.costings_breakdown.Segments?     <div className={props.data.user_selected ? 'font-lexend text-center' : 'blurry-text font-lexend text-center'} style={{fontWeight: '400', fontSize: '0.75rem', margin: '0.25rem 0 0 0', lineHeight: '1'}}><em>{props.data.airline_name}</em></div> : null : null}
</LogoContainer>
<DetailsGridContainer className={props.data.user_selected ? ' ' : 'blurry-text'}>
                            <div style={{display: 'flex', gap: '0.25rem'}} >
                                {props.data.check_in ? <div style={{ margin: '0', fontWeight: '700' , fontSize: '0.95rem'}} className='font-lexend'>{getTime(props.data.check_in)}</div>: <div></div>}
                                {props.data.origin_code? <div style={{ margin: '0', fontWeight: '400', fontSize: '0.95rem'}} className='font-lexend'>{ !getTime(props.data.check_in) ? props.data.city + " ("+props.data.origin_code+")" :"("+props.data.origin_code+")"}</div>  : null}
                            </div>
                            <div style={{margin: '0', position: 'relative' }}>
                                <img  height='1rem' src={right} style={{position: 'absolute',  height: '0.9rem', width: '100%', margin: 'auto', display: 'block'}}></img>
                                <img height="1rem" src={arrow} style={{position: 'absolute', left: '100%', top: '0.2rem', height: '0.5rem', width: '0.5rem', display: 'block'}}></img>
                            </div>
                            <div style={{display: 'flex', gap: '0.25rem'}}>
                                {props.data.check_out ? <div style={{ margin: '0', fontWeight: '700' , fontSize: '0.95rem'}} className='font-lexend'>{getTime(props.data.check_out)}</div> : <div></div>}
                                {props.data.destination_code? <div style={{ margin: '0', fontWeight: '400', fontSize: '0.95rem'}} className='font-lexend'>{!getTime(props.data.check_out) ? props.data.destination_city + " ("+props.data.destination_code+")" :  "("+props.data.destination_code+")"}</div> : null}
                            </div>
                            <div style={{width: 'max-content'}}>
                                {props.data.check_in ? <div className={props.data.user_selected ? 'font-lexend' : 'font-lexend blurry-text'} style={{fontSize: '0.75rem', fontWeight: '300', color: 'rgba(91, 89, 89, 1)', textAlign: 'right'}}>{getDate(props.data.check_in).slice(0,-4)}</div> : <div></div>}
                                {props.data.check_in ? <div className={props.data.user_selected ? 'font-lexend' : 'font-lexend blurry-text'} style={{fontSize: '0.55rem', fontWeight: '300', textAlign: 'right', color: 'rgba(91, 89, 89, 1)'}}>{getDate(props.data.check_in).slice(-4)}</div> : <div></div>}

                                {/* {props.data.costings_breakdown? props.data.costings_breakdown.Segments ? props.data.costings_breakdown.Segments[0][0].Origin.Airport.Terminal !=="" ?  <div className='font-lexend' style={{fontSize: '0.75rem', fontWeight: '300'}}>{"Terminal "+props.data.costings_breakdown.Segments[0][0].Origin.Airport.Terminal}</div> : null : null : null} */}
                            </div>
                            <div >
                            {props.data.costings_breakdown ? props.data.costings_breakdown.Segments ? props.data.costings_breakdown.Segments[0].length > 1 ? <div className='font-lexend text-center' style={{fontSize: '0.65rem', fontWeight: '300',  color: 'rgba(91, 89, 89, 1)', marginTop: '-4px'}}>{props.data.costings_breakdown.Segments[0].length > 1 ? props.data.costings_breakdown.Segments[0].length-1+' stop(s)' : "No Stops"}</div> : null: null : null}
                            {/* {props.data.costings_breakdown ? props.data.costings_breakdown.Segments?  props.data.costings_breakdown.Segments[0].length > 1 ? <div className='font-lexend text-center' style={{fontSize: '0.55rem', fontWeight: '300'}}>{minuteToHours(props.data.costings_breakdown.Segments[0][1].GroundTime)}</div> : null : null : null} */}


                            </div>
                            <div style={{width: 'max-content'}}>
                                {props.data.check_out ? <div className={props.data.user_selected ? 'font-lexend' : 'font-lexend blurry-text'} style={{fontSize: '0.75rem', fontWeight: '300',  color: 'rgba(91, 89, 89, 1)', textAlign: 'right'}}>{getDate(props.data.check_out).slice(0,-4)}</div> : <div></div>}
                                {props.data.check_out ? <div className={props.data.user_selected ? 'font-lexend' : 'font-lexend blurry-text'} style={{fontSize: '0.55rem', fontWeight: '300',  color: 'rgba(91, 89, 89, 1)', textAlign: ' right'}}>{getDate(props.data.check_out).slice(-4)}</div> : <div></div>}

                                {/* {props.data.costings_breakdown ? props.data.costings_breakdown.Segments?  props.data.costings_breakdown.Segments[0].length ?  props.data.costings_breakdown.Segments[0][props.data.costings_breakdown.Segments[0].length-1].Destination.Airport.Terminal !=="" ?  <div className='font-lexend' style={{fontSize: '0.75rem', fontWeight: '300'}}>{"Terminal "+props.data.costings_breakdown.Segments[0][props.data.costings_breakdown.Segments[0].length-1].Destination.Airport.Terminal}</div> : null : null : null : null} */}
                            </div>
                        </DetailsGridContainer>
</GridContainer>
    );
 
}

export default  (Booking);