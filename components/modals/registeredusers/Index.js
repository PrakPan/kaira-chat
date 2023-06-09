import React, { useState , useEffect} from 'react';
import {Modal} from 'react-bootstrap';
 import styled from 'styled-components';
 import { TbArrowBack } from 'react-icons/tb';
 import media from '../../media';
 import Form from './form/Index';
  import {connect} from 'react-redux';
import { useRouter } from 'next/router';
  
const Body=styled(Modal.Body)`
    padding: 0.5rem !important;
  `;

const RegistrationModal = (props) => {
   const router = useRouter();
  

    let isPageWide = media('(min-width: 768px)')
    useEffect(() => {
     
    }, []);
    useEffect(() => {

     }, [props.show]);
  
     return(
      <div>
         
         <Modal className='booking-modal'  show={props.show} size="xl" onHide={props.hide}>
         <Modal.Header style={{   height: isPageWide? 'max-content' : '20vw', position: 'sticky', top: '0', backgroundColor: 'white', justifyContent: 'flex-start', padding: !isPageWide ?  '2rem 1rem' : '1rem',  backgroundColor: 'white', zIndex: '2'}}>
         <TbArrowBack onClick={props.hide} className="hover-pointer"   style={{margin: '0.5rem', fontSize: '1.75rem', textAlign: 'right',}} ></TbArrowBack>

            <p style={{fontWeight: '800', margin: '0', fontSize: '19px', }} className="font-lexend">Registered Travelers</p>

              {/* <StyledFontAwesomeIcon onClick={props.onHide} icon={faChevronLeft}></StyledFontAwesomeIcon> */}
            </Modal.Header>

             <Body className="">
                 <Form token={props.token} id={props.id} registered_users={props.registered_users}></Form>
             </Body>

      </Modal>
      {/* <TermsModal show={showTermsModal} hide={() => setShowTermsModal(false)}></TermsModal> */}
        </div>
  );
 
}

const mapStateToPros = (state) => {
    return{
      name: state.auth.name,
      emailFail: state.auth.emailFail,
      token: state.auth.token,
      phone: state.auth.phone,
      email: state.auth.email,
      authRedirectPath: state.auth.authRedirectPath,
      loadingsocial: state.auth.loadingsocial,
      emailfailmessage: state.auth.emailfailmessage,
      loginmessage: state.auth.loginmessage,
      hideloginclose: state.auth.hideloginclose
    }
  }
  const mapDispatchToProps = dispatch => {
      return{
        setUserDetails: (details) => dispatch(authaction.setUserDetails(details)),
      }
    }

export default connect(mapStateToPros,mapDispatchToProps)(RegistrationModal);