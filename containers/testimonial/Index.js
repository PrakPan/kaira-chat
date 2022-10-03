import React, {useEffect} from 'react';
import styled from 'styled-components'
// import FullImg from '../../components/FullImage';
// import OurCustomersSay from './OurCustomersSay';
// import Footer from '../../components/footer/Index';
// import downimg from '../../assets/icons/navigation/downwhite.svg';
 import AsSeenIn from './AsSeenIn';
import Reviews from './Reviews';
import StoriesMap from './StoriesMap';
import TravellerCounter from './TravellerCounter';
import WhyTarzan from './whyttw/Index';
// import YellowReview from './YellowReview';
import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';
const FullImgContainer = styled.div`
width: 100%;
margin: auto;
text-align: center; 
position: absolute;
bottom: 0;
@media screen and (min-width: 768px){
    
}
`;
const Heading = styled.h1`
    color: white;
    font-size: ${props => props.theme.fontsizes.mobile.headings.one ? props.theme.fontsizes.mobile.headings.one : props.theme.fontsizes.mobile.headings.one};
    margin: 2rem;
    @media screen and (min-width: 768px){ 
        font-size: ${props => props.theme.fontsizes.desktop.headings.one ? props.theme.fontsizes.desktop.headings.one : props.theme.fontsizes.desktop.headings.one};
    }
`;
const Down = styled.img`
    height: 5vh;
    width: auto;
    @media screen and (min-width: 768px){ 
    height: 10vh;
    }
`;
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
            {/* <Footer></Footer> */}
        </div>
    );
        }
}

export default Testimonial;