import styled from "styled-components";
import { MdClose } from "react-icons/md";
import { useEffect, useState } from "react";
const Container = styled.div`
  position: fixed;
  right: 1rem;
  top: ${(props) => (props.show ? "1%" : "-100%")};
  transition: 0.5s top;
  z-index: ${(props) => props.zIndex};
  @media screen and (min-width: 768px) {
    top: ${(props) => (props.show ? "5%" : "-100%")};
  }
`;
const PopupContainer = styled.div`
  position: relative;
  padding: 1rem;
  background: ${(props) => props.color};
  color: white;
  border-radius: 0.5rem;
  text-align: left;
  width : 90%;
  border-left: ${(props) => `10px solid ${props.bg}`};
  @media screen and (min-width: 768px) {
    width: 32rem;
  }
`;
const Heading = styled.h3`
  margin-block: 0 10px;
  font-size : 1.2rem;
`;
const Text = styled.div`
  margin-top: 0;
  font-size: 14px;
  margin-top: -6px;
`;
const CloseIcon = styled(MdClose)`
  font-size: 1.2rem;
  cursor: pointer;
`;
const OuterCircle = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  right: 10px;
  top: 10px;
`;
const InnerCircle = styled.div`
  background: ${(props) => props.color};
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;

export default function NotificationPopup(props) {
  const [color, setColor] = useState({
    color: "mediumseagreen",
    bg: "darkgreen",
  });
  var duration = 50;
  if (props.duration) {
    duration = props.duration * 10;
  }
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (props.show) {
    }
  }, [props.show]);

  useEffect(() => {
    if (props.show) {
      setTimeout(() => props.setShow(false), duration * 100);

      const timer = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress > 0 ? prevProgress - 1 : 0
        );
      }, duration);

      return () => clearInterval(timer);
    } else {
      setTimeout(() => {
        setProgress(100);
      }, 1000);
    }
  }, [props.show]);
  useEffect(() => {
    if (props.type === "error") {
      setColor({
        color: "#d21f3c",
        bg: "darkred",
      });
    } else if (props.type === "info") {
      setColor({
        color: "#0096FF",
        bg: "#0000FF",
      });
    } else
      setColor({
        color: "mediumseagreen",
        bg: "darkgreen",
      });
  }, [props.show, props.type]);
  return (
    <Container zIndex={props.zIndex || '5000'} show={props.show}>
      <PopupContainer color={color.color} show={props.show} bg={color.bg}>
        {props.heading && <Heading>{props.heading}</Heading>}
        <Text>{props.text}</Text>
        <div>
          <OuterCircle
            style={{
              background: `conic-gradient(white 0% ${progress}%, ${color.color} ${progress}% 100%)`,
            }}
          >
            <InnerCircle color={color.color}>
              <CloseIcon onClick={() => props.setShow(false)} />
            </InnerCircle>
          </OuterCircle>
        </div>
      </PopupContainer>
    </Container>
  );
}
