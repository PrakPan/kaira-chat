import React from 'react';
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress';



const Container = styled.div`
display: ${props => props.display ? props.display: "block"}
`;

const Spinner = styled(CircularProgress)`
        color: black !important;
        margin: ${props => props.margin ? props.margin : "1rem"};

    `;

const spinner = (props) =>{
   
    
    let size=40;
    if(props.size)  size=props.size;
    return(
        <Container display={props.display}>
            <Spinner margin={props.margin} size={size}></Spinner>
        </Container>
    );
}

export default React.memo(spinner);


/* import React from 'react';
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress';

const Container = styled.div`
display: ${(props)=>props.display ? props.display: "block"}
`;
const Spinner = styled(CircularProgress)`
color: black !important;
margin: ${(props)=>props.margin ? props.margin : "1rem"};

`;


const spinner = (props) =>{
   
    let size=40;
    if(props.size)  size=props.size;
    return(
        <Container>
            <Spinner size={size}></Spinner>
        </Container>
    );
}

export default React.memo(spinner); */