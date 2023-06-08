import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

import {BsDot} from 'react-icons/bs'


const Container = styled.div`
width: 100%;
margin: auto;
font-size: 0.9rem;
font-weight: 300;
padding: 0 1rem;
`;



const Policies= (props) => {
    const [policies, setPolicies] = useState(null);
    useEffect(() => {
        let policies_arr = [];
        if(props.data.hotel_rules){
            for(var i=0; i<props.data.hotel_rules.length; i++){
                if(props.data.hotel_rules[i] === "") null;
                else policies_arr.push(
                    <li className='font-lexend'>{props.data.hotel_rules[i]}</li>
                );
            }
            setPolicies(policies_arr)
        }
      }, [props.data]);
return( 
 <Container className=''>
    {policies}
</Container>
);

}

export default Policies;