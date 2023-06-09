import React from 'react';
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLocationArrow , faClock} from '@fortawesome/free-solid-svg-icons';

const CityConnection = (props) =>{
    const Container = styled.div`
        width: 100%;
    `;

    return (
      <Container>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            height: "10vh",
          }}
        >
          <div></div>
          <div
            style={{
              borderStyle: "none none none solid",
              borderColor: "black",
              borderWidth: "1px",
            }}
          ></div>
        </div>
        {props.distance ? (
          <div style={{ textAlign: "center", padding: "0.5rem" }}>
            <FontAwesomeIcon
              style={{ color: "black !important" }}
              icon={faLocationArrow}
            ></FontAwesomeIcon>
            {" " + props.distance}
          </div>
        ) : null}

        {props.time ? (
          <div style={{ textAlign: "center", padding: "0.5rem" }}>
            <FontAwesomeIcon
              style={{ color: "black !important" }}
              icon={faClock}
            ></FontAwesomeIcon>
            {" " + props.time}
          </div>
        ) : null}

        <div></div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            height: "10vh",
          }}
        >
          <div></div>
          <div
            style={{
              borderStyle: "none none none solid",
              borderColor: "black",
              borderWidth: "1px",
            }}
          ></div>
        </div>
      </Container>
    );
}

export default CityConnection;