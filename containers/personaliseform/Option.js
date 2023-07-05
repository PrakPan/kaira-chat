import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import media from '../../components/media';

const imgUrlEndPoint = 'https://d31aoa0ehgvjdi.cloudfront.net/';
import ImageLoader from '../../components/ImageLoader';
import * as ga from '../../services/ga/Index';
import questions from './questions';
import questioncontansts from './questioncontansts';
const OptionContainer = styled.button`
    background-color: white;
    padding: 1rem;
    border-radius: 5px;
    }
    @media screen and (min-width: 768px){
        min-height: 12.5vw;
        &:hover{
            cursor: pointer;
        }
        display: inline-flex !important;
        margin-right: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        width: 100%;
    }
    @media screen and (min-width: 768px) and (min-height: 1024px) {
    
    }
    &:focus{
        outline:0;
    }
    `;

const Option = (props) => {
  const btoa = function (str) {
    return Buffer.from(str).toString('base64');
  };

  let isPageWide = media('(min-width: 768px)');

  const [selectedState, setSelectedState] = useState(false);
  useEffect(() => {
    //Set background color if previously selected
    if (questions.questions[props.questionIndex] === questioncontansts.PAX) {
      if (props.newAnswers[questioncontansts.PAX]) {
        if (props.newAnswers[questioncontansts.PAX]['index'] === props.index)
          setSelectedState(true);
        else setSelectedState(false);
      } else setSelectedState(false);
    } else {
      if (props.newAnswers) {
        if (props.newAnswers[questions.questions[props.questionIndex]]) {
          if (
            props.newAnswers[questions.questions[props.questionIndex]].indexOf(
              props.index
            ) !== -1
          ) {
            setSelectedState(true);
          } else setSelectedState(false);
        } else setSelectedState(false);
      } else setSelectedState(false);
    }
  });

  const _selectOptionHandler = () => {
    //Option is unselected
    if (selectedState) {
      //Can't leave pax and budget empty
      if (
        questions.questions[props.questionIndex] !== questioncontansts.BUDGET ||
        questions.questions[props.questionIndex] !== questioncontansts.PAX
      ) {
        setSelectedState(false);
        //Create new answers state array
        let UPDATED_NEW_ANSWERS = { ...props.newAnswers } || {};
        //Filter out unselected option
        if (props.newAnswers[questions.questions[props.questionIndex]].length) {
          let UPDATED_FILTERED = [
            ...props.newAnswers[
              questions.questions[props.questionIndex]
            ].filter(function (value, index, arr) {
              return value != props.index;
            }),
          ];
          //Set new answers after filtering out unselected option
          UPDATED_NEW_ANSWERS[questions.questions[props.questionIndex]] =
            UPDATED_FILTERED;
        }
        props.setNewAnswers(UPDATED_NEW_ANSWERS);
      }
    }
    //Option is selected
    else {
      {
        process.env.NODE_ENV === 'production' &&
          ga.event({
            action:
              'TTForm-' + props.questionIndex + '-' + props.heading
                ? props.heading
                : props.text,
            params: {
              options_selected: props.heading ? props.heading : props.text,
            },
          });
      }

      let UPDATED_NEW_ANSWERS = { ...props.newAnswers } || {};

      //Add selected index to answers

      //PAX question
      if (questions.questions[props.questionIndex] === questioncontansts.PAX) {
        UPDATED_NEW_ANSWERS[questioncontansts.PAX] = { index: props.index };
        props.setNewAnswers(UPDATED_NEW_ANSWERS);

        // newanswers[props.questionIndex].push(props.index);
        props.setToggle(!props.toggle);
        // props.nextQuestionHandler();
        props.showPax();
        if (props.index === 0 || props.index === 1) props.nextQuestionHandler();
      } else if (
        questions.questions[props.questionIndex] === questioncontansts.BUDGET ||
        questions.questions[props.questionIndex] === questioncontansts.DURATION
      ) {
        UPDATED_NEW_ANSWERS[questions.questions[props.questionIndex]] = [];
        UPDATED_NEW_ANSWERS[questions.questions[props.questionIndex]].push(
          props.index
        );
        props.setNewAnswers(UPDATED_NEW_ANSWERS);

        props.nextQuestionHandler();
      } else if (
        questions.questions[props.questionIndex] ===
        questioncontansts.WORKCATION
      ) {
        UPDATED_NEW_ANSWERS[questioncontansts.WORKCATION] = [props.index];
        props.setNewAnswers(UPDATED_NEW_ANSWERS);
        props.nextQuestionHandler();
      } else {
        if (props.newAnswers) {
          let newarr = [];
          if (props.newAnswers[questions.questions[props.questionIndex]]) {
            for (
              var i = 0;
              i <
              props.newAnswers[questions.questions[props.questionIndex]].length;
              i++
            ) {
              newarr.push(
                props.newAnswers[questions.questions[props.questionIndex]][i]
              );
            }
            UPDATED_NEW_ANSWERS[questions.questions[props.questionIndex]] =
              newarr;
          }
        } else
          UPDATED_NEW_ANSWERS[questions.questions[props.questionIndex]] = [];

        UPDATED_NEW_ANSWERS[questions.questions[props.questionIndex]].push(
          props.index
        );
        props.setNewAnswers(UPDATED_NEW_ANSWERS);
      }
      setSelectedState(true);
    }
  };
  let imageRequest = JSON.stringify({
    bucket: 'thetarzanway-web',
    key: props.img,
    edits: {
      resize: {
        width: 400,
        height: 400,
        fit: 'cover',
      },
    },
  });
  if (questions.questions[props.questionIndex] !== questioncontansts.LOCATIONS)
    return (
      <OptionContainer
        className="center-div border-thin"
        key={props.index}
        onClick={() => _selectOptionHandler()}
        style={{
          backgroundColor: !selectedState ? 'white' : 'rgba(247, 231, 0, 0.3)',
        }}
      >
        <ImageLoader
          url={props.img}
          dimensions={{ width: 400, height: 400 }}
          src={`${imgUrlEndPoint}/${btoa(imageRequest)}`}
          width="40%"
          widthmobile="40%"
        ></ImageLoader>
        {props.heading && props.text ? (
          <p
            style={{
              textAlign: 'center',
              margin: '0.5rem 0 0 0',
              fontSize: '0.85rem',
            }}
            className="font-lexend"
          >
            <b>{props.heading}</b>
          </p>
        ) : null}
        {props.heading && !props.text ? (
          <p
            style={{
              textAlign: 'center',
              margin: '0.5rem 0 0 0',
              fontSize: '0.85rem',
              fontWeight: '500',
            }}
            className="font-lexend"
          >
            {props.heading}
          </p>
        ) : null}
        <p
          style={{
            textAlign: 'center',
            margin: '0.75rem 0 0 0',
            fontWeight: '300',
            letterSpacing: '1px',
            fontSize: '0.75rem',
          }}
          className="font-lexend"
        >
          {props.text}
        </p>
      </OptionContainer>
    );
  else return null;
};

export default Option;
