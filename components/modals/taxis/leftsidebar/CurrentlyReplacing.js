import React from "react";
import styled from "styled-components";

const Container = styled.div`
  bottom: 0;
  @media screen and (min-width: 768px) {
    margin: 0 0.5rem;
  }
`;

const TextContainer = styled.div`
  margin: 0 -1rem;

  @media screen and (min-width: 768px) {
    margin: 0;
  }
`;

const HelperText = styled.p`
  color: black;
  font-size: 0.75rem;
  margin: 0 0 0.5rem 0;
  display: block;
  padding: 0.75rem 0;
  line-height: 1;
  text-align: center;
  background-color: #f7e700;

  @media screen and (min-width: 768px) {
    text-align: left;
    background-color: white;
    margin: 0.5rem 0 0 0;
    padding: 0;
  }
`;

const Name = styled.p`
  font-weight: 700;
  font-size: 1.25rem;
  display: block;
  margin: 0;
  text-align: center;
  @media screen and (min-width: 768px) {
    text-align: left;
  }
`;

const DetailsContainer = styled.div`
  margin: 0;
  @media screen and (min-width: 768px) {
    margin: 0.5rem 0;
  }
`;

const Detail = styled.p`
  font-size: 0.75rem;
  margin: 0;
  color: hsl(0, 0%, 50%);
  text-align: center;
  @media screen and (min-width: 768px) {
    text-align: left;
  }
`;

const CurrentlyReplacing = (props) => {
  return (
    <Container>
      <TextContainer>
        <div>
          <HelperText className="font-nunito">CURRENTLY REPLACING</HelperText>
          <Name className="">{props.replacing}</Name>
          {props.selectedBooking ? (
            <DetailsContainer>
              {props.selectedBooking.check_in ? (
                <Detail className="">
                  {"Check in: " + props.selectedBooking.check_in}
                </Detail>
              ) : null}
              {props.selectedBooking.check_out ? (
                <Detail className="">
                  {"Check out: " + props.selectedBooking.check_out}
                </Detail>
              ) : null}
            </DetailsContainer>
          ) : null}
        </div>
      </TextContainer>
    </Container>
  );
};

export default CurrentlyReplacing;
