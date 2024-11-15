import React, { useState } from "react";
import styled from "styled-components";
import media from "../../../media";
import Accordion, {
  AccordionSummary,
  AccordionDetails,
} from "../../../ui/Accordion";
import axiosgozotaxiupdateinstance, { axiosTaxiBooking } from "../../../../services/bookings/UpdateTaxiGozo";
import { openNotification } from "../../../../store/actions/notification";
import { connect } from "react-redux";


const Container = styled.div`
  margin: 0;
  @media screen and (min-width: 768px) {
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

const Section = (props) => {
  const [open, setOpen] = useState(false);
  let isPageWide = media("(min-width: 768px)");
  const [loading, setLoading] = useState(false);

  let bagCapacity = 0;
  if (props.data?.taxi_category?.bag_capacity) bagCapacity += props.data.taxi_category.bag_capacity;

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
