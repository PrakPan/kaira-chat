import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import usePageLoaded from '../../../components/custom hooks/usePageLoaded';
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
  const isPageLoaded = usePageLoaded()
  return(
    <div>
      { isPageLoaded ? <FontAwesomeIcon style={{marginRight: '0.5rem'}} icon={faEllipsisV}  onClick={props.handleClick}/> : null}
    </div>
  );
  // else return null;
}

export default React.memo(MenuButton);
