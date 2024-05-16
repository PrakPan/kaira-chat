import React from "react";
import { Container, Line, TInfoContainer } from "./New_itenaryStyled";
import ImageLoader from "../../../components/ImageLoader";
import { FaCarSide } from "react-icons/fa";

const NewCity = (props) => (
  <Container style={{ fontSize: "14px", fontWeight: "500" }}>
    {props.newcity.city_data.image ? (
      <div
        style={{
          position: "absolute",

          marginTop: "10px",
        }}
      >
        {props.newcity.city_data.image ? (
          <ImageLoader
            dimensions={{ width: 100, height: 100 }}
            dimensionsMobile={{ width: 250, height: 200 }}
            borderRadius="8px"
            hoverpointer
            onclick={() => console.log("")}
            width="60%"
            leftalign
            widthmobile="100%"
            url={props.newcity.city_data.image}
          ></ImageLoader>
        ) : (
          <FaCarSide />
        )}
      </div>
    ) : (
      <div
        style={{
          position: "absolute",

          marginTop: "10px",
        }}
        className="text-4xl pl-4"
      >
        <FaCarSide className="text-4xl" />
      </div>
    )}
    <div className="flex flex-row pt-2">
      <div className="pl-[8rem] w-full">
        <div className="pb-[1rem] pt-[0.6rem] text-base font-semibold">
          Arrive in {props.newcity.city_data.city_name}{" "}
        </div>
        <Line></Line>
      </div>
    </div>

    <TInfoContainer></TInfoContainer>
  </Container>
);

export default NewCity;
