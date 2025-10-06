import styled from "styled-components";

const Defaultheadingstyle = styled.div`
  font-size: ${(props) => (props.fontSize ? props.fontSize : "2rem")};

  padding: ${(props) => (props.padding ? props.padding : "5px")};

  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  @media screen and (max-width: 768px) {
    color: ${(props) => (props.color ? props.color : "black")};
    margin: ${(props) => (props.noline ? "0" : "0  0 0.5rem 0")};
  }

  @media screen and (min-width: 768px) {
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : "100%")};
    width: ${(props) => (props.width ? props.width : "max-content")};
    border-width: ${(props) => (props.borderWidth ? props.borderWidth : "2px")};
    font-size: ${(props) => (props.fontSize ? props.fontSize : "3rem")};
    border-style: ${(props) =>
      props.borderStyle
        ? props.borderStyle
        : props.noline
        ? "none"
        : "none none solid none"};
    text-align: ${(props) =>
      props.textAlign
        ? props.textAlign
        : props.aligndesktop
        ? props.aligndesktop
        : props.align};
    margin: ${(props) =>
      props.aligndesktop === "center" && props.margin
        ? props.margin + " auto"
        : props.margin};
    border-color: ${(props) =>
      props.borderColor ? props.borderColor : "#F7E700"};
  }
`;

const Defaultheading = (props) => {
  return (
    <Defaultheadingstyle
      className=""
      fontSize={props.fontSize} //1
      padding={props.padding} //3
      color={props.color} //4
      textAlign={props.textAlign} //5
      width={props.width} //7
      maxWidth={props.maxWidth} //6
      borderWidth={props.borderWidth} //7
      borderColor={props.borderColor} //10
      borderStyle={props.borderStyle} //8
      margin={props.margin} //9
      noline={props.noline}
      aligndesktop={props.aligndesktop}
      align={props.align}
    >
      {props.children}
    </Defaultheadingstyle>
  );
};

export default Defaultheading;
