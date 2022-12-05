import React, { useState } from 'react';
import {Modal} from 'react-bootstrap';
 import styled from 'styled-components';
 import { TbArrowBack } from 'react-icons/tb';
 import media from '../../../components/media';
 import Email from './Email';
 import {connect} from 'react-redux';
import axiosusereditinfo from '../../../services/user/edit';
import Button from '../../ui/button/Index';
import axiosemailinitiateinstance from '../../../services/user/email/initiate';
import axiosemailcompleteinstance from '../../../services/user/email/complete';
//  import Form from './form/Index';
import * as authaction from '../../../store/actions/auth';
import Otp from './Otp';
import Spinner from '../../Spinner';
import axiospurchaseinstance from '../../../services/sales/itinerary/Purchase';
const Body=styled(Modal.Body)`
    
  `;

const RegistrationModal = (props) => {
    let isPageWide = media('(min-width: 768px)')

    const [email, setEmail] = useState(props.email);
    const [emailError, setEmailError] = useState(false);
    const [otp, setOtp] = useState(null);


    const [otpSent, setOtpSent ] = useState(false);
    const [otpVerificationFailed, setOtpVerificationtFailed] =  useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const [buttonLoading , setButtonLoading] = useState(false);

    const _cloneHandler  = () => {
        axiospurchaseinstance.post("/", 
        {
            "itinerary_id": props.id,
            "number_of_adults": 5,
            "number_of_children": 0,
            "number_of_infants": 0,
            "start_date": "2022-12-25",
            "registered_users": [
                {
                    "email": "abc@thetarzanway.com",
                    "employee_id": "sjkdfhkjsdf"
                }
            ]
        }
        , {headers: {
            'Authorization': `Bearer ${props.token}`
            }}).then(res => {
                props.onSuccess();

    
        }).catch(err => {
         
        })
        //

    }
    const _verifyOtpHandler = (otp) => {
        setButtonLoading(true);
        axiosemailcompleteinstance.get( "/", {headers: {
            'Authorization': `Bearer ${props.token}`
            }, params: {
                otp: otp
            }}
            ).then( res => {
                setOtpVerificationtFailed(false);
                setOtpVerified(true);
                setButtonLoading(false);
                props.setUserDetails({
                    email: email,
                })
                _cloneHandler();

    }).catch(err => {
        setButtonLoading(false);

        setOtpVerificationtFailed(true);
        // props.hide();

    })

    }

    const _emailInitateHandler = () => {
        axiosemailinitiateinstance.get( "/", {headers: {
            'Authorization': `Bearer ${props.token}`
            },
     
    }).then( res => {
        setButtonLoading(false);
        setOtpSent(true);

    }).catch(err => {
        setButtonLoading(false);
    })


    }


    const _editUserEmailHandler = (email) => {
        setButtonLoading(true);
        console.log(props.email);
        axiosusereditinfo.patch( "/", 
        // {headers: {
        //     'Authorization': `Bearer ${props.token}`
        //     },
        //     params: {
        //         "email": email
        //     }
        {
            email: email
        },
        {
            headers: {
                    'Authorization': `Bearer ${props.token}`
                    },
        }
        ).then( res => {
                _emailInitateHandler();
    }).catch( err => {
        setButtonLoading(false);
    } 

    )

    }

    

  return(
      <div>
         
         <Modal className='booking-modal'  show={props.show} size="xl" onHide={props.hide}>
         <Modal.Header style={{ float: 'right', height: isPageWide? 'max-content' : '20vw', position: 'sticky', top: '0', backgroundColor: 'white', justifyContent: 'flex-end', padding: !isPageWide ?  '2rem 1rem' : '1rem',  backgroundColor: 'white', zIndex: '2'}}>
            <TbArrowBack onClick={props.hide} className="hover-pointer"   style={{margin: '0.5rem', fontSize: '1.75rem', textAlign: 'right',}} ></TbArrowBack>

              {/* <StyledFontAwesomeIcon onClick={props.onHide} icon={faChevronLeft}></StyledFontAwesomeIcon> */}
            </Modal.Header>
             <Body className="">
                <p className='font-opensans text-center'>You're not authorized to purchase this, verify email</p>
                <Email otpSent={otpSent} email={email} setEmail={setEmail} emailError={emailError} setEmailError={setEmailError}></Email>
                {otpSent ?  <Otp otp={otp} setOtp={setOtp} otpVerificationFailed={otpVerificationFailed} setEmailError={setEmailError}></Otp>:
    <div style={{visibility: 'hidden'}}> <Otp otp={otp} setOtp={setOtp} otpVerificationFailed={otpVerificationFailed} setEmailError={setEmailError}></Otp></div>
}
                <Button onclick={!otpSent ? _editUserEmailHandler : _verifyOtpHandler}  onclickparam={!otpSent ? email : otp}>{!otpSent ? "Get OTP" : 'Verify OTP'}</Button>
                { buttonLoading ? <Spinner></Spinner> : null}
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