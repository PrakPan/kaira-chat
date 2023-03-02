
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: inline-flex;
    width: max-content;
    font-weight: 700 !important;
`;

const CardTimer = (props) => {

    return (
      < Container className="font-opensans">
        <div>{props.hours+""}</div>
        <div> : </div>
        <div>{props.minutes+""}</div>
        <div> : </div>
        <div>{props.seconds+""}</div>

      </ Container>
    );
  }

export default  CardTimer;