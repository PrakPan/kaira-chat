import content from '../../public/content/termsconditions';
import styled from "styled-components";
import YellowContainer from '../contact/YellowContainer';
import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';
import { useState } from 'react';
import { useEffect } from 'react';

import Navbar from "./Components/Navbar";
import Section from "./Components/Section";
import { faChargingStation } from '@fortawesome/free-solid-svg-icons';



const Container = styled.div`
  text-align: center;
  padding:1rem 2rem 2rem 2rem;
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 10px;
  
  

  @media screen and (min-width: 768px){
 padding:0rem 4rem 4rem 4rem;
 
}
  

`;
const Heading =styled.p`
font-size: 3.25rem;
font-weight:700;
margin:1.5rem 0 0 0;
padding:10vh 2rem 2rem 2rem;
text-align:center;
@media screen and (min-width: 768px){
    font-size:5rem;
    padding:14vh 0rem 4rem 4rem;
  
    

    
   }



`

const Linkcardstyle=styled.div`


 position: sticky;
 height: max-content;
font-size: 1.25rem;
font-weight:300;
text-decoration:none;
 top: 15vh;
 box-shadow:yellow;
`
const Cardstyle=styled.div`

font-weight:300;
font-size:1rem;
padding:0.5rem 1rem 1rem 1rem;
`







 const Terms = () => { 
    
    let textfield=[];
    const [textfieldText,settextfieldText]=useState(false);
   
    useEffect(()=>{

        for(var i =0;i<content.length;i++){
    
           
            for(var j=0;j<content[i].content.length;j++){
                
               
               
            
          textfield.push(
            <Section
            key={content[i].subheading}
            title={content[i].subheading}
            
            subtitle={content[i].content[j].text}
            
            dark={true}
            id={content[i].subheading}
            />
          )
        } }

    
    settextfieldText(textfield);
    },[])

     
    return(
      <>
      <Heading className='font-poppins' >
          Terms And Conditions
      </Heading>
     
        
        
           
        <Container className='font-poppins'>
        <Linkcardstyle 
        // className='border-thin'
           ><Navbar/></Linkcardstyle>
        <Cardstyle
        //  className='border-thin'
           >   <div> {textfieldText} </div> </Cardstyle>
      
         
        </Container>
        
        
        
       

        </>
    )
  
 }

export default Terms;



