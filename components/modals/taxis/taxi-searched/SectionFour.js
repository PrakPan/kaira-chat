import React, { useState } from "react";
import styled from "styled-components";
import media from "../../../media";
import Accordion, {
  AccordionSummary,
  AccordionDetails,
} from "../../../ui/Accordion";
import axiosgozotaxiupdateinstance from "../../../../services/bookings/UpdateTaxiGozo";
import { openNotification } from "../../../../store/actions/notification";


import Button from "../../../ui/button/Index";
import {
  AiFillPlusSquare,
  AiOutlinePlusSquare,
  AiOutlineMinusSquare,
} from "react-icons/ai";
import { getIndianPrice } from "../../../../services/getIndianPrice";
import DropDown from "./Dropdown";
import { ImCheckboxUnchecked } from "react-icons/im";
import { connect } from "react-redux";
import { PulseLoader } from "react-spinners";
const Container = styled.div`
  margin: 0;
  @media screen and (min-width: 768px) {
  }
`;
const GridContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media screen and (min-width: 768px) {
    justify-content: flex-end;
    gap: 0.5rem;
    margin-right: 1rem;
  }
`;
const Cost = styled.p`
  font-weight: 800;
  font-size: 1rem;
  line-height: 1;
  margin: 0;

  @media screen and (min-width: 768px) {
    font-size: 1.25rem;
  }
`;
const CounterContainer = styled.div`
  background-color: #f7e700;
  border-radius: 10px;
  padding: 0.25rem 1rem;
  margin: 0.25rem 0 0 0;
  &:hover {
    cursor: pointer;
  }
`;
const FlexBox = styled.div`
  //  border : 2px solid red;
  //  align-items : center;
  //  justify-content : space-between;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: auto 14rem;
    gap: 0;
  }
`;
const AccordionHeading = styled.div`
  font-size: 14px;
  font-weight: 500;
`;
const AccordionText = styled.div`
  font-size: 13px;
  font-weight: 300;
`;
const SelectBox = styled.div`
  justify-content: center;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  @media screen and (min-width: 768px) {
  }
  span {
    margin-top: 0.1rem;
  }
`;
const Section = (props) => {
  const [open, setOpen] = useState(false);
  let isPageWide = media("(min-width: 768px)");
  const [showCounter, setShowCounter] = useState(false);
  const [counterValue, setCounterValue] = useState(1);
  const [loading , setLoading] = useState(false)

  const _increaseCounter = () => {
    setCounterValue(counterValue + 1);
  };

  const _decreaseCounter = () => {
    if (counterValue === 1) setShowCounter(false);
    else {
      setCounterValue(counterValue - 1);
    }
  };
  let bagCapacity = 0;
  if (props.data.cab.bagCapacity) bagCapacity += props.data.cab.bagCapacity;
  if (props.data.cab.bigBagCapaCity)
    bagCapacity += props.data.cab.bigBagCapaCity;
  //    if(props.data)

  const _updateBookingHandler = () => {
 
    setLoading(true)
    axiosgozotaxiupdateinstance
      .post("", {
        itinerary_id: props.selectedBooking.itinerary_id,
        trace_id: props.data.trace_id,
        cab_id: props.data.cab.id,
        booking_id: props.selectedBooking.id,
        model:props.data.cab.model,
        routes: [
          {
            source: props.selectedBooking.city,
            destination: props.selectedBooking.destination_city,
            startDate: props.selectedBooking.check_in,
            startTime: "12:00:00",
          },
        ],
        tripType: props.selectedBooking.transfer_type,
        traveller: {
          name: props.name,
          primaryContact: {
            number: props.phone,
          },
          email: props.email,
        },
        additionalInfo: {
          specialInstructions: "",
          noOfAdults: props.selectedBooking.pax.number_of_adults,
          noOfChildren: props.selectedBooking.pax.number_of_children, 
          noOfInfants: props.selectedBooking.pax.number_of_infants,
          noOfLargeBags: props.data.cab.bigBagCapaCity,
          noOfSmallBags: props.data.cab.bagCapacity,
          carrierRequired: 0,
          kidsTravelling: props.selectedBooking.pax.number_of_children,
          seniorCitizenTravelling: 0,
          womanTravelling: 0,
        },
      })
      .then((res) => {
    setLoading(false);
        props.openNotification({
          type: "success",
          text: "Taxi changed successfully.",
          heading: "Sucess!",
        });
        props._updateTaxiBookingHandler([res.data])
      props.getPaymentHandler();
      })
      .catch((e) => {
        setLoading(false)
         props.openNotification({
           type: "error",
           text: "There seems to be a problem, please try again after some time!",
           heading: "Error!",
         });
      })
  };

  return (
    <Container className="font-lexend">
      <FlexBox>
        <Accordion
          borderRadius="0.5rem"
          open={open}
          setOpen={setOpen}
          iconStyle={{ right: "unset", left: "75px" }}
        >
          <AccordionSummary
            style={isPageWide ? { padding: "0.5rem 0rem" } : {}}
          >
            Facilities
          </AccordionSummary>
          <AccordionDetails style={!isPageWide ? { marginBottom: "1rem" } : {}}>
            {props.data.cab.instructions &&
            props.data.cab.instructions.length ? (
              <AccordionText>
                {props.data.cab.instructions.map((e) => (
                  <div style={{ marginLeft: isPageWide ? "0.75rem" : "" }}>
                    - {e}
                  </div>
                ))}
              </AccordionText>
            ) : (
              <></>
            )}
            {bagCapacity && (
              <AccordionText>
                <div style={{ marginLeft: isPageWide ? "0.75rem" : "" }}>
                  - {bagCapacity} Luggage bags
                </div>
              </AccordionText>
            )}
          </AccordionDetails>
        </Accordion>
        <GridContainer>
          <div className="center-div" style={{ marginRight: "0.5rem" }}>
            <Cost>
              {/* {"₹ " + (getIndianPrice(Math.round(props.data.price * counterValue/100)) )+" /-"} */}
              {"₹" + props.data.fare.totalAmount + "/-"}
            </Cost>
          </div>
          {/* <Button width="100%" borderRadius="0 0 0 10px" borderStyle="solid solid none none" borderColor="rgba(222, 222, 222, 1)" borderWidth="1px" onclickparam={null} onclick={() => console.log('test')}>View Details</Button> */}
          {/* {!showCounter ? 
            <Button width="max-content" margin="0.25rem 0 0 0"  padding="0.25rem 1rem" borderRadius="10px" borderStyle="solid none none none"  borderColor="rgba(222, 222, 222, 1)" borderWidth="1px" bgColor="#f7e700" color="black" onclickparam={null} onclick={() =>  setShowCounter(true)}>Select</Button>
         : <CounterContainer className='center-div font-lexend' >
         <div style={{width: 'max-content', display: 'grid', gridGap: '0.25rem', gridTemplateColumns: 'max-content max-content max-content'}}>
         <div className='center-div'><AiOutlineMinusSquare onClick={_decreaseCounter} style={{fontSize: '1rem'}}></AiOutlineMinusSquare></div>
         <div style={{lineHeight: 'normal'}}>{counterValue}</div>
         <div className='center-div'><AiOutlinePlusSquare onClick={_increaseCounter}></AiOutlinePlusSquare></div>

         </div>
       
       </CounterContainer>} */}
          {/* <DropDown
              itinerary_id={props.selectedBooking.itinerary_id}
              transfer_type={props.selectedBooking.transfer_type}
              taxi_type={props.data.taxi_type}
              duration={
                props.selectedBooking.costings_breakdown
                  ? props.selectedBooking.costings_breakdown.duration
                    ? props.selectedBooking.costings_breakdown.duration.value
                    : null
                  : null
              }
              onclick={props._updateSearchedTaxi}
            ></DropDown> */}
          <SelectBox>
            {loading ? (
              <PulseLoader size={8} speedMultiplier={0.6} color="#111" />
            ) : (
              <>
                <div onClick={_updateBookingHandler}>
                  <ImCheckboxUnchecked style={{ display: "inline" }} />
                </div>
                <span onClick={_updateBookingHandler}>Select </span>
              </>
            )}
          </SelectBox>
        </GridContainer>
      </FlexBox>
    </Container>
  );
  //   else return null;
};

const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    phone: state.auth.phone,
    email: state.auth.email,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};
export default connect(mapStateToPros, mapDispatchToProps)(Section);
