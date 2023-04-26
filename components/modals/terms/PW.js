import React, { useState , useEffect} from 'react';
import Modal from '../../ui/Modal'
 import media from '../../media';
const RegistrationModal = (props) => {
 
    let isPageWide = media('(min-width: 768px)')
    useEffect(() => {
      
    }, []);
  
    
     

  return(
      <div>
         
         <Modal width='35rem' mobileWidth='90%' backdrop closeIcon show={props.show} onHide={props.hide} style={{padding : '1rem' , borderRadius : '1.5rem'}}>
         {/* <Modal.Header style={{   height: isPageWide? 'max-content' : '20vw', position: 'sticky', top: '0', backgroundColor: 'white', justifyContent: 'flex-start', padding: !isPageWide ?  '2rem 1rem' : '1rem',  backgroundColor: 'white', zIndex: '2'}}> */}
         {/* <TbArrowBack onClick={props.hide} className="hover-pointer"   style={{margin: '0.5rem', fontSize: '1.75rem', textAlign: 'right',}} ></TbArrowBack> */}

            <p style={{fontWeight: '800', margin: '0', fontSize: '19px', }} className="font-lexend">Terms & Conditions</p>

             {/* </Modal.Header> */}

             {/* <Body className="font-lexend"> */}
                 {/* <p className='font-lexend text-center' style={{fontWeight: '800', margin: '1rem 0', fontSize: '19px'}}>Traveler Details</p> */}
             <ol>
              <li>Only PW members can avail the discount.</li>
              <li>Minimum 2 members are required to book one trip.</li>
              <li>If PW members are traveling with their family, then 20% discount on the overall trip.</li>
              <li>If a trip is customised, then 20% off on the trip.</li>
              <li>If PW members travel together, then 50% discount on the overall trip.</li>
              <li>The above discounts are not applicable, in case of individual bookings for flights, trains & hotels.</li>
              <li>All amounts are payable to "TARZAN WAY TRAVELS PVT LTD". PAN Number: AAGCT8887K</li>
              <li>Pricing is inclusive of accommodations, transfers, and activities as mentioned</li>
              <li>There might be some changes in case the weather conditions are rough, and we'll try our best to find similar activities/transfers/accommodations in the case.</li>
              <li>In case of non availability of enough rooms in the specified hotels, we'll inform you the same and will give you different options of hotels. In case you are not satisfied with any of the alternate options, the advance paid will be refunded.</li>
              <li>Early check-in or late check-out is subject to availability and the hotel may charge extra for the same</li>
              <li>All optional activity cost and entrance fees to the sightseeing places are excluded</li>
              <li>The Tarzan Way is not liable for any mishaps at the accommodation, transportation or activity. Any disputes must be settled with the partners directly. However we will be providing live customer support for the same.</li>
             <li>Travelers are requested to take care of their belongings and TTW is not liable for the loss or theft of the belongings.</li>
             <li>Any cost or cancellation charge arising out of unforeseen circumstances is not included.</li>
              <li>Full payment is expected in advance.</li>
              <li>To ensure the best experience possible, we offer a  24/7 live concierge.</li>
              <li>For any other queries, mail us at info@thetarzanway.com or call / whatsapp on +91-9582125476</li>
             </ol>
              {/* </Body> */}
      </Modal>
      </div>
  );

}
 
export default  (RegistrationModal);