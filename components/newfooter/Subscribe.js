import { useState } from "react";
import styled from "styled-components";
import axiosSubscribeInstance from "../../services/subscribe/subscribe";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import media from "../media";
import H2 from "../../components/heading/H2";
import H7 from "../../components/heading/H7";
import Image from "next/image";

const Container = styled.div`
  height: 375px;
  width: 93%;
  margin: auto;
  background: #f7e700;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${(props) =>
    props.shadow && "0px 0px 15px 3px rgba(0, 0, 0, 0.6)"};
  -webkit-box-shadow: ${(props) =>
    props.shadow && "0px 0px 15px 3px rgba(0, 0, 0, 0.6)"};
  -moz-box-shadow: ${(props) =>
    props.shadow && "0px 0px 15px 3px rgba(0, 0, 0, 0.6)"};

  @media screen and (min-width: 768px) {
    bottom: -8rem;
    width: 80%;
    position: absolute;
    border-radius: 20px;
    left: 10%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin: auto;
  gap: 10px;
  @media screen and (min-width: 768px) {
    flex-direction: row;
    width: 60%;
  }
`;

const Input = styled.input`
  padding: 15px 17px;
  border-radius: 5px;
  border: 1px solid #333333;
  background: #f7e700;
  color: #01202b;
  width: 100%;
  font-weight: 400;
  font-size: 16px;
  &:placeholder {
    color: #01202b;
  }
`;

const Button = styled.button`
  background: #090914;
  border: 0px;
  border-radius: 8px;
  color: white;
  padding: 15px;
  width: 100%;
`;

const Circle = styled.div`
  border: 5px solid white;
  height: 200px;
  width: 250px;
  border-radius: 100%;
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  opacity: ${(props) => props.opacity || 1};
`;

const Subscribe = (props) => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  let isPageWide = media("(min-width: 768px)");

  function _handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function _handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    axiosSubscribeInstance
      .post("", formData)
      .then((res) => {
        setSubscribe(true);
        setLoading(false);
      })
      .catch((error) => {
        alert("There was a problem, please refresh and try again.");
        setLoading(false);
      });
  }

  return (
    <Container shadow={props.shadow}>
      <H2
        style={{
          color: "black",
          marginBlock: isPageWide ? "5rem 0rem" : "2rem 0.5rem",
          textAlign: "center",
        }}
      >
        Join The Tarzan Way Community
      </H2>

      <H7
        style={{
          textAlign: "center",
          marginBlock: isPageWide ? "0.5rem 3.5rem" : "0rem 2rem",
          fontSize: isPageWide ? "22px" : "16px",
          position: "relative",
        }}
      >
        Get Early Bird Deals, Extra Discounts & Priority Customer Support.
      </H7>

      <Form onSubmit={_handleSubmit}>
        <Input
          required
          type="text"
          name="name"
          onChange={_handleChange}
          value={formData.name}
          placeholder="First name"
        />
        <Input
          required
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={_handleChange}
        />
        <Button type="submit" loading={loading ? "true" : undefined}>
          Subscribe Now{" "}
          {subscribe && (
            <FontAwesomeIcon style={{ marginLeft: "0.5rem" }} icon={faCheck} />
          )}
        </Button>
      </Form>

      {isPageWide && (
        <Circle top={"-30%"} left={"-10%"} opacity={"0.5"}></Circle>
      )}

      {isPageWide && (
        <Image
          src={`https://d31aoa0ehgvjdi.cloudfront.net/media/new-year/join-asset-1.png`}
          className="absolute top-0 left-0 z-50"
          width={300}
          height={300}
        />
      )}

      {isPageWide && (
        <Image
          src={`https://d31aoa0ehgvjdi.cloudfront.net/media/new-year/join-asset-2.png`}
          className="absolute top-0 right-0 z-50"
          width={300}
          height={300}
        />
      )}

      {isPageWide && <Circle top={"65%"} left={"90%"}></Circle>}
    </Container>
  );
};

export default Subscribe;
