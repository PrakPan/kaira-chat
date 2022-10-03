import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const ImgContainer = styled.div`

    width: 10vw;
    margin: auto;
    height: 10vw;
    border-radius: 50%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    &:hover{
        
        cursor: pointer;
    }
    `;
    const Selected = styled.div`
    width: max-content;
    `;
const Option = (props) => {

  return(
    <div>
        <ImgContainer className="center-div" onClick={() => props. _setSelectedStateHandler(props.index)} style={{backgroundImage : `url(${props.img})`}} onMouseEnter={() => props._setHoverStateHandler(props.index)} onMouseLeave={()=> props._setHoverStateHandler(props.index)}>
        {props.selectedState ? 
        <div style={{backgroundColor: "rgba(247, 231, 0, 0.6)", height: "100%", width: "100%", borderRadius: "50%"}} className="center-div"><Selected><FontAwesomeIcon icon={faCheck} ></FontAwesomeIcon></Selected></div>
        : null}
        {
            props.hoverState && !props.selectedState ? <div style={{backgroundColor: "rgba(0, 0, 0, 0.4)", height: "100%", width: "100%", borderRadius: "50%"}}></div>
            :null
        }
    </ImgContainer>
    <p style={{textAlign: "center", margin: "1rem 1rem 3rem 1rem"}}>{props.text}</p>
    </div>
  );


}

export default React.memo(Option);