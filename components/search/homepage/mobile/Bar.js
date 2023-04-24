import React from 'react';
import styled from 'styled-components';
import media from '../../../media';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch} from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
    background-color: white;
    border-radius: 2rem;
    width: 100%;
    padding: 0.75rem;
    width: 95%;
    margin: 0 auto 0 auto;
    `;
const SearchText = styled.span`
    opacity: 0.7;
`;
const MobileBar= (props) => {
  let isPageWide = media('(min-width: 768px)')

    return(
        <Container className="center-div" onClick={props.setPannelOpen}>
            <SearchText className="font-lexend">
                {typeof window !=='undefined' ? <FontAwesomeIcon icon={faSearch} style={{ margin:'0 0.5rem 0 0'}}></FontAwesomeIcon> : null}
                Start Planning
            </SearchText>
        </Container>
    );
}

export default MobileBar;
