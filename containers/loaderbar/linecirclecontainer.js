import styled from "styled-components";
import { useSpring, animated } from "react-spring";

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Text = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: black;
  margin-bottom: 2px;
`;

const ProgressBarWrapper = styled.div`
  width: 95%;

  height: 1rem;
  background-color: #f4f4f4;
  border-radius: 9999px;
  margin-top: 8px;
  @media screen and (min-width: 768px) {
    width: 33.33%;
  }
`;

const ProgressBar = styled(animated.div)`
  height: 100%;
  border-radius: 9999px;
  background-color: #8ccf24;
  ${(props) => props.animation}
`;

const ResponsiveProgressBar = ({ progress }) => {
  const progressBarAnimation = useSpring({
    width: `${progress * 20}%`,
    from: { width: "0%" },
  });

  return (
    <Container>
      <Text>{`${progress * 20}%`} Done</Text>
      <ProgressBarWrapper>
        <ProgressBar style={progressBarAnimation} />
      </ProgressBarWrapper>
    </Container>
  );
};

export default ResponsiveProgressBar;
