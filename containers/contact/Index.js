import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Image from './Image';
import ContactForm from './Form/TestForm';
import ContactInfo from './ContactInfo';
 import YellowContainer from './YellowContainer';
 import Map from '../../components/Map'
const Contact = () => {
  useEffect(()=> {
    window.scrollTo(0,0)
  },[])

  return(
    <div>
        <Image></Image>
        <YellowContainer desktopWidth="70%" mobileWidth="95%">
            <ContactForm></ContactForm>
            <ContactInfo></ContactInfo>
            <Map
                center={{lat: 28.5779959, lng: 77.343917}}
                InfoWindowContainer={<h4 style={{padding : '0rem 1rem'}}>The tarzan way</h4>}
                height={'500px'}
              ></Map>
            {/* <SubscribePannel/> */}
        </YellowContainer>
        
        {/* <Footer></Footer> */}
    </div>
  );
}

export default Contact;
