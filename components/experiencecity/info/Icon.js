import React from 'react';
import styled from 'styled-components';
import S3Icon from './S3Icon'
const Container = styled.div`
width: 100%;
padding: 1rem;
border-radius: 10px;
`;
const IconLine = styled.div`
display: flex;
flex-direction: column;
text-align: center;
`;
const IconImgLine = styled.img`
display: block;
height: 4rem;
width: 4rem;
margin: auto;
background-color: #F7e700;
padding: 1rem;
border-radius: 50%;
`;
const IconTagLine = styled.p`
    font-weight: 600;
   margin: 1rem auto 0.5rem auto;
    font-size: 0.75rem;
`;
const IconDayWiseContainer = styled.div`
    display: flex;
    flex-direction: row;
`;
const IconDaywiseInclusion= styled.img`
height: 1.25rem;
`;
const IconDayWiseText = styled.p`
margin-left: 0.25rem;
`;
const  Icon= (props) => {
 
        return( 
            <Container className="border-thin">
                <IconLine >
                    <S3Icon location={props.location} icon={props.icon}></S3Icon>
                    <IconTagLine className="font-lexend">{props.icon.toUpperCase()}</IconTagLine>
                </IconLine>
            </Container>
          );
    }
   

export default  React.memo(Icon);