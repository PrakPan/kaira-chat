import React from 'react';
import styled from 'styled-components';
import Icon from './Icon';

const Container = styled.div`
    max-width: 100%;
    display: grid;
    padding: 0;
    grid-template-columns: repeat(2,1fr);
    grid-template-rows: auto;
    grid-gap: 1rem;
    @media screen and (min-width: 768px){
        grid-template-columns: repeat(5,20%);
        grid-template-rows: auto;
        grid-gap: 0;

    }
    `;
    
const Inlcusions = (props) => {


    let icons=[];
    props.icons.map((icon,i) => {
        icons.push(<Icon text={icon} key={i} type="line"></Icon>)
    });
    return(
        <Container>
         {icons}
        </Container>
  );
}

export default React.memo(Inlcusions);
