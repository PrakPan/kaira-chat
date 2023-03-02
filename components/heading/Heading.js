import React from 'react';
import styled from 'styled-components';
import media from '../media';

const Container = styled.div`
margin: ${(props) => props.margin? props.margin: '0'},

@media screen and (min-width: 768px){
    max-width: 100%;
}
`;
const Heading = styled.div`
    text-align: center;
    font-weight: ${(props) => props.bold ? '700' : props.thincaps ? '100' : '400'};
    border-style: ${(props) => props.bold || props.thincaps ? props.noline ? 'none' : 'none none solid none' : 'none'};
    font-size: ${(props) => props.thincaps ? '1.5rem'  : props.bold ? '2rem' : '2rem'};
    margin: ${(props) => props.noline ? '0' : '0 auto 0.5rem auto'  };
    padding: ${(props) => props.padding ? props.padding : '5px'};
    color: ${(props) => props.color ? props.color : "black"}
    width: ${(props => props.noline ? '100%' : 'max-content')};
    letter-spacing: ${(props) => props.thincaps ? '3px' : '1'};
    max-width: ${(props) => props.noline ? '100%' : '85%'}
    @media screen and (min-width: 768px){
        max-width: 100%;
        width: max-content;
        border-width: 2px;
        border-color: #F7e700;
        font-size: ${(props) => props.bold ? props.noline ? '2.5rem'   : '3rem' : '3rem'};
        margin: ${(props) => props.aligndesktop  === "center" && props.margin ? props.margin+" auto" : props.margin}

    }
`;
const HHeading = (props) => {
    let isPageWide = media('(min-width: 768px)')
    
            return(
                <Container
                props={props}
                >
                    <Heading
                    props={props}
                    className={props.blur ? 'blurry-text font-opensans': 'font-opensans'}
                     >{props.children}</Heading>

                    {/* {props.noline || isPageWide ? null : <div style={{width: '30%', margin: 'auto', borderStyle: 'none none solid none', borderWidth: '3px', borderColor: "#F7e700"}}></div>} */}
                    {/* { props.noline || window.innerWidth < 768 ? null : <div style={{width: '30%', borderStyle: 'none none solid none', borderWidth: '3px', borderColor: "#F7e700"}}></div>} */}
                </Container>
            );
       
}

export default (HHeading); 