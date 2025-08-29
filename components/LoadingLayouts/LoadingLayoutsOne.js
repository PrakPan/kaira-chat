import React from 'react'
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';


const Container = styled.div`
    display:flex;
    flex-flow: column;
    text-align: center;
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 20px;
`
const Heading = styled.div`
  font-size: 14px;
`

function LoadingLayoutsOne(props) {
    return (
        <>
            <Container>
                <CircularProgress disableShrink />
                <Heading> {props.message} </Heading>
            </Container>
        </>
    )
}

export default LoadingLayoutsOne