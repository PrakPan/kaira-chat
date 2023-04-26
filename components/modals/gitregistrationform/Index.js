import React, { useState , useEffect} from 'react';
import Modal from '../../ui/Modal'
 import styled from 'styled-components';
 import media from '../../../components/media';
 import Form from './form/Index';
 import axiospurchaseinstance from '../../../services/sales/itinerary/Purchase';
 import {connect} from 'react-redux';
import { useRouter } from 'next/router';
import axiossalecreateinstance from '../../../services/sales/itinerary/SaleCreate';
import Cart from './cart/Index';
import axios from 'axios';
import TermsModal from '../terms/PW';
import LoadingPage from '../../LoadingPage';
import dayjs from 'dayjs';

const Heading = styled.p`
font-size : 25px;
font-weight : 700;
@media screen and (min-width: 768px){
  margin : 0rem 0rem 2rem 2rem;
}
`

const RegistrationModal = (props) => {

   const router = useRouter();
  const [verificationCount, setVerificationCount] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [formNotFilledError, setFormNotFilledError] = useState(false);
  const [formFailedError, setFormFailedError] = useState(false);
const [showTermsModal, setShowTermsModal] = useState(false);
const [rzVerificationLoading, setRzVerificationLoading] = useState(false);

    let isPageWide = media('(min-width: 768px)')
    useEffect(() => {
      // const script = document.createElement('script');
      // script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      // script.async = true;
      // document.body.appendChild(script);
    }, []);
    useEffect(() => {
      if(!formFailedError)
      setVerificationCount(0);
    }, [props.show]);
  
    const _startRazorpayHandler = (data) => {
    
      //Razorpay payload
      let razorpayOptions = {
        "amount": data.amount, 
        // "currency": "INR",
        "name": "The Tarzan Way Payment Portal",
        "description":'',
        "image": "https://bitbucket.org/account/thetarzanway/avatar/256/?ts=1555263480",
        "order_id": data.order_id,
        //Payment successfull handler passed to razorpay
        "handler": function (response){
                    setRzVerificationLoading(true);

                    setPaymentLoading(true)
                    axios.post("https://suppliers.tarzanway.com/sales/verify/",{...response },{headers: 
                    {'Authorization': `Bearer ${props.token}`}} )
                    .then( res => {
                          setPaymentLoading(false);
                          // setRzVerificationLoading(false);
                        //  router.push('/itinerary/'+data.itinerary, undefined, {shallow: true})
                        // window.location.href="http://localhost:3002/itinerary/"+data.itinerary+"?payment_status=fail"

                         window.location.replace("https://thetarzanway.com/itinerary/physicswallah/"+data.itinerary+"?payment_status=success")

                     })
                    .catch( err => {
                       setPaymentLoading(false);
                      //  setRzVerificationLoading(false);

                      // router.push('/itinerary/'+data.itinerary)
                      window.location.href = ("https://thetarzanway.com/itinerary/physicswallah/"+data.itinerary+"?payment_status=fail")

                      // window.location.href="http://localhost:3000/itinerary/"+data.itinerary+"?payment_status=fail"
                      });
                },
        //User details will be present as user is logged in
        "prefill": {
        "name": props.name,
        "email": props.email,
        "contact": props.phone,
        },
        "theme": {
        "color": "#F7e700"
        }
    } 
    var rzp1 = new window.Razorpay(razorpayOptions);
    rzp1.open();

    }
    const _saleCreateHandler = (id) => {
  axiossalecreateinstance.post("/", 
        {
            "itinerary_id": id,
        
        }, {headers: {
            'Authorization': `Bearer ${props.token}`
            }}).then(res => {
              setPaymentLoading(false);
           // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id  
          _startRazorpayHandler(res.data)       

        }).catch(err => {
          // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id         
          setPaymentLoading(false);
 
        })
 
    }
    
    const _cloneHandler = (data) => {
        setFormFailedError(false)
          if(verificationCount == props.pax){
        setFormNotFilledError(false);
        setPaymentLoading(true);
        axiospurchaseinstance.post("/",  
        {
            "itinerary_id": props.id,
            "number_of_adults": parseInt(props.pax),
            "number_of_children": 0,
            "number_of_infants": 0,
            "start_date": dayjs(props.date).format('YYYY-MM-DD'),
            "registered_users": data.slice()
        }, {headers: {
            'Authorization': `Bearer ${props.token}`
            }}).then(res => {
              // router.push('/itinerary/'+res.data.itinerary.id)
          // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id   
          _saleCreateHandler(res.data.itinerary.id)      

        }).catch(err => {
          // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id 
          // router.push('/itinerary/'+res.data.itinerary.id)
             setFormFailedError(err.response.data.message);

            setPaymentLoading(false);
        })
      }
      else{
        setFormNotFilledError(true);
      }
    }
  if(!rzVerificationLoading)
  return(
      <div>
         <Modal width='35rem' mobileWidth='90%' backdrop closeIcon show={props.show} onHide={props.hide} style={{padding : '1rem' , borderRadius : '1.5rem'}}>
        <div>
            <Heading className="font-lexend">Confirm and Pay</Heading>
              <Cart setShowTermsModal={setShowTermsModal} cost={props.payment ? props.payment.per_person_total_cost : null} date={props.date} pax={props.pax} plan={props.plan}></Cart>
                <p className='font-lexend text-center' style={{fontWeight: '800', margin: '1rem 0', fontSize: '19px'}}>Member Details</p>
                <Form formFailedError={formFailedError} setFormFailedError={setFormFailedError}  formNotFilledError={formNotFilledError} number_of_adults={props.number_of_adults} verificationCount={verificationCount} setVerificationCount={setVerificationCount} email={props.email} paymentLoading={paymentLoading} token={props.token} id={props.id} onSuccess={_cloneHandler} pax={props.pax}></Form>
              </div>
      </Modal>
      <TermsModal show={showTermsModal} hide={() => setShowTermsModal(false)}></TermsModal>
        </div>
  );
  else return <LoadingPage></LoadingPage>

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