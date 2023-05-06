import React, {useEffect} from 'react';
import styled from 'styled-components'
 import AsSeenIn from './AsSeenIn';
import Reviews from './Reviews';
import StoriesMap from './StoriesMap';
import TravellerCounter from './TravellerCounter';
import WhyTarzan from './whyttw/Index';
import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';

const Testimonial = (props) =>{
    if(typeof window !== undefined){ 
    useEffect(() => {
        window.scrollTo(0,0);
    },[])
   
    
    return(
        <div>
            <StoriesMap></StoriesMap>
            <TravellerCounter></TravellerCounter>
            <Reviews/>
            <WhyTarzan/>           
            <AsSeenIn/>
            <ChatWithUs link='/contact'/>
        </div>
    );
        }
}

export default Testimonial;