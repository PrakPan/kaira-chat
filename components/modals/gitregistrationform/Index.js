import React from 'react';
import {Modal} from 'react-bootstrap';
 import styled from 'styled-components';
 import { TbArrowBack } from 'react-icons/tb';
 import media from '../../../components/media';
 import Form from './form/Index';
const Body=styled(Modal.Body)`
    
  `;

const RegistrationModal = (props) => {
    let isPageWide = media('(min-width: 768px)')


  return(
      <div>
          <Modal.Header style={{ float: 'right', height: isPageWide? 'max-content' : '20vw', position: 'sticky', top: '0', backgroundColor: 'white', justifyContent: 'flex-end', padding: !isPageWide ?  '2rem 1rem' : '1rem',  backgroundColor: 'white', zIndex: '2'}}>
            <TbArrowBack onClick={null} className="hover-pointer"   style={{margin: '0.5rem', fontSize: '1.75rem', textAlign: 'right',}} ></TbArrowBack>

              {/* <StyledFontAwesomeIcon onClick={props.onHide} icon={faChevronLeft}></StyledFontAwesomeIcon> */}
            </Modal.Header>
         <Modal className='booking-modal'  show={props.show} size="xl" onHide={props.hide}>
             <Body className="">
                <p className='font-opensans text-center'>Some Text Here</p>
                <Form id={props.id}></Form>
             </Body>
      </Modal>
      </div>
  );

}

export default RegistrationModal;