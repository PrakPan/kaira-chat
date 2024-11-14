import React, { useState } from "react";
import styled from "styled-components";
import media from "../../../media";
import Accordion, {
  AccordionSummary,
  AccordionDetails,
} from "../../../ui/Accordion";
import axiosgozotaxiupdateinstance, { axiosTaxiBooking } from "../../../../services/bookings/UpdateTaxiGozo";
import { openNotification } from "../../../../store/actions/notification";
import { ImCheckboxUnchecked } from "react-icons/im";
import { connect } from "react-redux";
import { PulseLoader } from "react-spinners";
import { getIndianPrice } from "../../../../services/getIndianPrice";

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
    flex-direction: column;
    justify-content: flex-end;
    align-items: end;
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

const FlexBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: auto 14rem;
    gap: 0;
  }
`;

const AccordionText = styled.div`
  font-size: 13px;
  font-weight: 300;
`;

const SelectBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  const [loading, setLoading] = useState(false);

  let bagCapacity = 0;
  if (props.data?.taxi_category?.bag_capacity) bagCapacity += props.data.taxi_category.bag_capacity;

  const handleUpdate = () => {
    setLoading(true);

    const requestData = {
      trace_id: props.data.trace_id,
      result_index: props.data.result_index
    }

    axiosTaxiBooking.post(`${props.selectedBooking.itinerary_id}/bookings/taxi/`, requestData).then(res => {
      setLoading(false);
      props.openNotification({
        type: "success",
        text: "Taxi changed successfully.",
        heading: "Sucess!",
      });
      props._updateTaxiBookingHandler([res.data]);
      props.getPaymentHandler();
    }).catch(err => {
      setLoading(false);
      props.openNotification({
        type: "error",
        text: "There seems to be a problem, please try again after some time!",
        heading: "Error!",
      });
    })
  }

  const _updateBookingHandler = () => {
    setLoading(true);
    axiosgozotaxiupdateinstance
      .post("", {
        itinerary_id: props.selectedBooking.itinerary_id,
        trace_id: props.data.trace_id,
        cab_id: props.data.cab.id,
        booking_id: props.selectedBooking.id,
        model: props.data.cab.model,
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
        props._updateTaxiBookingHandler([res.data]);
        props.getPaymentHandler();
      })
      .catch((e) => {
        setLoading(false);
        props.openNotification({
          type: "error",
          text: "There seems to be a problem, please try again after some time!",
          heading: "Error!",
        });
      });
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
            {props.data?.instructions &&
              props.data?.instructions?.length ? (
              <AccordionText>
                {props.data.instructions.map((e) => (
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
            <Cost>{"₹" + getIndianPrice(Math.ceil(props.data.price.total)) + "/-"}</Cost>
          </div>

          <SelectBox>
            {loading ? (
              <PulseLoader size={8} speedMultiplier={0.6} color="#111" />
            ) : (
              <button
                onClick={handleUpdate}
                className="focus:outline-none border-2 border-black rounded-lg px-4 py-2 bg-[#F7E700] hover:bg-black hover:text-white transition-all"
              >Select</button>
            )}
          </SelectBox>
        </GridContainer>
      </FlexBox>
    </Container>
  );
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
