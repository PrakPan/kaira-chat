import * as React from 'react';
import styled from 'styled-components';
import DatePicker from './Datepicker';
import media from '../../../components/media';
import DatePickerSingle from './Datepickersingle';
const Container = styled.div`
@media screen and (min-width: 768px){

  padding-bottom: 20vh;
}
`;
const ResponsiveDatePickers = (props) => {
  let isPageWide = media('(min-width: 768px)');
  if (isPageWide)
  return (
    <Container className="center-div">
        <DatePicker startDate={props.startDate}  endDate={props.endDate}  questionIndex={props.questionIndex} _setDatesHandler={props._setDatesHandler}></DatePicker>
    </Container>
  );
  else  return (
    <Container className="center-div">
        <DatePickerSingle startDate={props.endDate} endDate={props.endDate}   questionIndex={props.questionIndex} _setDatesHandler={props._setDatesHandler}></DatePickerSingle>
    </Container>
  );
}

export default ResponsiveDatePickers;