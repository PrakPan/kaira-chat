import React from "react";
import SubHeading from '../../../components/heading/Heading';
import styled from "styled-components";
const SubHeadingterms=styled.p`

   font-size:2rem;
   font-weight:600;
   text-align:center;
   

`

export default function Section({ title, subtitle, dark, id }) {
  return (
    <div className={"section" + (dark ? " section-dark" : "")}>
      <div  className="section-content" id={id}>

        <SubHeadingterms  margin='2rem auto ' font-weight='400' text-align="center" >{title}</SubHeadingterms> 
        <p>{subtitle}</p>
      </div>
    </div>
  );
}