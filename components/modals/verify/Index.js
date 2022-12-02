import React, { useState } from 'react';
import {Modal} from 'react-bootstrap';
 import styled from 'styled-components';
 import { TbArrowBack } from 'react-icons/tb';
 import media from '../../../components/media';
 import Email from './Email';
//  import Form from './form/Index';
const Body=styled(Modal.Body)`
    
  `;

const RegistrationModal = (props) => {
    let isPageWide = media('(min-width: 768px)')

    const [email, setEmail] = useState('devansh@gmail.com');
    const [emailError, setEmailError] = useState(false);

  return(
      <div>
         
         <Modal className='booking-modal'  show={props.show} size="xl" onHide={props.hide}>
         <Modal.Header style={{ float: 'right', height: isPageWide? 'max-content' : '20vw', position: 'sticky', top: '0', backgroundColor: 'white', justifyContent: 'flex-end', padding: !isPageWide ?  '2rem 1rem' : '1rem',  backgroundColor: 'white', zIndex: '2'}}>
            <TbArrowBack onClick={null} className="hover-pointer"   style={{margin: '0.5rem', fontSize: '1.75rem', textAlign: 'right',}} ></TbArrowBack>

              {/* <StyledFontAwesomeIcon onClick={props.onHide} icon={faChevronLeft}></StyledFontAwesomeIcon> */}
            </Modal.Header>
             <Body className="">
                <p className='font-opensans text-center'>You're not authorized to purchase this, verify email</p>
                <Email email={email} setEmail={setEmail} emailError={emailError}></Email>
             </Body>
      </Modal>
      </div>
  );

}

export default RegistrationModal;