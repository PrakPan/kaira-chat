import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
// import Heading from '../../../components/heading/Heading';
import Heading from '../../../components/newheading/heading/Index';
import Option from '../../../components/forms/Option';
import Dropdown from '../../../components/forms/Dropdown';
// import Button from '../../../components/Button';
import Button from '../../../components/ui/button/Index';
import { faWhatsapp} from "@fortawesome/free-brands-svg-icons"
import {connect} from 'react-redux';
import * as orderaction from '../../../store/actions/order';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRupeeSign, faTimes} from '@fortawesome/free-solid-svg-icons';
const SummaryContainer = styled.div`
height: max-content;
border-radius: 10px;
padding: 1rem;
margin: 1rem 0;
@media screen and (min-width: 768px){
    margin: 0;

}
`;
const INR = styled.p`
    font-weight: 600;
    font-size: 1.5rem;
    text-align: right;
 
`;
const Details = (props) => {
    const [details , setDetails] = useState({
        date: new Date('2021-04-20T21:11:54'),
        pax: 1,
        starting_point: "Delhi",

    })
  const [amount, setAmount] = useState(null);
    const handlePaxChange = (event) => {
      _calculateServiceFee(details.starting_point, event.target.value);
      setDetails({...details, pax: event.target.value});
    };
    const handleTypeChange = (event) => {
      setDetails({...details, starting_point: event.target.value})
      _calculateServiceFee(event.target.value, details.pax);
    };
    const handleDateChange = (date) => {
      setDetails({...details, date: date});
      // _calculateServiceFee();

    };
      const handleBlur = (event) => {
        if (event === undefined) return event;
      }
  const _startCheckoutHandler = () => {

    props.setOrderDetails({...details, experienceId: props.experienceId, date: details.date.getFullYear()+"-"+details.date.getMonth()+"-"+details.date.getDate()});
    props.history.push('/checkout/1')
  }
  let startingoptions = [];
  for(var i=0; i < props.payment.payment_info.length; i++){
    startingoptions.push(
      <Option>{props.payment.payment_info[i]["starting_point"]}</Option>
    )
  }
  const _getBasePrice = (payment_info, starting_point) => {
    for(var i = 0; i<payment_info.length; i++){
      if(payment_info[i]["starting_point"]===starting_point) return payment_info[i].base_price;
    }
    return null;
  }
  const _calculateServiceFee = (starting_point, pax) => {
    if(props.payment["service_fee_type"] ===  "% of base price"){
        if(props.payment["service_fee_multiplier"]=== "Multiply"){
          //get base price from selected starting point
          const baseprice = _getBasePrice(props.payment.payment_info, starting_point)
           // calculate final amount using base price, pax, service fee %
           const totalprice = (baseprice*pax) + (props.payment["service_fee_value"]/100 * baseprice * pax);
            setAmount(totalprice);
        }
    }
  }
    useEffect(()=> {
      _calculateServiceFee(props.payment.payment_info[0]["starting_point"], 1)
  },[])

   return(
    <SummaryContainer className="border-thin" >
     {window.innerWidth > 768 ? null :  <FontAwesomeIcon icon={faTimes} onClick={props.hide} style={{textAlign: 'right'}}/>}
    <Heading bold margin="0 auto 1.5rem auto" align="center">Enquire Now</Heading>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: "1rem"}}>
                <p style={{fontSize: "0.75rem", fontWeight: "400", letterSpacing: "1px"}} className="font-opensans text-enter">STARTING POINT?</p>
                <p style={{fontSize: "0.75rem", fontWeight: "400", letterSpacing: "1px"}} className="font-opensans text-enter">HOW MANY PEOPLE?</p>
                 <Dropdown
                value={details.starting_point}
                onChangeHandler={handleTypeChange}
                validate={handleBlur}
                borderColor="#e4e4e4"
                >
                {startingoptions}

                </Dropdown>
                <Dropdown
                value={details.pax}
                onChangeHandler={handlePaxChange}
                validate={handleBlur}
                borderColor="#e4e4e4"
                >
                <Option>{1}</Option>
                <Option>{2}</Option>
                <Option>{3}</Option>
                <Option>{4}</Option>
                <Option>{5}</Option>
                <Option>{6}</Option>
                <Option>{7}</Option>
                <Option>{8}</Option>

                </Dropdown>
        </div>
        <div>
                <p style={{fontSize: "0.75rem", fontWeight: "400", letterSpacing: "1px"}} className="font-opensans text-enter">WHEN WILL YOU LEAVE?</p>
                 {/* <Datepicker handleDateChange={handleDateChange} selectedDate={details.date}/> */}
            </div>
        <INR className="font-opensans"><FontAwesomeIcon icon={faRupeeSign}/>{" "+amount/100}</INR>
        {/* <Button width="100%" bgColor="#F7e700" borderRadius="5px" borderWidth="0px" margin="0 0 0.5rem 0" onclick={props.setShowEnquiry} >Proceed</Button>
        <Button onclick={()=> window.location.href="https://wa.me/9625509382?text=Hi%20The%20Tarzan%20Way!%20I%27d%20like%20to%20ask%20you%20something%20"} width="100%" bgColor="white" borderRadius="5px" borderWidth="1px" borderColor="#e4e4e4" >
          <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
          Connect on WhatsApp</Button> */}
           <Button boxShadow width="100%" bgColor="#F7e700" borderRadius="5px" borderWidth="0px" margin="0 0 0.5rem 0" onclick={props.setShowEnquiry} >Proceed</Button>
        <Button boxShadow onclick={()=> window.location.href="https://wa.me/9625509382?text=Hi%20The%20Tarzan%20Way!%20I%27d%20like%20to%20ask%20you%20something%20"} width="100%" bgColor="white" borderRadius="5px" borderWidth="1px" borderColor="#e4e4e4" >
          <FontAwesomeIcon icon={faWhatsapp} style={{marginRight: "0.5rem"}}/>
          Connect on WhatsApp</Button>
</SummaryContainer>

  );
}
const mapStateToProps = (state) => {
    return{
        experience: state.experience.experience,
        durationSelected: state.experience.durationSelected,
        pax: state.experience.pax,
        selectedDate: state.experience.selectedDate,
        experienceCost: state.experience.experienceCost,
        serviceFee: state.experience.serviceFee,
        totalCost: state.experience.totalCost,
        token: state.auth.token,
        checkoutStarted: state.experience.checkoutStarted,
        orderCreated: state.experience.orderCreated,
        couponApplied: state.experience.couponApplied,
        couponInvalid: state.experience.couponInvalid,
    }
  }
const mapDispatchToProps = dispatch => {
    return{
      setOrderDetails: (details) => dispatch(orderaction.setOrderDetails(details)),

    }
}
export default connect(mapStateToProps, mapDispatchToProps)((Details));
