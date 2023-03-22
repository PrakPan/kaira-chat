import { useState } from "react";
import styled from "styled-components"
import axios from 'axios';
import axiosSubscribeInstance from '../../services/subscribe/subscribe'
import Spinner from '../Spinner';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import media from '../media'
const Container = styled.div`
  height: 350px;
  width: 93%;
  margin: auto;
  background: #f7e700;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${props=>props.shadow &&'0px 0px 15px 3px rgba(0, 0, 0, 0.6)'};
  -webkit-box-shadow: ${props => props.shadow && '0px 0px 15px 3px rgba(0, 0, 0, 0.6)'};
  -moz-box-shadow: ${props => props.shadow && '0px 0px 15px 3px rgba(0, 0, 0, 0.6)'};

  @media screen and (min-width: 768px) {
    bottom: -8rem;
    width: 80%;
    position: absolute;
    border-radius: 20px;
    left: 10%;
  }
`;

const Heading = styled.h1`
  font-weight: 600;
  font-size: 34px;
  line-height: 43px;
  text-align: center;
  margin-block: 2rem 2rem;
  position: relative;
  @media screen and (min-width: 768px) {
    font-size: 36px;
    margin-block: 6rem 2rem;
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
  width : 100%;
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
  const [formData, setFormData] = useState({ name: '', email: '' })
     const [loading, setLoading] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
    let isPageWide = media("(min-width: 768px)");
  
  
  function _handleChange(e) {
    setFormData({...formData,[e.target.name] : e.target.value})
  }
  function _handleSubmit(e) {
    e.preventDefault()
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
            console.log(error)
          });
        }

    return (
      <Container shadow={props.shadow}>
        <Heading>Subscribe to our newsletter</Heading>
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
          <Button type="submit">
            Subscribe Now{" "}
            {loading && (
              <Spinner
                display="inline"
                size={16}
                margin="0 0 0 0.5rem"
                color='white'
              ></Spinner>
            )}
            {subscribe && (
              <FontAwesomeIcon
                style={{ marginLeft: "0.5rem" }}
                icon={faCheck}
              />
            )}
          </Button>
        </Form>
        {isPageWide && <Circle top={"-30%"} left={"-10%"} opacity={"0.5"}></Circle>}
        {isPageWide&&<Circle top={"65%"} left={"90%"}></Circle>}
      </Container>
    );
}

export default Subscribe