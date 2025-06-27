import styled from "styled-components";
import { MdClose } from "react-icons/md";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { closeNotification } from "../../store/actions/notification";

const Container = styled.div`
  position: fixed;
  right: 0px;
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
  width: 94vw;
  @media screen and (min-width: 768px) {
    width: 32rem;
  }
`;

const Heading = styled.h3`
  margin-block: 0 10px;
  font-size: 1.2rem;
  width: 284px;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const Text = styled.div`
  margin-top: 0;
  font-size: 14px;
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

function NotificationPopup(props) {
  const [_document, set_document] = useState(null);
  const [color, setColor] = useState({
    color: "mediumseagreen",
    bg: "darkgreen",
  });
  const [progress, setProgress] = useState(100);

  var duration = 50;
  if (props.duration) {
    duration = +props.duration * 10;
  }

  useEffect(() => {
    set_document(document);
  }, []);

  useEffect(() => {
    if (props.show) {
      setTimeout(() => props.closeNotification(), duration * 100);

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
        color: "#54C11D",
        bg: "darkgreen",
      });
  }, [props.show, props.type]);

  return _document
    ? ReactDOM.createPortal(
        <Container zIndex={props.zIndex || "5000"} show={props.show} className="md:!right-[2rem]">
          <PopupContainer color={color.color} show={props.show} bg={color.bg}>
            <Text>{props.text}</Text>
            <div>
              <OuterCircle
              // style={{
              //   background: `conic-gradient(white 0% ${progress}%, ${color.color} ${progress}% 100%)`,
              // }}
              >
                {/* >
                {/* <InnerCircle color={color.color}> */}
                <CloseIcon onClick={() => props.closeNotification()} />
                {/* </InnerCircle> */}
              </OuterCircle>
            </div>
          </PopupContainer>
        </Container>,
        _document.getElementById("modal-portal")
      )
    : null;
}

const mapStateToPros = (state) => {
  return {
    text: state.Notification.text,
    type: state.Notification.type,
    heading: state.Notification.heading,
    duration: state.Notification.duration,
    show: state.Notification.show,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState: () => dispatch(authaction.checkAuthState()),
    authCloseLogin: () => dispatch(authaction.authCloseLogin()),
    closeNotification: (payload) => dispatch(closeNotification()),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(NotificationPopup);
