import React, { useState }  from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Container = styled.div`
    padding: 0.5rem;
    &:hover{
        cursor: pointer;
    }
    border-color: #f7e700;
    border-style: solid;
    border-width: 1px;
    margin:  0;
    width: max-content;
    display: grid;
    grid-template-columns: auto auto;
    background-color: hsl(0,0%,98%);
    @media screen and (min-width: 768px){
        margin: 0;
    }

`;
const Name = styled.p`
    font-weight: 600;
    font-size: 0.75rem;
    margin: 0;
    padding: 0;
`;
const Parent = styled.p`
    font-weight: 300;
    margin: 0;
    padding: 0;
    font-size: 0.75rem;

`;
const StyledFontAwesome = styled(FontAwesomeIcon)`
    display: inline;
    margin: 0;
    text-align: right;
    @media screen and (min-width: 768px){
        margin: 0 1rem 0 2rem;

    }
`;
const SelectedCity = (props) => {
     return(
        <Container className={props.city_id ? 'border-thin' : ''} style={{borderRadius: props.city_id ? '5px' : '0', backgroundColor: props.city_id ? 'hsl(0,0%,98%)' : 'transparent', borderColor: props.city_id ? "#e4e4e4" : 'transparent transparent #f7e700 transparent'}}>
            <div style={{display: 'inline'}}>
            <Name style={{visibility : props.city_id ? 'visible' : 'hidden'}} className="font-lexend">{props.name ? props.name : 'L'}</Name>
            {/* <Parent>{props.parent ? props.parent : 'New City'}</Parent> */}
            </div>
            <div className="center-di" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginLeft: '0.5rem'}}>
            <StyledFontAwesome  style={{visibility : props.questionIndex ? 'hidden' :  props.city_id ? 'visible' : 'hidden' }} icon={faTimes}  onClick={() => props._removeCityHandler(props.city_id)}></StyledFontAwesome> 
            </div>
        </Container>
    );
   
}

export default (SelectedCity);