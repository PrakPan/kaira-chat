import React, { useEffect, useState } from "react";
import styled from "styled-components";

const ProgressContainer = styled.div`
  margin: 1rem 0;
`;

const Progress = (props) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressId = setInterval(function () {
      if (progress === 2) setProgress(0);
      else setProgress(progress + 1);
    }, 1500);
    return () => {
      clearInterval(progressId);
    };
  });

  return (
    <ProgressContainer>
      <p
        className="font-nunito"
        style={{ textAlign: "center", fontWeight: "300", letterSpacing: "1px" }}
      >
        <em className="font-lexend">{"Negotiating for the best pricing"}</em>
      </p>
    </ProgressContainer>
  );
};

export default React.memo(Progress);
