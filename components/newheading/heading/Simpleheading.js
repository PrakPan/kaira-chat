import styled from "styled-components";

const Simpleheadingstyle = styled.div`
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "100")};
  border-style: ${(props) =>
    props.borderStyle
      ? props.borderStyle
      : props.noline
      ? "none"
      : "none none solid none"};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "1.5rem")};

  padding: ${(props) => (props.padding ? props.padding : "0 0 0.25rem 0")};

  width: ${(props) =>
    props.width ? props.width : props.noline ? "100%" : "max-content"};
  border-color: ${(props) =>
    props.borderColor ? props.borderColor : "#F7E700"};
  max-width: ${(props) =>
    props.maxWidth ? props.maxWidth : props.noline ? "100%" : "85%"};
  letter-spacing: ${(props) =>
    props.letterSpacing ? props.letterSpacing : "3px "};

  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  @media screen and (max-width: 768px) {
    color: ${(props) => (props.color ? props.color : "black")};
    margin: ${(props) => (props.noline ? "0" : "0 auto 0.5rem auto")};
  }
  @media screen and (min-width: 768px) {
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : "100%")};
    width: ${(props) => (props.width ? props.width : "max-content")};
    border-width: ${(props) => (props.borderWidth ? props.borderWidth : "2px")};
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
  }
`;

const Simpleheading = (props) => {
  return (
    <Simpleheadingstyle
      className=""
      color={props.color} //6
      fontWeight={props.fontWeight} //1
      borderColor={props.borderColor} //8
      noline={props.noline} //12
      letterSpacing={props.letterSpacing} //10
      fontSize={props.fontSize} //3
      padding={props.padding} //5
      margin={props.margin} //4
      textAlign={props.textAlign} //11
      width={props.width} //7
      borderWidth={props.borderWidth} //15
      aligndesktop={props.aligndesktop} //13
      align={props.align} //14
      borderStyle={props.borderStyle} //2
      maxWidth={props.maxWidth} //9
    >
      {props.children}
    </Simpleheadingstyle>
  );
};

export default Simpleheading;
