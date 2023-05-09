import React from 'react';
import styled from 'styled-components';
// import { CircularProgress } from '@mui/material';

const Container = styled.div`
  display: ${(props) => (props.display ? props.display : 'block')};
  height: max-content;
`;

// const Spinner = styled(CircularProgress)`
//   color: ${(props) =>
//     props.color ? props.color + ' !important' : 'black !important'};
//   margin: ${(props) => (props.margin ? props.margin : '1rem')};
//   visibility: ${(props) => (props.visibility ? props.visibility : 'visibile')};
// `;

const spinner = (props) => {
  let size = 40;
  if (props.size) size = props.size;
  return (
    <Container display={props.display}>
      loading...
      {/* <Spinner
        color={props.color}
        hoverColor={props.hoverColor}
        visibility={props.visibility}
        margin={props.margin}
        size={size}
      ></Spinner> */}
    </Container>
  );
};

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
