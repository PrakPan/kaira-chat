import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Image from './Image';
import ContactForm from './Form/TestForm';
import ContactInfo from './ContactInfo';
 import YellowContainer from './YellowContainer';
 import Map from './Map'
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
            <Map></Map>
            {/* <SubscribePannel/> */}
        </YellowContainer>
        
        {/* <Footer></Footer> */}
    </div>
  );
}

export default Contact;
