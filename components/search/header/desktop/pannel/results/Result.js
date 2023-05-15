import React, {useState} from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons';

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
    font-weight: 600;
}
`;

const Result= (props) => {
  let router = useRouter();
    let [hover, setHover] = useState(false);
    const _handleMouseEnter = () => {
        setHover(true);
    }
    const _handleMouseLeave = () => {
        setHover(false);
    }
    const _handleCTA = () => {
        if(props.type === 'Blog') window.location.href=props.cta;
        else router.push('/travel-experiences/'+props.cta)
    }
    return(
        <Container onMouseEnter={_handleMouseEnter} onMouseLeave={_handleMouseLeave}>
        <div>
            <ResultTitle className="font-nunito" style={{fontWeight: hover ? '800' : '600'}}>{props.title}</ResultTitle>
        </div>
        <div className="center-div" style={{display: 'grid', gridTemplateColumns: 'auto auto', marginLeft: '0.25rem'}} onClick={_handleCTA}>
            <p style={{opacity : "0.5", fontSize: "0.75rem", margin: "0", display: 'inline'}} className="font-nuniti">{props.type.toUpperCase()}</p>
            <FontAwesomeIcon style={{opacity: '0.5', display: 'inline', marginLeft: '0.5rem'}} icon={faExternalLinkAlt}></FontAwesomeIcon>
        </div>
        </Container> 
    );
}

export default Result;
