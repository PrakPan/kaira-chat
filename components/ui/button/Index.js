import React, { useEffect, useState } from "react";
import Externallinkbutton from "./Externallinkbutton";
import Generalbutton from "./Generallinkbutton";
import Internallinkbutton from "./Internallinkbutton";
import PulseLoader from "react-spinners/PulseLoader";

const Index = (props) => {
  const [JSX, setJSX] = useState("");

  useEffect(() => {
    if (props.onclick) {
      setJSX(
        <Generalbutton
          className={` ${props?.className} `}
          onclick={() => props.onclick(props.onclickparam)}
          color={props.color}
          borderRadius={props.borderRadius}
          bgColor={props.loading ? "black" : props.bgColor}
          textDecor={props.textDecor}
          margin={props.margin}
          marginMobile={props.marginMobile}
          padding={props.padding}
          lineHeight={props.lineHeight}
          width={props.width}
          height={props.height}
          fontSize={props.fontSize}
          borderStyle={props.borderStyle}
          borderWidth={props.borderWidth}
          borderColor={props.borderColor}
          fontWeight={props.fontWeight}
          fontSizeDesktop={props.fontSizeDesktop}
          hoverColor={props.hoverColor}
          hoverBgColor={props.hoverBgColor}
          hoverBrColor={props.hoverBrColor}
          boxShadow={props.boxShadow}
          display={props.display}
          textAlign={props.textAlign}
          center={props.center}
          style={props.style}
          disabled={props.disabled}
        >
          <div style={{ position: "relative" }}>
            <div style={props.loading ? { visibility: "hidden" } : {}}>
              {props.children}
            </div>
            {props.loading && (
              <PulseLoader
                style={{
                  position: "absolute",
                  top: "55%",
                  left: "50%",
                  transform: "translate(-50% , -50%)",
                }}
                size={12}
                speedMultiplier={0.6}
                color="#ffffff"
              />
            )}
          </div>
        </Generalbutton>
      );
    } else if (props.link) {
      setJSX(
        <>
          <Internallinkbutton
            className={`font-lexend `}
            link={props.link}
            color={props.color}
            borderRadius={props.borderRadius}
            bgColor={props.loading ? "black" : props.bgColor}
            textDecor={props.textDecor}
            margin={props.margin}
            marginMobile={props.marginMobile}
            lineHeight={props.lineHeight}
            padding={props.padding}
            width={props.width}
            height={props.height}
            fontSize={props.fontSize}
            borderStyle={props.borderStyle}
            borderWidth={props.borderWidth}
            borderColor={props.borderColor}
            fontWeight={props.fontWeight}
            fontSizeDesktop={props.fontSizeDesktop}
            hoverColor={props.hoverColor}
            hoverBgColor={props.hoverBgColor}
            hoverBrColor={props.hoverBrColor}
            boxShadow={props.boxShadow}
            display={props.display}
            textAlign={props.textAlign}
            style={props.style}
          >
            <div style={{ position: "relative" }}>
              <div style={props.loading ? { visibility: "hidden" } : {}}>
                {props.children}
              </div>
              {props.loading && (
                <PulseLoader
                  style={{
                    position: "absolute",
                    top: "55%",
                    left: "50%",
                    transform: "translate(-50% , -50%)",
                  }}
                  size={12}
                  speedMultiplier={0.6}
                  color="#ffffff"
                />
              )}
            </div>
          </Internallinkbutton>
        </>
      );
    } else if (props.external_link) {
      setJSX(
        <Externallinkbutton
          className={`font-lexend `}
          external_link={props.external_link}
          color={props.color}
          borderRadius={props.borderRadius}
          bgColor={props.loading ? "black" : props.bgColor}
          textDecor={props.textDecor}
          margin={props.margin}
          marginMobile={props.marginMobile}
          lineHeight={props.lineHeight}
          padding={props.padding}
          width={props.width}
          height={props.height}
          fontSize={props.fontSize}
          borderStyle={props.borderStyle}
          borderWidth={props.borderWidth}
          borderColor={props.borderColor}
          fontWeight={props.fontWeight}
          fontSizeDesktop={props.fontSizeDesktop}
          hoverColor={props.hoverColor}
          hoverBgColor={props.hoverBgColor}
          hoverBrColor={props.hoverBrColor}
          boxShadow={props.boxShadow}
          display={props.display}
          textAlign={props.textAlign}
          style={props.style}
        >
          <div style={{ position: "relative" }}>
            <div style={props.loading ? { visibility: "hidden" } : {}}>
              {props.children}
            </div>
            {props.loading && (
              <PulseLoader
                style={{
                  position: "absolute",
                  top: "55%",
                  left: "50%",
                  transform: "translate(-50% , -50%)",
                }}
                size={12}
                speedMultiplier={0.6}
                color="#ffffff"
              />
            )}
          </div>
        </Externallinkbutton>
      );
    } else {
      setJSX(null);
    }
  }, [props.onclick, props.link, props.external_link]);

  return <>{JSX}</>;
};

export default Index;
