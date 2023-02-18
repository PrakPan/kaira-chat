import React, { useRef } from 'react';
import styled from 'styled-components';
import media from '../../../../../media';
import { useRouter } from 'next/router'

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
font-weight: 800;
font-size: 1.25rem;
&:hover{
}
`;

const CTA = styled.p`
border-style: none;
border-radius: 2rem;
color: black; 
padding: 0.5rem 2rem;
fontSize: 1rem; 
margin: 0;
background-color: #f7e700;
&:hover{
    background-color: black;
    color: white;
    cursor: pointer;
}
`;


const Result= (props) => {
  let isPageWide = media('(min-width: 768px)');
  const router = useRouter();
const _handleCTA = () => {
    // localStorage.setItem('search_city_selected_id', props.id);
    // localStorage.setItem('search_city_selected_name', props.title);
    // localStorage.setItem('search_city_selected_parent', props.parent);
    router.push('/travel-guide/city/'+props.cta)

}
const _handlePlanning = () => {
    // localStorage.setItem('search_city_selected_id', props.id);
    // localStorage.setItem('search_city_selected_name', props.title);
    // localStorage.setItem('search_city_selected_parent', props.parent);
    router.push('/tailored-travel?search_text='+props.title)
}
    return(
        <Container>
        <div >
            <ResultTitle className="font-nunito" onClick={_handleCTA}>{props.title}</ResultTitle>
            <p style={{opacity : "0.5", fontSize: "0.75rem", margin: "0"}} className="font-nuniti" onClick={_handleCTA}>{props.type.toUpperCase()}</p>
        </div>
        <div className="center-div">
            <CTA className="font-nunito" onClick={_handlePlanning}>Start Planning</CTA>
        </div>
        </Container> 
    );
}

export default Result;
