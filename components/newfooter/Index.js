import styled from 'styled-components';
import { useState, useEffect } from 'react';
// import Pin from './Pin';
import ImageLoader from '../ImageLoader';
import  Socials from './Socials';
import {FiPhoneCall} from 'react-icons/fi';
import {HiOutlineMail} from 'react-icons/hi';
 const  Container = styled.div`
 
min-height: 10vw;
background-color: rgb(35, 35, 35);
padding: 1.5rem 1rem;
color: white;

`;
 const LogoContainer=styled.div`
    display: flex;
 `;
 const CompanyName = styled.div`
    display: flex;
    align-items: flex-end;
    font-size: 14px;
    font-weight: 700;
 `;
 const CompanyText= styled.div`
 font-size: 14px;
 margin: 1.5rem 0;
 `;

 const LinksContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 1.5rem 0 0 0;

 `;

 const CopyWrite = styled.div`
    font-size: 10px;
    margin: 1.5rem 0 0 0;
 `;

const NewFooter = (props) => {
   
    useEffect(() => {
      
    },[]);

    return(
        <Container className='font-opensans'>
            <LogoContainer>
                <ImageLoader
                dimensions={{width: 100, height: 100}}
                dimensionsMobile={{width: 120, height: 100}}
                url="media/website/logowhite.svg"
                width="2rem"
                widthmobile="60px"
                leftalign
                height="50px"
                >
                  
                </ImageLoader>
                <CompanyName>thetarzanway</CompanyName>
            </LogoContainer>
            <CompanyText>
            The Tarzan Way is a travel based startup with the vision to simplify travel and build immersive travel programs across India.
            </CompanyText>
            <Socials></Socials>
            
            <CompanyName style={{margin: '1rem 0'}}>Contact</CompanyName>
            <CompanyText style={{display: 'flex', margin: '0'}}>
                <div style={{display: 'flex'}}>
                    <FiPhoneCall style={{fontSize: '1.15rem', marginRight: '0.5rem'}}></FiPhoneCall>
                    +91 99999 99999, +91 99999 99999
                </div>
            </CompanyText>
            <CompanyText style={{display: 'flex', margin: '0.25rem 0 0 0'}}>
                <div style={{display: 'flex'}}>
                    <HiOutlineMail style={{fontSize: '1.15rem', marginRight: '0.5rem'}}></HiOutlineMail>
                   info@thetarzanway.com
                </div>
            </CompanyText>
            
        <LinksContainer>
            <div>
                <CompanyName style={{margin: '0 0 1rem 0'}}>
                    Heading
                </CompanyName>
                <div>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 2rem 0'}}>Lorem Impsum</CompanyText>

                </div>
            </div>
            <div>
            <CompanyName style={{margin: '0 0 1rem 0'}}>
                    Heading
                </CompanyName>
                <div>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 2rem 0'}}>Lorem Impsum</CompanyText>

                </div>
            </div>
            <div>
            <CompanyName style={{margin: '0 0 1rem 0'}}>
                    Heading
                </CompanyName>
                <div>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>

                </div>
            </div>
            <div>
            <CompanyName style={{margin: '0 0 1rem 0'}}>
                    Heading
                </CompanyName>
                <div>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>
                    <CompanyText style={{margin: '0 0 1rem 0'}}>Lorem Impsum</CompanyText>

                </div>
            </div>
        </LinksContainer>
        <div style={{border: '0.5px solid rgba(255, 255, 255, 0.5'}}>

        </div>
        <CopyWrite className='text-center' >© Copyright 2022, All Rights Reserved by thetarzanway</CopyWrite>
        </Container>
        
    );
 }

export default NewFooter;