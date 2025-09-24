import React, { useEffect, useState } from "react";
import Mainheading from "./Mainheading";
import Simpleheading from "./Simpleheading";
import Defaultheading from "./Defaultheading";
import Bannerheading from "./Bannerheading";
import styled from "styled-components";

const Container = styled.div`
  @media screen and (min-width: 768px) {
    margin: 0;
    max-width: 100%;
  }
`;

const Container2 = styled.div``;

const Index = (props) => {
  const [JSX, setJSX] = useState("");

  useEffect(() => {
    if (props.bold) {
      setJSX(
        <Container style={{ margin: props.margin ? props.margin : "0" }}>
          <Mainheading
            className={props.blur ? "blurry-text " : ""}
            color={props.color}
            fontWeight={props.fontWeight}
            borderColor={props.borderColor}
            noline={props.noline}
            letterSpacing={props.letterSpacing}
            fontSize={props.fontSize}
            padding={props.padding}
            margin={props.margin}
            textAlign={props.textAlign}
            width={props.width}
            borderWidth={props.borderWidth}
            aligndesktop={props.aligndesktop}
            align={props.align}
            borderStyle={props.borderStyle}
            maxWidth={props.maxWidth}
            margindesktop={props.marginDesktop}
          >
            {props.children}
          </Mainheading>
        </Container>
      );
    } else if (props.thincaps) {
      setJSX(
        <Container style={{ margin: props.margin ? props.margin : "0" }}>
          <Simpleheading
            className={props.blur ? "blurry-text " : ""}
            color={props.color}
            fontWeight={props.fontWeight}
            borderColor={props.borderColor}
            noline={props.noline}
            letterSpacing={props.letterSpacing}
            fontSize={props.fontSize}
            padding={props.padding}
            margin={props.margin}
            textAlign={props.textAlign}
            width={props.width}
            borderWidth={props.borderWidth}
            aligndesktop={props.aligndesktop}
            align={props.align}
            borderStyle={props.borderStyle}
            maxWidth={props.maxWidth}
            margindesktop={props.marginDesktop}
          >
            {props.children}
          </Simpleheading>
        </Container>
      );
    } else if (props.bannerheading) {
      setJSX(
        <Container2>
          <Bannerheading
            className={props.blur ? "blurry-text " : ""}
            fontSize={props.fontSize}
            fontWeight={props.fontWeight}
            textAlign={props.textAlign}
            margin={props.margin}
            margindesktop={props.marginDesktop}
          >
            {props.children}
          </Bannerheading>
        </Container2>
      );
    } else {
      setJSX(
        <Container style={{ margin: props.margin ? props.margin : "0" }}>
          <Defaultheading
            className={props.blur ? "blurry-text " : ""}
            fontSize={props.fontSize}
            padding={props.padding}
            color={props.color}
            textAlign={props.textAlign}
            width={props.width}
            maxWidth={props.maxWidth}
            borderWidth={props.borderWidth}
            borderColor={props.borderColor}
            borderStyle={props.borderStyle}
            margin={props.margin}
            noline={props.noline}
            aligndesktop={props.aligndesktop}
            align={props.align}
            margindesktop={props.marginDesktop}
          >
            {props.children}
          </Defaultheading>
        </Container>
      );
    }
  }, [
    props.bold,
    props.thincaps,
    props.bannerheading,
    props.margin,
    props.align,
    props.noline,
    props.aligndesktop,
  ]);

  return <>{JSX}</>;
};

export default Index;
