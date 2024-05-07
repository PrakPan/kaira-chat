import React from "react";
import styled from "styled-components";
import Counter from "./counter";

const Container = styled.div`
  width: 100%;
  margin: 1rem auto;
  @media screen and (min-width: 768px) {
    padding-bottom: 0;
    margin: auto;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
  width: 100%;
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const Pax = (props) => {
  let defaultcounters = [2, 0, 0];

  return (
    <Container>
      <GridContainer>
        <Counter
          numberOfAdults={props.numberOfAdults}
          setNumberOfAdults={props.setNumberOfAdults}
          type="number_of_adults"
          img="media/icons/Questionnaire/Group size/pax/Adults.png"
          heading="Adults"
          age="12+ years"
          defaultcounter={defaultcounters[0]}
          setAnswers={props.setAnswers}
          answers={props.answers}
          questionIndex={props.questionIndex}
          answerIndex={6}
        />
        <Counter
          numberOfChildren={props.numberOfChildren}
          setNumberOfChildren={props.setNumberOfChildren}
          type="number_of_children"
          img="media/icons/Questionnaire/Group size/pax/children.png"
          heading="Children"
          age="2 - 12 years"
          defaultcounter={defaultcounters[1]}
          setAnswers={props.setAnswers}
          answers={props.answers}
          questionIndex={props.questionIndex}
          answerIndex={7}
        />
        <Counter
          numberOfInfants={props.numberOfInfants}
          setNumberOfInfants={props.setNumberOfInfants}
          type="number_of_infants"
          img="media/icons/Questionnaire/Group size/pax/infants.png"
          heading="Infants"
          age="< 2 years"
          defaultcounter={defaultcounters[2]}
          setAnswers={props.setAnswers}
          answers={props.answers}
          questionIndex={props.questionIndex}
          answerIndex={8}
        />
      </GridContainer>
    </Container>
  );
};

export default Pax;
