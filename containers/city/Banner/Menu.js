import React, {useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import { Link } from 'react-scroll';

const MenuContainer = styled.div`
    height: max-content;
    padding: 0 ;
    background-color: white;
    z-index: 1100;
    border-radius: 5px;
    color: black;
    width: max-content;
    margin-left: 0.5rem;


`;
const MenuItem = styled.p`
    padding: 0.5rem 1rem;
    margin: 0;
`;

const Menu = (props) => {
    const ref=useRef();

    useEffect(()=> {
        const checkIfClickedOutside = e => {
            if (ref.current && !ref.current.contains(e.target)) {
                props.hideMenu();
            }
          }    
          document.addEventListener("mousedown", checkIfClickedOutside)

             return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside)
          }
    })
  return(
      <MenuContainer className="border" ref={ref}>
            {props.data.short_description ? <Link
            activeClass='citymenu-active'
            to='overview'
            spy="true"
            smooth="true"
            duration={500}>
                <MenuItem className="font-lexend" style={{fontWeight: '300'}} onClick={props.hideMenu}>Overview</MenuItem>
            </Link> : null}
            {props.data.pois.length ? <Link
            activeClass='citymenu-active'
            to='thingstodo'
            spy="true"
            smooth="true"
            duration={500}>
                <MenuItem className="font-lexend" style={{fontWeight: '300'}} onClick={props.hideMenu}>Things to do</MenuItem>
            </Link> : null}
            {props.data.conveyance_available ?<Link
            activeClass='citymenu-active'
            to='gettingaround'
            spy="true"
            smooth="true"
            duration={500}>
                <MenuItem className="font-lexend" style={{fontWeight: '300'}} onClick={props.hideMenu}>Getting Around</MenuItem>
            </Link>:null}
            {props.data.foods.length ? <Link
            activeClass='citymenu-active'
            to='whattoeat'
            spy="true"
            smooth="true"
            duration={500}>
                <MenuItem className="font-lexend" style={{fontWeight: '300'}} onClick={props.hideMenu}>What to Eat</MenuItem>
            </Link> : null}
            {props.data.survival_tips_and_tricks ?<Link
            activeClass='citymenu-active'
            to='survival'
            spy="true"
            smooth="true"
            duration={500}>
                <MenuItem className="font-lexend " style={{fontWeight: '300'}} onClick={props.hideMenu}>Survival Tips & Tricks</MenuItem>
            </Link>   : null} 
            {props.data.folklore_or_story ? <Link
            activeClass='citymenu-active'
            to='folklore'
            spy="true"
            smooth="true"
            duration={500}>
            <MenuItem className="font-lexend" style={{fontWeight: '300'}} onClick={props.hideMenu}>Folklore or Story</MenuItem>
            </Link> : null}
            {props.data.experiences.length ? <Link
            activeClass='citymenu-active'
            to='experiences'
            spy="true"
            smooth="true"
            duration={500}>
            <MenuItem className="font-lexend" style={{fontWeight: '300'}} onClick={props.hideMenu}>Experiences</MenuItem>
            </Link>   : null}       
       </MenuContainer>
  );
}

export default React.memo(Menu);
