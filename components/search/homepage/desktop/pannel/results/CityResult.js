import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router'
import Link from 'next/link';

const Container = styled.div`
padding: 1rem;
text-align: left;
display: flex;
justify-content: space-between;
border: solid 1px #E4e4e4;
border-radius: 5px;
&:hover{
    cursor: pointer;
}
`;
const ResultTitle = styled.p`
margin: 0;
font-weight: 800;
font-size: 1.25rem;
&:hover{
}
`;

const CTA = styled.p`
border-style: none;
border-radius: 2rem;
color: black; 
padding: 0.5rem 2rem;
fontSize: 1rem; 
margin: 0;
background-color: #f7e700;
&:hover{
    background-color: black;
    color: white;
    cursor: pointer;
}
`;


const Result= (props) => {
  const router = useRouter();
const _handleCTA = () => {
    // router.push('/travel-guide/city/'+props.cta)
    window.location.href = '/' + props.path

}
const _handlePlanning = (id, name) => {
  openTailoredModal(router, id, name);
};
    return (
      <Container>
        <Link href={"/" + props.path} style={{textDecoration : 'none' , color :"black"}}>
          <ResultTitle className="font-lexend">
            {props.title}
          </ResultTitle>
          <p
            style={{ opacity: "0.5", fontSize: "0.75rem", margin: "0" }}
            className="font-lexend"
          >
            {props.type.toUpperCase()}
          </p>
        </Link>
        <div className="center-div">
          <CTA
            className="font-nunito"
            onClick={() => _handlePlanning(props.id, props.title)}
          >
            Start Planning
          </CTA>
        </div>
      </Container>
    );
}

export default Result;
