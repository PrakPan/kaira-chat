import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 1rem 1rem 0;
  @media screen and (min-width: 768px) {
  }
`;

const Heading = styled.h2`
  font-size: 1.25rem;
  text-align: center;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
`;

const Description = styled.p`
  font-weight: 100;
  text-align: center;
  letter-spacing: 1px;
  @media screen and (min-width: 768px) {
    margin: 2rem 2rem 0 2rem;
    text-align: center;
  }
`;

const ReadMore = styled.p`
  font-weight: 100;
  text-align: center;
  letter-spacing: 1px;
  @media screen and (min-width: 768px) {
    margin: 2rem 2rem 0 2rem;
    text-align: center;
  }
  &:hover {
    cursor: pointer;
  }
`;

const Overview = (props) => {
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (props.short_description)
      if (props.short_description.length > 250) setShowMore(true);
  }, [props.short_description]);

  return (
    <div>
      {props.short_description ? (
        <Container>
          <Heading align="center" className="" bold>
            About
          </Heading>

          <div style={{ display: "grid", gridTemplateColumns: "1fr" }}>
            <Description className="font-nunito">
              {showMore
                ? props.short_description.substring(0, 250)
                : props.short_description}
            </Description>

            {showMore ? (
              <Description style={{ margin: "0" }} className="font-nunito">
                ...
              </Description>
            ) : null}
            {showMore ? (
              <ReadMore
                style={{ margin: "0", textDecoration: "underline" }}
                className="font-nunito"
                onClick={() => setShowMore(false)}
              >
                Read More
              </ReadMore>
            ) : null}
          </div>
        </Container>
      ) : null}
    </div>
  );
};

export default Overview;
