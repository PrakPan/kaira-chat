import React, { useEffect } from "react";
import Image from "./Image";
import ContactForm from "./Form/TestForm";
import ContactInfo from "./ContactInfo";
import YellowContainer from "./YellowContainer";
import dynamic from "next/dynamic";
const MapBox = dynamic(() => import("../../components/Map.js"), {
  ssr: false,
});

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ marginTop: "72px" }}>
      <Image></Image>
      <YellowContainer desktopWidth="70%" mobileWidth="95%">
        <ContactForm></ContactForm>

        <ContactInfo></ContactInfo>

        <MapBox
          center={{ lat: 28.5779959, lng: 77.343917 }}
          defaultZoom={14}
          InfoWindowContainer={
            <h4 style={{ padding: "0rem 1rem" }}>The tarzan way</h4>
          }
          height={"500px"}
        />
      </YellowContainer>
    </div>
  );
};

export default Contact;
