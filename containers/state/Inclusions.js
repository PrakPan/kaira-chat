import React from 'react';
import styled from 'styled-components';
import Icon from '../../components/experiencecity/info/Icon';

const Inlcusions = (props) => {
    
    const Container = styled.div`
    max-width: 100%;
    display: grid;
    padding: 0;
    grid-template-columns: 1fr 1fr;
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
    props.icons.map(icon => {
         icons.push(<Icon icon={icon} location="media/icons/general/" type="line"></Icon>)
    });
    return(
        <Container>
         {icons}
        </Container>
  ); 
}

export default Inlcusions;
