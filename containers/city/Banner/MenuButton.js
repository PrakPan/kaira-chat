import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV} from '@fortawesome/free-solid-svg-icons';
  const DownArrow = styled.div`
        width: 16px;
        margin: 0 0.5rem 0 0;
        display: inline;
    `;
    const NavigationHeading = styled.p`
        display: inline;

    `;

const MenuButton = (props) => {
  // if(typeof wnidow!=='undefined')
  return(
    <div>
      { typeof window !=='undefined' ? <FontAwesomeIcon style={{marginRight: '0.5rem'}} icon={faEllipsisV}  onClick={props.handleClick}/> : null}
    </div>
  );
  // else return null;
}

export default React.memo(MenuButton);
