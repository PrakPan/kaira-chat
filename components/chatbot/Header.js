import React from 'react';
import styled from 'styled-components'
import logo from '../../public/assets/logoblack.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
    background-color: #F7e700;
    padding: 0.5rem 0.5rem;
    display: grid;
    grid-template-columns: 1fr 10fr 1fr;

`;

const Logo = styled.img`
    width: 3rem;
    height: 3rem;

`;
const ContentContainer = styled.div`
    margin-left: 0.5rem;
`;
const P = styled.p`
    font-weight: 600;
    margin-bottom: 0.25rem;
`;
const P2 = styled.p`
    font-weight: 300;
    font-size: 0.75rem;
    margin-bottom: 0;
`;
const Header = (props) =>{
   

    return(
        <Container >
            <div style={{display: 'flex', alignItems: 'center'}}><FontAwesomeIcon style={{fontSize: '1.5rem', margin: '0 0.5rem'}} icon={faTimes} onClick={props.onhide}/></div>
                <ContentContainer className="center-div">
                    <P className="font-lexend">Travel Support</P>
                    {/* <P2 className="font-nunito">Chatting with Shikhar...</P2> */}
                </ContentContainer>
            <Logo src={logo} onClick={props.onhide} style={{float: 'right'}}></Logo>
        </Container>
    );
}

export default Header;