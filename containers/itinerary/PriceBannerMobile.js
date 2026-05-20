import React from "react";
import styled from "styled-components";
import Button from "../../components/ui/button/Index";
import { getIndianPrice } from "../../services/getIndianPrice";

const FixedContainer = styled.div`
  width: 100%;
  color: white;
  position: sticky;
  top: 0;
  height: 66px;
  border-style: solid none none none;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 70%);
  z-index: 1000;
  display: flex;
  align-items: center;

  background-color: black;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const CostContainer = styled.div`
  position: absolute;
  right: 0;

  display: flex;
  flex-direction: row;
  z-index: 1000;
  align-items: center;
`;

const Cost = styled.div`
  /* H4 token · 17/1.2/700/-0.015em — primary price callout */
  text-align: right;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  &:after {
    /* Small body · 13/1.5/400 — sub-label */
    content: "per person";
    display: block;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.5;
    text-transform: none;
  }
`;

const DiscountContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
`;

const StrikedCost = styled.p`
  position: relative;
  width: max-content;
  flex-grow: 1;
  margin-bottom: 0;
  margin-right: 6px;
  /* Body · 14.5/1.55/400 — secondary (struck) price */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14.5px;
  font-weight: 400;
  line-height: 1.55;
  font-variant-numeric: tabular-nums;
  text-align: center;
  &:before {
    position: absolute;
    content: "";
    left: 0;
    top: 23%;
    right: 0;
    border-top: 2px solid;
    border-color: inherit;
    -webkit-transform: skewY(-12deg);
    -moz-transform: skewY(-12deg);
    transform: skewY(-12deg);
  }

  @media screen and (min-width: 768px) {
    font-size: 14.5px;
    &:before {
      position: absolute;
      content: "";
      left: 0;
      top: 16%;
      right: 0;
      border-top: 2px solid;
      border-color: inherit;
      -webkit-transform: skewY(-12deg);
      -moz-transform: skewY(-12deg);
      transform: skewY(-12deg);
    }
  }
`;

const Banner = (props) => {
  if (props.payment)
    return (
      <FixedContainer>
        <CostContainer>
          {true ? (
            <DiscountContainer>
              <div style={{ display: "flex" }}>
                {props.is_registration_needed ? (
                  <StrikedCost>
                    {"₹ " +
                      getIndianPrice(
                        Math.round(props.payment.per_person_total_cost / 100) *
                          2
                      )}
                  </StrikedCost>
                ) : null}
                <Cost className="">
                  {"₹ " +
                    getIndianPrice(
                      Math.round(props.payment.per_person_total_cost / 100)
                    ) +
                    " /-"}
                </Cost>
              </div>
            </DiscountContainer>
          ) : null}
          <Button
            onclick={props.openBooking}
            hoverBgColor="white"
            hoverColor="black"
            bgColor="#F7e700"
            borderStyle="none"
            borderRadius="5px"
            margin="0 0.5rem 0 0"
            padding="0.25rem 1rem"
          >
            {props.hasUserPaid
              ? "Details"
              : props.payment.bookings_count
              ? "View " + props.payment.bookings_count + " bookings"
              : "Book Now"}
          </Button>
        </CostContainer>
      </FixedContainer>
    );
  else return null;
};

export default React.memo(Banner);
