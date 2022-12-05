import React from 'react';
import {Modal} from 'react-bootstrap';
 import styled from 'styled-components';
 import { TbArrowBack } from 'react-icons/tb';
 import media from '../../../components/media';
 import Form from './form/Index';
 import axiospurchaseinstance from '../../../services/sales/itinerary/Purchase';
 import {connect} from 'react-redux';
import { useRouter } from 'next/router';
import axiossalecreateinstance from '../../../services/sales/itinerary/SaleCreate';

const Body=styled(Modal.Body)`
    
  `;

const RegistrationModal = (props) => {
  const router = useRouter();
    let isPageWide = media('(min-width: 768px)')

    const _saleCreateHandler = (id) => {
  axiossalecreateinstance.post("/", 
        {
            "itinerary_id": id,
        
        }, {headers: {
            'Authorization': `Bearer ${props.token}`
            }}).then(res => {
          // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id         

        }).catch(err => {
          // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id         
 
        })
    }
    
    const _cloneHandler = (data) => {
        
        axiospurchaseinstance.post("/", 
        {
            "itinerary_id": props.id,
            "number_of_adults": parseInt(props.pax),
            "number_of_children": 0,
            "number_of_infants": 0,
            "start_date": props.date.format('YYYY-MM-DD'),
            "registered_users": data
        }, {headers: {
            'Authorization': `Bearer ${props.token}`
            }}).then(res => {
          // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id   
          _saleCreateHandler(res.data.itinerary_id)      

        }).catch(err => {
          // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id         
 
        })
    }

  return(
      <div>
         
         <Modal className='booking-modal'  show={props.show} size="xl" onHide={props.hide}>
         <Modal.Header style={{ float: 'right', height: isPageWide? 'max-content' : '20vw', position: 'sticky', top: '0', backgroundColor: 'white', justifyContent: 'flex-end', padding: !isPageWide ?  '2rem 1rem' : '1rem',  backgroundColor: 'white', zIndex: '2'}}>
            <TbArrowBack onClick={props.hide} className="hover-pointer"   style={{margin: '0.5rem', fontSize: '1.75rem', textAlign: 'right',}} ></TbArrowBack>

              {/* <StyledFontAwesomeIcon onClick={props.onHide} icon={faChevronLeft}></StyledFontAwesomeIcon> */}
            </Modal.Header>
             <Body className="">
                <p className='font-opensans text-center'>Registration Form</p>
                <Form  token={props.token} id={props.id} onSuccess={_cloneHandler} pax={props.pax}></Form>
             </Body>
      </Modal>
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