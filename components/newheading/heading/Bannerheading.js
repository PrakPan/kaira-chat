import styled from "styled-components";

const Bannerheadingstyle = styled.div`
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "700")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "2.5rem")};
  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  @media screen and (min-width: 768px) {
    font-size: ${(props) => (props.fontSize ? props.fontSize : "5rem")};
    margin: ${(props) => (props.margin ? props.margin : "3rem")};
    font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "800")};
  }
`;

const Bannerheading = (props) => {
  return (
    <Bannerheadingstyle
      className="font-lexend"
      fontSize={props.fontSize}
      fontWeight={props.fontWeight}
      textAlign={props.textAlign}
      margin={props.margin}
    >
      {props.children}
    </Bannerheadingstyle>
  );
};

export default Bannerheading;
