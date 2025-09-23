import React from "react";
import styled from "styled-components";

const HorizontalTestimonialCard = (props) => {
  const Container = styled.div`
    display: grid;
    grid-template-columns: 40% 60%;
    padding: 3rem;
  `;

  const Name = styled.p`
    font-size: 1.5rem;
    margin: 0.5rem;
  `;

  const Location = styled.p`
    font-size: 0.75rem;
    margin: 0;
  `;

  const Content = styled.div`
    line-height: 2;
    margin: 0;
    position: relative;
  `;

  const Quote = styled.div`
    position: absolute;
    right: -1rem;
    top: -3rem;
    font-size: 4rem;
  `;

  return (
    <Container className="border">
      <div className="center-div">
        <Name className="">
          <b>Dieter Arnold</b>
        </Name>
        <Location>GERMANY</Location>
      </div>
      <div className="font-nunito center-div">
        <Content>
          <Quote>&rdquo;</Quote>
          <p>
            I have traveled to India once before for visiting a close friend.
            Going through Tarzan Way is the closest I could hope to reach the
            same experience. From the moment I asked for information, The team
            was incredibly helpful. Tarzan Way was able to put together a custom
            itinerary to meet my exact needs, including time period, budget, and
            desired activities. I felt secure in every communication and
            transaction, and they came through with many personal touches. I
            highly recommend it to anyone looking for a meaningful trip to
            India! Also, a solid 9/10 would be my rating, since there's always a
            room for improvement. :)
          </p>
        </Content>
      </div>
    </Container>
  );
};

export default HorizontalTestimonialCard;
