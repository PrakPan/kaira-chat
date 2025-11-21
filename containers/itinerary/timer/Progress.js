import React, { useState } from "react";
import styled from "styled-components";

const ProgressContainer = styled.div`
  margin: 1rem 0;
`;

const Progress = (props) => {
  const [progress, setProgress] = useState(0);
  const [load, setLoad] = useState(false);
  const messages = [
    "Finding the ideal route for you",
    "Compiling the best stays and activities",
    "Negotiating for the best pricing",
  ];

  return (
    <ProgressContainer>
      <p
        className="font-nunito"
        style={{ textAlign: "center", fontWeight: "300", letterSpacing: "1px" }}
      >
        {load ? <em className="">{messages[progress]}</em> : null}
      </p>
    </ProgressContainer>
  );
};

export default React.memo(Progress);
