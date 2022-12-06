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
import Cart from './cart/Index';
const Body=styled(Modal.Body)`
    
  `;

const RegistrationModal = (props) => {
  const router = useRouter();
    let isPageWide = media('(min-width: 768px)')

    const _startRazorpayHandler = (data) => {

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      //Razorpay payload
      let razorpayOptions = {
        "amount": data.amount, 
        // "currency": "INR",
        "name": "The Tarzan Way Payment Portal",
        "description":' data.data.description',
        "image": "https://bitbucket.org/account/thetarzanway/avatar/256/?ts=1555263480",
        "order_id": data.order_id,
        //Payment successfull handler passed to razorpay
        "handler": function (response){
                    axios.post("https://apis.tarzanway.com/pay/capture/",{...response },{headers: 
                    {'Authorization': `Bearer ${token}`}} )
                    .then( data => {
                        dispatch(orderPlaced());
                        window.location.href = "/thank-you";
                     })
                    .catch( err => {
                    alert("There was an error, please try again :(");
                        // window.location.href="/experiences/"+getState().experience.experienceId
                     });
                },
        //User details will be present as user is logged in
        "prefill": {
        // "name": getState().auth.name,
        // "email": getState().auth.email,
        // "contact": getState().auth.phone,
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
          // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id  
          _startRazorpayHandler(res.data)       

        }).catch(err => {
          // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id         
 
        })
    }
    
    const _cloneHandler = (data) => {
        console.log('data', data)
        axiospurchaseinstance.post("/", 
        {
            "itinerary_id": props.id,
            "number_of_adults": parseInt(props.pax),
            "number_of_children": 0,
            "number_of_infants": 0,
            "start_date": props.date.format('YYYY-MM-DD'),
            "registered_users": data.slice()
        }, {headers: {
            'Authorization': `Bearer ${props.token}`
            }}).then(res => {
          // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id   
          _saleCreateHandler(res.data.itinerary.id)      

        }).catch(err => {
          // window.location.href = 'https://www.thetarzanway.com/itinerary/'+res.data.itinerary.id         
 
        })
    }

  return(
      <div>
         
         <Modal className='booking-modal'  show={props.show} size="xl" onHide={props.hide}>
         <Modal.Header style={{   height: isPageWide? 'max-content' : '20vw', position: 'sticky', top: '0', backgroundColor: 'white', justifyContent: 'flex-start', padding: !isPageWide ?  '2rem 1rem' : '1rem',  backgroundColor: 'white', zIndex: '2'}}>
         <TbArrowBack onClick={props.hide} className="hover-pointer"   style={{margin: '0.5rem', fontSize: '1.75rem', textAlign: 'right',}} ></TbArrowBack>

            <p style={{fontWeight: '800', margin: '0', fontSize: '19px'}} className="font-opensans">Confirm and Buy</p>

              {/* <StyledFontAwesomeIcon onClick={props.onHide} icon={faChevronLeft}></StyledFontAwesomeIcon> */}
            </Modal.Header>

             <Body className="">
              <Cart date={props.date} pax={props.pax} plan={props.plan}></Cart>
                <p className='font-opensans text-center' style={{fontWeight: '800'}}>Traveler Details</p>
                <Form token={props.token} id={props.id} onSuccess={_cloneHandler} pax={props.pax}></Form>
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