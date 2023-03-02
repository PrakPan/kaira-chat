import React, {useEffect, useState} from 'react';
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
    padding: 0.25rem 2rem;
    margin: 0;
`;

const Menu = (props) => {

  return(
      <MenuContainer className="border">
            <Link
            activeClass='active'
            to='overview'
            spy="true"
            smooth="true"
            duration={500}>
                <MenuItem className="font-opensans" style={{fontWeight: '300'}} onClick={props.hideMenu}>Overview</MenuItem>
            </Link>
            <Link
            activeClass='active'
            to='route'
            spy="true"
            smooth="true"
            duration={500}>
                <MenuItem className="font-opensans" style={{fontWeight: '300'}} onClick={props.hideMenu}>{props.locations.length > 1 ? 'Route' : 'Location'}</MenuItem>
            </Link>
            <Link
            activeClass='active'
            to='howtoreach'
            spy="true"
            smooth="true"
            duration={500}>
                <MenuItem className="font-opensans" style={{fontWeight: '300'}} onClick={props.hideMenu}>How to reach</MenuItem>
            </Link>
            <Link
            activeClass='active'
            to='inclusions'
            spy="true"
            smooth="true"
            duration={500}>
                <MenuItem className="font-opensans " style={{fontWeight: '300'}} onClick={props.hideMenu}>What's Inlcuded?</MenuItem>
            </Link>    
            <Link
            activeClass='active'
            to='exclusions'
            spy="true"
            smooth="true"
            duration={500}>
            <MenuItem className="font-opensans" style={{fontWeight: '300'}} onClick={props.hideMenu}>What's Excluded?</MenuItem>
            </Link>       
       </MenuContainer>
  );
}

export default React.memo(Menu);
