import React, { useState }  from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faPlus} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Container = styled.div`
    padding: 0.5rem;
    &:hover{
        cursor: pointer;
    }
    max-width: 100%;
    border-radius: 5px;
    margin: 0;
    display: grid;
    grid-template-columns: auto max-content;
    grid-gap: 0.5rem
    
`;
const Name = styled.p`
    font-weight: 600;
    margin: 0;
    padding: 0;
    font-size: 0.75rem;
`;
const Parent = styled.p`
    font-weight: 300;
    margin: 0;
    padding: 0;
    font-size: 0.75rem;

`;
const StyledFontAwesome = styled(FontAwesomeIcon)`
    display: inline;
    @media screen and (min-width: 768px){
        margin: 0 1rem 0 4rem;

    }
`;
const SearchResult = (props) => {

     return(
        <Container className="border-thin" onClick={() => props._addCityHandler(props.city_id, {"name": props.location, "parent": props.parent, "city_id": props.city_id, "type": props.type})}>
            <div  >
            <Name className="font-opensans">{props.location}</Name>
            <Parent>{!props.newcity ? props.parent : 'Add new city' }</Parent>
            </div>
            <div className="center-div">
            <StyledFontAwesome icon={faPlus}></StyledFontAwesome>
            </div>
        </Container>
    );
   
}

export default (SearchResult);