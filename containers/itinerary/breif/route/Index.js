import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import EndLocation from './EndLocation'
import RouteSlab from './RouteSlab';
import InterConnect from './Interconnect';

const GridContainer = styled.div`
    @media screen and (min-width: 768px){
        display: grid;
        grid-template-columns: 60% 40%;
    }
`;
const RouteIndex = (props) => {

    //Stores initial order of locations
    const initialorder = {
        0: {
            location: "Jodhpur",
            duration: "1 Night"
        },
        1: {
            location: "Jaisalmer",
            duration: "2 Nights",
        },
        2: {
            location: "Jodhpur",
            duration: "1 Night"
        }
       
    }
    let locationsArr = [];
    
    const [order, setOrder] = useState(initialorder);
    const _moveDownHandler = (index) => {
        if(index === 3){
            //Last Item, disbale button
        }
        else
        setOrder({
            ...order,
            [index]: order[index+1],
            [index+1]: order[index]
        })
    }
    const _moveUpHandler = (index) => {
        if(index === 1){
            //First item, disable button
        }
        else {
            setOrder({
                ...order,
                [index]: order[index-1],
                [index-1]: order[index],
            })
        }
    }
    let startingcity = null;
    let endingcity = null; 
    if(props.breif) if(props.breif.city_slabs){
    for(var i = 0 ; i < props.breif.city_slabs.length; i++){
        if(props.breif.city_slabs[i].is_starting_city_departure_only) startingcity = props.breif.city_slabs[i].city_name;
        if(props.breif.city_slabs[i].is_trip_terminated) endingcity = props.breif.city_slabs[i].city_name;
        //If duration present and not 0, not trip terminated or departure only city show in route
        if(!props.breif.city_slabs[i].is_trip_terminated &&  !props.breif.city_slabs[i].is_starting_city_departure_only && !props.breif.city_slabs[i].is_departure_only && props.breif.city_slabs[i].duration && props.breif.city_slabs[i].duration!=="0"){
            locationsArr.push(
                <RouteSlab city={props.breif.city_slabs[i].city_name} duration={props.breif.city_slabs[i].duration+" Nights"} data={order[i]} _moveDownHandler={_moveDownHandler} _moveUpHandler={_moveUpHandler} index={i}></RouteSlab>
            );
            locationsArr.push(
                <InterConnect></InterConnect>
            );
        }
    }
    if(!startingcity) startingcity = props.breif.city_slabs[0].city_name;
    if(!endingcity) endingcity = props.breif.city_slabs[props.breif.city_slabs.length-1].city_name;
    }
  return(
    <GridContainer>
   <div>
        <EndLocation location={props.nostartinglocation ? 'Your Location' : startingcity}></EndLocation>
        <InterConnect></InterConnect>
        {locationsArr}
        <EndLocation location={props.nostartinglocation ? 'Your Location' : endingcity}></EndLocation>
   </div>
   <div>
   </div>
   </GridContainer>
  );
}

export default RouteIndex;
