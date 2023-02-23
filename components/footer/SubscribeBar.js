import React, {useState} from 'react';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {checkEmail} from '../../services/validations';
import axios from 'axios';
import media from '../media';
import Spinner from '../Spinner';


   
const EmailField = styled.input`
        color: black;
        border: none;
        width: 100%;
        border-radius: 5px !important;
        height: 3rem;
        padding-left: 1rem;
        box-sizing: border-box;
        &:focus{
            outline: none;
        }
    `;
const EmailFieldContainer = styled.div`
    background-color: transparent;
    width: 90%;
    display: grid;
    grid-template-columns: 70% 30%;
    @media screen and (min-width: 768px){
        width: 40%;
        grid-template-columns: auto max-content;
    }
    `;
    const Button = styled.div`
    width: 100%;
    margin-left: 0.5rem;
    height: 3rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    &:hover{
        cursor: pointer;

    }
`;
const Subscribe = (props) => {
    let isPageWide = media('(min-width: 768px)')

  
   
   const [email, setEmail] = useState();
    const [loading, setLoading] = useState(false)
    const [subscribe, setSubscribe] = useState(false);

     const _handleChange = (event, target) => {
        setEmail(event.target.value)
    }
    const _submitHandler = () => {
        if(checkEmail(email)){
        setLoading(true);
        axios.post("https://dev.apis.tarzanway.com/mail/subscribe/", {
            "email": email,
        })
          .then(res => {
            setSubscribe(true);
            setLoading(false);

          }).catch(error => {
            alert("There was a problem, please refresh and try again.")
            setLoading(false);
          });
        }
        else {
        }
    }
    return(
      <EmailFieldContainer style={{margin: props.margin ? props.margin : 'auto'}}>
            <EmailField  key="email" type="text"  id="email" name="email" placeholder="jonsnow@website.com" value={email} onChange={_handleChange}></EmailField>
            <Button
                style={{backgroundColor: props.buttonColor ? props.buttonColor : 'black',
                color: props.buttonTextColor ? props.buttonTextColor : 'black'
            }}
                onClick={_submitHandler}
                >Subscribe
                {loading ? <Spinner display="inline" size={16} margin="0 0 0 0.5rem"></Spinner>: null}
                {subscribe ? <FontAwesomeIcon style={{marginLeft: "0.5rem"}} icon={faCheck}/> : null}
            </Button>
        </EmailFieldContainer>
    );
}

export default Subscribe;
