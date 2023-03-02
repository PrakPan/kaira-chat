import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

import {BsDot} from 'react-icons/bs'


const Container = styled.div`
width: 100%;
margin: auto;
display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;


const Ammenity = styled.div`
    font-size: 0.8rem;
    background-color: hsl(0,0%,95%);
    padding: 0.25rem;
    border-radius: 5px;
`;
const Ammenities= (props) => {
    const [ammenities, setAmmenities] = useState(null);
    useEffect(() => {
        let ammenities_arr = [];
        if(props.data.hotel_facilities){
            for(var i=0; i<props.data.hotel_facilities.length; i++){
                ammenities_arr.push(
                    <Ammenity className='font-opensans'>{props.data.hotel_facilities[i]}</Ammenity>
                );
            }
            setAmmenities(ammenities_arr)
        }
      }, [props.data]);
return( 
 <Container className='center-di'>
    {ammenities}
</Container>
);

}

export default Ammenities;