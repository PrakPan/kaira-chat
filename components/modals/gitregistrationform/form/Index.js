import React, {useState} from "react";
 
import styled from 'styled-components';
import Person from './person/Index';
import Spinner from "../../../Spinner";
const Container = styled.div`
 
@media screen and (min-width: 768px){
    width: 90%;
    margin: auto;
}
`;
const PaxContainer = styled.div`
width : 100%;
`
 
 const PayNow = styled.div`
    padding: 0.75rem;
    width: 100%;
    border-radius: 5px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    line-height: 1;
    margin: 0.75rem 0;
    font-weight: 600;
    background-color: #f7e700;
    @media screen and (min-width: 768px){
        &:hover{
            background-color: black;
            color: white;
        }
    }
  
 `;

 const Error = styled.p`
    color: red;
    font-size: 13px;
    margin: 1rem 0 1rem 0;
 `
const Enquiry = (props) => {
    const [paxList, setPaxList] = useState([]);

    const _addPersonHandler = (data) => {
        let pax = paxList.slice();
        pax.push(
            data
        )
        setPaxList(pax);

    }
    const _removePersonHandler = (data) => {
        let pax = paxList.slice();
        let updated_pax = [];
        for(var i = 0 ; i < pax.length; i++){
                if(pax[i].email !== data.email) updated_pax.push(pax[i]);
        }
        setPaxList(updated_pax)
    }
     let pax = []
    for(var i = 0 ; i < props.pax ; i++){
        pax.push(
        <div style={{marginBlock : '1rem'}}>
            <Person id={props.id} _removePersonHandler={_removePersonHandler} verificationCount={props.verificationCount} setVerificationCount={props.setVerificationCount}  token={props.token} email={props.email} _addPersonHandler={_addPersonHandler}  index={i+1} first={!(i)}></Person>
        </div>
        )
    }
     // setPaxJSX(pax);
return(
    <Container className="borer center-div">
              <div>
            </div>
            
            <PaxContainer>
                {pax}
            </PaxContainer> 
           {props.formNotFilledError ? <Error>{'Please fill all traveler details'}</Error> : null} 
           {props.formFailedError ? <Error>{props.formFailedError}</Error> : null} 

        
           <PayNow className="hover-pointer font-lexend" onClick={() => props.onSuccess(paxList)} >
                Pay Now
             {props.paymentLoading ? <Spinner color="white" size={16} display="inline" margin=" 0 0 0 0.25rem"></Spinner> : null}
            </PayNow>
     </Container>
);
}

export default Enquiry;