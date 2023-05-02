import React, {useState} from 'react';
import styled from 'styled-components';
// import img from '../../public/assets/arts/whyus/whyus1.svg';
// import img2 from '../../public/assets/arts/whyus/whyus2.svg';
// import img3 from '../../public/assets/arts/whyus/whyus3.svg';
import media from '../media';
import Button from '../ui/button/Index';
import urls from '../../services/urls';
import * as ga from '../../services/ga/Index';
import { useRouter } from 'next/router';
import ImageLoader from '../ImageLoader';
import openTailoredModal from '../../services/openTailoredModal';

const GridContainer = styled.div`
    display: grid !important;
 
    @media screen and (min-width: 768px){
        grid-template-columns: 50% 50%; 
        grid-gap: 2rem;
    }
`; 

const WhyUs = (props) =>{
    let isPageWide = media('(min-width: 768px)')
const router=useRouter();

    return(
    <div><GridContainer className='hidden-desktop'>
    <div style={{paddingLeft: "10%"}}>
        {/* <img src={one} style={{width: "4rem"}}></img> */}
        <p className="font-lexend " style={{fontSize: "20px", marginBottom: "1rem", fontWeight: "700"}}>Fully Customizable</p>
        <p className="font-lexend"  style={{ fontSize: "20px",fontWeight: "300"}}> We offer unique experiences that are 100% customizable travel according to the traveler's budget and taste since we believe and respect that every traveler has his or her unique way of travel.</p>
    </div> 
    <div>
        <ImageLoader url={'media/website/whyus3.svg'} width="70%"  widthmobile="70%" margin="0 auto 4rem auto"></ImageLoader>
    </div>
    <div style={{textAlign: "right", paddingRight: "10%"}}>
        <div style={{position: "relative"}}>
            {/* <img src={two} style={{width: "4rem", position: "absolute", right: "0"}}></img> */}
        </div>
        <p className="font-lexend " style={{fontSize: "20px", marginBottom: "1rem", fontWeight: "600"}}>100% Transparency</p>
        <p className="font-lexend" style={{fontSize: "20px", fontWeight: "300", color: "#212529"}}> We believe in transparency for any service, and therefore we charge a small service fee and no other hidden commissions or charges from the travelers.</p>
    </div> 
    <div>
    <ImageLoader url={'media/website/whyus2.svg'} width="70%"  widthmobile="70%" margin="0 auto 4rem auto"></ImageLoader>
    </div>
    <div style={{paddingLeft: "10%"}}>
    {/* <img src={three} style={{width: "4rem"}}></img> */}
        <p className="font-lexend " style={{fontSize: "20px", marginBottom: "1rem", fontWeight: "600"}}>24/7 Live Concierge</p>
        <p className="font-lexend" style={{fontSize: "20px",  fontWeight: "300", color: "#212529"}}>We understand that traveling can not be perfect and thus, we offer 24/7 on-chat and on-call support service throughout the travel experience.</p>
    </div>
    <div>
    <ImageLoader url={'media/website/whyus1.svg'} width="70%"  widthmobile="70%" margin="0 auto 4rem auto"></ImageLoader>
    </div>
    </GridContainer>
   
        <GridContainer className='hidden-mobile'>
    <div style={{paddingLeft: "10%"}}>
        {/* <img src={one} style={{width: "4rem"}}></img> */}
        <p className="font-lexend " style={{fontSize: "20px", marginBottom: "1rem", fontWeight: "700"}}>Fully Customizable</p>
        <p className="font-lexend"  style={{ fontSize: '20px', fontWeight: "200"}}> We offer unique experiences that are 100% customizable travel according to the traveler's budget and taste since we believe and respect that every traveler has his or her unique way of travel.</p>
    </div> 
    <div>
    <ImageLoader url={'media/website/whyus3.svg'} width="70%"  widthmobile="70%" margin="0 auto 4rem auto"></ImageLoader>
    </div>
   
    <div>
    <ImageLoader url={'media/website/whyus2.svg'} width="70%"  widthmobile="70%" margin="0 auto 4rem auto"></ImageLoader>
    </div>
    <div style={{ paddingRight: "10%"}}>
        <div style={{position: "relative"}}>
            {/* <img src={two} style={{width: "4rem", position: "absolute", right: "0"}}></img> */}
        </div>
        <p className="font-lexend " style={{fontSize: "20px", marginBottom: "1rem", fontWeight: "600"}}>100% Transparency</p>
        <p className="font-lexend" style={{fontWeight: "200",fontSize: '20px', color: "#212529"}}> We believe in transparency for any service, and therefore we charge a small service fee and no other hidden commissions or charges from the travelers.</p>
    </div> 
    <div style={{paddingLeft: "10%"}}>
    {/* <img src={three} style={{width: "4rem"}}></img> */}
        <p className="font-lexend " style={{fontSize: "20px", marginBottom: "1rem", fontWeight: "600"}}>24/7 Live Concierge</p>
        <p className="font-lexend" style={{ fontWeight: "200",fontSize: '20px', color: "#212529"}}>We understand that traveling can not be perfect and thus, we offer 24/7 on-chat and on-call support service throughout the travel experience.</p>
    </div>
    <div>
    <ImageLoader url={'media/website/whyus1.svg'} width="70%"  widthmobile="70%" margin="0 auto 4rem auto"></ImageLoader>
    </div>

    </GridContainer>
    <Button onclick={()=>openTailoredModal(router)} onclickparams={null} margin="0 auto 2rem auto" padding='0.5rem 1.5rem' borderRadius="2rem">Start planning</Button>

    </div>
    );
    
} 

export default WhyUs;