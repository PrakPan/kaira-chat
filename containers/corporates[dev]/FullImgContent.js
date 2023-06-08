import React from 'react';
import styled from 'styled-components';
import Button from '../../components/ui/button/Index';
import media from '../../components/media';

const Container = styled.div`
    text-align: center;
 color:white;
@media screen and (min-width: 768px){
    padding: 0 10vh;
    text-align: left;
    display: flex;
    flex-direction: column;   
    justify-content: center;
    }
`;
const Heading = styled.h1`
color: white;

width: 99%;
font-weight: 700;
margin-bottom: 1rem;
font-size: 2rem;
@media screen and (min-width: 768px){
  font-size: 4rem;
  font-weight: 700;

}
`;
const SubText = styled.h3`
color: white;
    font-weight: 100;
    width: 99%;
    font-size: 1.25rem;
     @media screen and (min-width: 768px){
        font-size: 2rem;
     }

`;
const CompanyName= styled.h4`
color: white;
    font-weight: 800;
    width: 99%;
    font-size: 1.5rem;
     @media screen and (min-width: 768px){
        font-size: 1.75rem;
     }
`;
const FullImgContent = (props) => {
    let isPageWide = media('(min-width: 768px)');

    return (

        <Container className='font-lexend'>
            {isPageWide ? <CompanyName className='font-lexend'>TheTarzanWay
            <span style={{fontWeight: '100'}}> For Business</span>
            </CompanyName> : null}
            <Heading>Business Travel made productive</Heading>
            <SubText>Workcations, Retreats, Conferences, Weekend Getaways and more</SubText>
            <Button onclick={props.setEnquiryOpen} onclickparams={null}  fontSizeDesktop="1.25rem" link="/" margin={isPageWide ? "2.5rem 0 0 0": '1.5rem auto'} bgColor="#f7e700" borderRadius="10px"  hoverBgColor="black" hoverColor="white" borderWidth="0px" padding="0.5rem 2rem">Schedule Callback</Button>
        </Container>
    );
}

export default FullImgContent;