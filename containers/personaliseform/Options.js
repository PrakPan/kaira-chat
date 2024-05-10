import styled from "styled-components";
import questions from "./questions";
import Option from "./Option";
import media from "../../components/media";
import Pax from "./grouptype/Index";
import questioncontansts from "./questioncontansts";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 1.5rem;
  grid-column-gap: 1.5rem;
  width: 90%;
  margin: auto;
  padding-bottom: 0vh;
  @media screen and (min-width: 768px) {
    width: max-content;
    grid-gap: 1rem;
    padding-bottom: 0;
  }
`;

const ContainerTwo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  width: 90%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: max-content;
    grid-template-columns: 12.5vw 12.5vw 12.5vw 12.5vw;
  }
`;

const Options = (props) => {
  let isPageWide = media("(min-width: 768px)");
  let optionslist = [];
  let optionslist2 = [];

  if (props.questionIndex !== 6) {
    if (
      questions.questions[props.questionIndex] === questioncontansts.FILTERS
    ) {
      for (var i = 0; i < 10; i++) {
        optionslist.push(
          <Option
            setNewAnswers={props.setNewAnswers}
            newAnswers={props.newAnswers}
            index={i}
            key={i}
            heading={questions.options[1][i].heading}
            text={questions.options[1][i].text}
            img={questions.options[1][i].image}
            questionIndex={props.questionIndex}
            nextQuestionHandler={props.nextQuestionHandler}
          ></Option>
        );
      }
    } else if (
      questions.questions[props.questionIndex] === questioncontansts.PAX
    ) {
      for (var i = 0; i < 5; i++) {
        optionslist.push(
          <Option
            setNewAnswers={props.setNewAnswers}
            newAnswers={props.newAnswers}
            toggle={props.toggle}
            setToggle={props.setToggle}
            showPax={() => props.setShowPax(true)}
            index={i}
            key={i}
            heading={questions.options[2][i].heading}
            text={questions.options[2][i].text}
            img={questions.options[2][i].image}
            questionIndex={props.questionIndex}
            nextQuestionHandler={props.nextQuestionHandler}
          ></Option>
        );
      }
    } else
      questions.options[props.questionIndex].map((item, index) => {
        //handle corner case
        if (item != null) {
          optionslist.push(
            <Option
              setNewAnswers={props.setNewAnswers}
              newAnswers={props.newAnswers}
              image={item.image}
              index={index}
              key={index}
              heading={item.heading}
              text={item.text}
              img={item.image}
              questionIndex={props.questionIndex}
              nextQuestionHandler={props.nextQuestionHandler}
            ></Option>
          );
        }
      });
  }

  const _changePaxHandler = () => {
    let UPDATED_NEW_ANSWERS = { ...props.newAnswers } || {};
    UPDATED_NEW_ANSWERS[questioncontansts.PAX] = null;
    props.setNewAnswers(UPDATED_NEW_ANSWERS);

    props.setShowPax(false);
  };

  if (questions.questions[props.questionIndex] === questioncontansts.FILTERS)
    return (
      <div style={{ textAlign: "center" }}>
        <Container
          style={{
            gridTemplateColumns: isPageWide
              ? "12.5vw 12.5vw 12.5vw 12.5vw 12.5vw"
              : "1fr 1fr",
            width: isPageWide ? "max-content" : "80%",
            margin: "auto",
            paddingBottom: isPageWide ? "0vh" : "10vh",
          }}
        >
          {optionslist}
        </Container>
      </div>
    );
  else if (questions.questions[props.questionIndex] === questioncontansts.PAX) {
    return (
      <div
        style={{
          textAlign: "center",
          paddingBottom: isPageWide ? "0vh" : "10vh",
        }}
      >
        {props.showPax && props.newAnswers[questioncontansts.PAX] ? (
          props.newAnswers[questioncontansts.PAX]["index"] !== 0 &&
          props.newAnswers[questioncontansts.PAX]["index"] !== 1 ? (
            <Pax
              newAnswers={props.newAnswers}
              setNewAnswers={props.setNewAnswers}
              hidePax={_changePaxHandler}
              setAnswers={props.setAnswers}
              questionIndex={props.questionIndex}
            ></Pax>
          ) : (
            <Container
              style={{
                paddingBottom: "0vh",
                gridTemplateColumns: isPageWide
                  ? "12.5vw 12.5vw 12.5vw 12.5vw 12.5vw"
                  : "1fr 1fr",
                width: isPageWide ? "max-content" : "80%",
                margin: "auto",
              }}
            >
              {optionslist}
              {!isPageWide ? optionslist2 : null}
            </Container>
          )
        ) : (
          <Container
            style={{
              paddingBottom: "0vh",
              gridTemplateColumns: isPageWide
                ? "12.5vw 12.5vw 12.5vw 12.5vw 12.5vw"
                : "1fr 1fr",
              width: isPageWide ? "max-content" : "80%",
              margin: "auto",
            }}
          >
            {optionslist}
            {!isPageWide ? optionslist2 : null}
          </Container>
        )}
      </div>
    );
  } else if (
    questions.questions[props.questionIndex] === questioncontansts.BUDGET
  ) {
    return (
      <div style={{ textAlign: "center" }}>
        <Container
          style={{
            gridTemplateColumns: isPageWide
              ? "12.5vw 12.5vw 12.5vw 12.5vw"
              : "1fr 1fr",
            width: isPageWide ? "max-content" : "80%",
            margin: "auto",
          }}
        >
          {optionslist}
          {!isPageWide ? optionslist2 : null}
        </Container>
      </div>
    );
  } else if (
    questions.questions[props.questionIndex] === questioncontansts.WORKCATION
  ) {
    return (
      <div style={{ textAlign: "center" }}>
        <Container
          style={{
            gridTemplateColumns: isPageWide ? "12.5vw 12.5vw" : "1fr 1fr",
            width: isPageWide ? "max-content" : "80%",
            margin: "auto",
          }}
        >
          {optionslist}
          {!isPageWide ? optionslist2 : null}
        </Container>
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: "center" }}>
        <Container
          style={{
            gridTemplateColumns: isPageWide
              ? "12.5vw 12.5vw 12.5vw"
              : "1fr 1fr",
            width: isPageWide ? "max-content" : "80%",
            margin: "auto",
          }}
        >
          {optionslist}
          {!isPageWide ? optionslist2 : null}
        </Container>
        {questions.questions[props.questionIndex] ===
          questioncontansts.FILTERS && isPageWide ? (
          <ContainerTwo>{optionslist2}</ContainerTwo>
        ) : null}
      </div>
    );
  }
};

export default Options;
