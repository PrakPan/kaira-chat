import React from 'react';
import styled from 'styled-components';
import Icon from './Food';
import Button from '../../../ui/button/Index';
import urls from '../../../../services/urls';

const Inlcusions = (props) => {
    
    const Container = styled.div`
    max-width: 100%;
    display: grid;
    padding: 0;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 1rem;
    @media screen and (min-width: 768px){
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: auto;

    }
    @media (min-width: 768px) and (max-width: 1024px) {
        grid-template-columns: 33% 33% 33%;
    }
    `;
    

    let icons=[];
    props.foods.map((icon,index) => {
              icons.push(<Icon key={index} icon={icon}></Icon>)
    });
    return(
    <div>
        <Container>
         {icons}
        </Container>
        {props.pois ? <Button boxShadow link={urls.ERROR404} margin="1rem auto" borderRadius="2rem" borderWidth="1px" padding="2px 1.25rem">View All</Button> : null}
    </div>
  ); 
}

export default Inlcusions;
{/* <Button boxShadow link={"/404"} margin="1rem auto" borderRadius="2rem" borderWidth="1px" padding="2px 1.25rem">View All</Button> */}