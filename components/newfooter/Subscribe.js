import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import axiosSubscribeInstance from "../../services/subscribe/subscribe";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import media from "../media";
import H2 from "../../components/heading/H2";
import H7 from "../../components/heading/H7";

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
      {isPageWide &&
        props.page === "Theme Page" &&
        props.slug === "honeymoon-2025" && (
          <>
            <div className="w-[20%] h-[70%] absolute left-0 top-0 z-50 overflow-hidden">
              <Image
                src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/join-hearts.png`}
                alt="Tilted Hearts"
                height={100}
                width={100}
                className="absolute left-[-1rem] top-[-1rem] object-cover object-left"
                style={{
                  width: "28rem", // Set width larger than parent
                  height: "28rem", // Set height larger than parent
                }}
              />
            </div>

            <div className="w-[20%] h-[70%] absolute right-0 bottom-0 z-50 overflow-hidden">
              <Image
                src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/join-hearts.png`}
                alt="Tilted Hearts"
                // fill
                height={100}
                width={100}
                className="absolute right-[-1rem] bottom-[-1rem] object-cover object-right"
                style={{
                  width: "28rem", // Set width larger than parent
                  height: "28rem", // Set height larger than parent
                }}
              />
            </div>
          </>
        )}

        {isPageWide &&
        props.slug === "icc-champions-trophy-2025" && (
          <>
            <div className="absolute bottom-0 left-0 w-full flex justify-between items-end overflow-hidden z-50">
  {/* First Image */}
  <div className="w-[30%] h-[10%]">
    <Image
      src="https://d31aoa0ehgvjdi.cloudfront.net/media/event/dubai-skyline-white-background 2.png"
      alt="Dubai Skyline"
      height={100}
      width={100}
      className="object-cover object-left"
      style={{
        width: "40rem", // Larger width
        height: "9rem",
      }}
    />
  </div>

  {/* Second Image */}
  <div className="w-[40%] h-[10%]">
    <Image
      src="https://d31aoa0ehgvjdi.cloudfront.net/media/event/dubai-skyline-white-background 2.png"
      alt="Dubai Skyline"
      height={100}
      width={100}
      className="object-cover object-left"
      style={{
        width: "40rem",
        height: "9rem",
      }}
    />
  </div>

  {/* Third Image */}
  <div className="w-[40%] h-[10%]">
    <Image
      src="https://d31aoa0ehgvjdi.cloudfront.net/media/event/dubai-skyline-white-background 2.png"
      alt="Dubai Skyline"
      height={100}
      width={100}
      className="object-cover object-left"
      style={{
        width: "40rem",
        height: "9rem",
      }}
    />
  </div>

  <div className="w-[30%] h-[10%]">
    <Image
      src="https://d31aoa0ehgvjdi.cloudfront.net/media/event/dubai-skyline-white-background 2.png"
      alt="Dubai Skyline"
      height={100}
      width={100}
      className="object-cover object-left"
      style={{
        width: "40rem", // Larger width
        height: "9rem",
      }}
    />
  </div>
</div>


</>
        )}

{isPageWide &&
        props.slug === "japan-cherry-blossom" && (
          <>
            <div className="absolute bottom-0 left-0 w-full flex justify-between items-end overflow-hidden z-10">
  {/* First Image */}
  <div className="w-[100%] h-[10%]">
    <Image
      src="https://d31aoa0ehgvjdi.cloudfront.net/media/themes/japan-footer.png"
      alt="Dubai Skyline"
      height={100}
      width={100}
      className="object-cover object-left"
      style={{
        width: "75rem", // Larger width
        height: "22rem",
      }}
    />
  </div>
</div>


</>
        )}

{isPageWide &&
        props.slug === "perfect-proposals-2025" && (
          <>
            <div className="absolute bottom-0 left-0 w-full flex justify-between items-end overflow-hidden z-10">
  {/* First Image */}
  <div className="w-[100%] h-[10%]">
    <Image
      src="https://d31aoa0ehgvjdi.cloudfront.net/media/themes/Proposal-footer.png"
      alt="Dubai Skyline"
      height={100}
      width={100}
      className="object-cover object-left"
      style={{
        width: "75rem", // Larger width
        height: "22rem",
      }}
    />
  </div>
</div>


</>
        )}

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

      {isPageWide && !props.slug === "japan-cherry-blossom" && (
        <Circle top={"-30%"} left={"-10%"} opacity={"0.5"}></Circle>
      )}

      {isPageWide && !props.slug === "japan-cherry-blossom" && <Circle top={"65%"} left={"90%"}></Circle>}
    </Container>
  );
};

export default Subscribe;
