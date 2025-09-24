import React, { useState } from "react";
import styled from "styled-components";
import media from "../../../media";
import { GiCarSeat } from "react-icons/gi";
import { openNotification } from "../../../../store/actions/notification";
import { connect } from "react-redux";
import {  MdLuggage } from "react-icons/md";

const Container = styled.div`
  margin: 0;
  width: 100%;
  @media screen and (min-width: 768px) {
    width: 100%;
  }
`;

const FlexBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: auto;
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
  if (props.data?.taxi_category?.bag_capacity)
    bagCapacity += props.data.taxi_category.bag_capacity;

  return (
    <Container className="">
      <div className="flex flex-row gap-2 w-full">
        <div className="flex items-center gap-2 font-normal text-lg p-[0.4rem] w-fit">
          <GiCarSeat fontWeight={500}/>
          {props.data?.taxi_category?.seating_capacity + `${props.data?.taxi_category?.seating_capacity==1?" seat":" seats"}`}
        </div>
        {bagCapacity && (
          <div
            className="flex items-center justify-center font-normal text-lg p-[0.4rem] w-fit"
          >
            <MdLuggage fontWeight={500}/>
            
            <>
            {bagCapacity > 1 ? bagCapacity + " Luggage bags" : bagCapacity + " Luggage bag" } 
            </>
          </div>
        )}
        {/* <FlexBox>
        <Accordion
          borderRadius="0.5rem"
          open={open}
          setOpen={setOpen}
          iconStyle={{ right: "unset", left: "75px" }}
        >
          <AccordionSummary
            style={isPageWide ? { padding: "0.5rem 0rem" } : {padding: "0.5rem"}}
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
      </FlexBox> */}
      </div>
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
