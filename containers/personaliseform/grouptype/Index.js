import React from "react";
import styled from "styled-components";
import Counter from "./counter";
import questions from "../questions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import questioncontansts from "../questioncontansts";

const Container = styled.div`
  width: max-content;
  margin: 1rem auto;
  padding-bottom: 15vh;
  @media screen and (min-width: 768px) {
    padding-bottom: 0;
    margin: auto;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1.5rem;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 5rem;
  }
`;

const GroupTypeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: hsl(0, 0%, 98%);
  padding: 0.5rem;
  border-radius: 5px;
  text-align: left;
  margin-bottom: 1rem;
  &:hover {
    cursor: pointer;
  }
`;

const StyledFontAwesome = styled(FontAwesomeIcon)`
  margin: 0;
  font-size: 1.25rem;
  &:hover {
    cursor: pointer;
  }
`;

const Pax = (props) => {
    let defaultcounters;

  if (props.newAnswers[questioncontansts.PAX]["index"] === 2) {
    defaultcounters = [2, 0, 0];
  } else if (props.newAnswers[questioncontansts.PAX]["index"] === 3) {
    defaultcounters = [2, 0, 0];
  } else if (props.newAnswers[questioncontansts.PAX]["index"] === 4) {
    defaultcounters = [15, 0, 0];
  }
    
  return (
    <Container>
      <GroupTypeContainer
        className="font-lexend border-thin"
        onClick={props.hidePax}
      >
        <div>
          <div style={{ fontWeight: "600", letterSpacing: "1px" }}>
            GROUP TYPE
          </div>
          <div style={{ fontWeight: "300" }}>
            {
              questions.options[2][
                props.newAnswers[questioncontansts.PAX]["index"]
              ].heading
            }{" "}
          </div>
        </div>
        <div className="font-lexend center-div">
          <StyledFontAwesome icon={faEdit}></StyledFontAwesome>
        </div>
      </GroupTypeContainer>
      <GridContainer>
        <Counter
          type="number_of_adults"
          newAnswers={props.newAnswers}
          setNewAnswers={props.setNewAnswers}
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
          type="number_of_children"
          newAnswers={props.newAnswers}
          setNewAnswers={props.setNewAnswers}
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
          type="number_of_infants"
          newAnswers={props.newAnswers}
          setNewAnswers={props.setNewAnswers}
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
