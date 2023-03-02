import React , {useState} from 'react';
import styled from 'styled-components';
import media from '../../../../../media';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch} from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
padding: 1rem;
text-align: left;
display: flex;
justify-content: space-between;
border: solid 1px #E4e4e4;
border-radius: 5px;
&:hover{
    cursor: pointer;
}
`;
const ResultTitle = styled.p`
margin: 0;
&:hover{
    font-weight: 800;
}
`;
const CTA = styled.p`
border-style: solid;
border-width: 1px;
border-radius: 2rem;
color: black; 
padding: 0.5rem 2rem;
fontSize: 1rem; 
margin: 0;
&:hover{
    background-color: black;
    color: white;
    cursor: pointer;
}
`;

const Result= (props) => {
  let isPageWide = media('(min-width: 768px)')
  let [hover, setHover] = useState(false);
  const _handleMouseEnter = () => {
      setHover(true);
  }
  const _handleMouseLeave = () => {
      setHover(false);
  }
    return(
        <Container onMouseLeave={_handleMouseLeave} onMouseEnter={_handleMouseEnter}>
        <div>
            <ResultTitle className="font-nunito" style={{fontWeight: hover ? '800' : '600'}}>{props.title}</ResultTitle>
            <p style={{opacity : "0.5", fontSize: "0.75rem", margin: "0"}} className="font-nuniti">{props.type.toUpperCase()}</p>
        </div>
        <div className="center-div">
            <CTA  className="font-nunito">Check Out</CTA>
        </div>
        </Container> 
    );
}

export default Result;
