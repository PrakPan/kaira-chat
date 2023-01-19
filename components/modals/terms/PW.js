import React, { useState , useEffect} from 'react';
import {Modal} from 'react-bootstrap';
 import styled from 'styled-components';
 import { TbArrowBack } from 'react-icons/tb';
 import media from '../../media';
     import axios from 'axios';
const Body=styled(Modal.Body)`
    padding: 0.5rem !important;
  `;

const RegistrationModal = (props) => {
 
    let isPageWide = media('(min-width: 768px)')
    useEffect(() => {
      
    }, []);
  
    
     

  return(
      <div>
         
         <Modal className='booking-modal'  show={props.show} size="xl" onHide={props.hide}>
         <Modal.Header style={{   height: isPageWide? 'max-content' : '20vw', position: 'sticky', top: '0', backgroundColor: 'white', justifyContent: 'flex-start', padding: !isPageWide ?  '2rem 1rem' : '1rem',  backgroundColor: 'white', zIndex: '2'}}>
         <TbArrowBack onClick={props.hide} className="hover-pointer"   style={{margin: '0.5rem', fontSize: '1.75rem', textAlign: 'right',}} ></TbArrowBack>

            <p style={{fontWeight: '800', margin: '0', fontSize: '19px', }} className="font-opensans">Terms & Conditions</p>

             </Modal.Header>

             <Body className="font-opensans">
                 {/* <p className='font-opensans text-center' style={{fontWeight: '800', margin: '1rem 0', fontSize: '19px'}}>Traveler Details</p> */}
             <ol>
              <li>Only PW members can avail the discount.</li>
              <li>Minimum 2 members are required to book one trip.</li>
              <li>If PW members are traveling with their family, then 20% discount on the overall trip.</li>
              <li>If a trip is customised, then 20% off on the trip.</li>
              <li>If PW members travel together, then 50% discount on the overall trip.</li>
              <li>The above discounts are not applicable, in case of individual bookings for flights, trains & hotels.</li>
             </ol>
              </Body>
      </Modal>
      </div>
  );

}
 
export default  (RegistrationModal);