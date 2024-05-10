import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ImageLoader from "../../../components/ImageLoader";
import questioncontansts from "../questioncontansts";

const Container = styled.div`
  @media screen and (min-width: 768px) {
    margin-top: 2rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: max-content max-content max-content;
  grid-gap: 1rem;
  margin: 0rem 0;
  @media screen and (min-width: 768px) {
  }
`;

const Icon = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const CounContainer = styled.div`
  width: 2rem;
  @media screen and (min-width: 768px) {
    width: 3rem;
  }
`;

const Age = styled.p`
  font-size: 0.8rem;
  fort-weight: 300;
`;

const Counter = (props) => {
  const [counter, setCounter] = useState(1);

  useEffect(() => {
    setCounter(props.defaultcounter);
    let UPDATED_NEW_ANSWERS = { ...props.newAnswers } || {};
    UPDATED_NEW_ANSWERS[props.type] = props.defaultcounter;
    props.setNewAnswers(UPDATED_NEW_ANSWERS);
  }, [props.defaultcounter]);

  useEffect(() => {
    if (props.newAnswers[questioncontansts.PAX]) {
      if (
        props.newAnswers[questioncontansts.PAX]["number_of_adults"] &&
        props.type === "number_of_adults"
      )
        setCounter(props.newAnswers[questioncontansts.PAX]["number_of_adults"]);
      if (
        props.newAnswers[questioncontansts.PAX]["number_of_children"] &&
        props.type === "number_of_infants"
      )
        setCounter(props.newAnswers[questioncontansts.PAX]["number_of_adults"]);
      if (
        props.newAnswers[questioncontansts.PAX]["number_of_infants"] &&
        props.type === "number_of_infants"
      )
        setCounter(props.newAnswers[questioncontansts.PAX]["number_of_adults"]);
    }
  }, [props.questionIndex]);

  const _increaseCounter = () => {
    setCounter(counter + 1);
    let UPDATED_NEW_ANSWERS = { ...props.newAnswers } || {};
    let test = {};
    test[props.type] = counter + 1;
    UPDATED_NEW_ANSWERS[questioncontansts.PAX] = {
      ...UPDATED_NEW_ANSWERS[questioncontansts.PAX],
      ...test,
    };
    props.setNewAnswers(UPDATED_NEW_ANSWERS);
  };

  const _decreaseCounter = () => {
    if (counter) {
      let UPDATED_NEW_ANSWERS = { ...props.newAnswers } || {};
      let test = {};
      test[props.type] = counter - 1;
      UPDATED_NEW_ANSWERS[questioncontansts.PAX] = {
        ...UPDATED_NEW_ANSWERS[questioncontansts.PAX],
        ...test,
      };
      props.setNewAnswers(UPDATED_NEW_ANSWERS);

      setCounter(counter - 1);
    }
  };

  return (
    <Container>
      <ImageLoader
        width="5rem"
        widthmobile="15vw"
        dimensions={{ width: 400, height: 400 }}
        dimensionsMobile={{ width: 400, height: 400 }}
        url={props.img}
      ></ImageLoader>
      <p style={{ margin: "0rem 0" }} className="font-lexend">
        {props.heading}
      </p>
      <Age className="font-lexend">
        <em>{props.age}</em>
      </Age>
      <GridContainer>
        <Icon
          className="center-div"
          style={{ fontSize: "1.5rem", fontWeight: "600" }}
          onClick={_decreaseCounter}
        >
          -
        </Icon>
        <CounContainer className="center-div">
          <p style={{ margin: "0rem 0" }}>{counter}</p>
        </CounContainer>
        <Icon
          className="center-div"
          style={{ fontSize: "1.5rem", fontWeight: "600" }}
          onClick={_increaseCounter}
        >
          +
        </Icon>
      </GridContainer>
    </Container>
  );
};

export default Counter;
