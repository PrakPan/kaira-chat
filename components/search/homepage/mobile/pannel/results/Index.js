import React, { useState } from 'react';
import styled from 'styled-components';
import media from '../../../../../media';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import Results from './Results';

const Container = styled.div`
   padding: 1rem;
`;
const SearchTypeContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 0.5rem;
    max-width: 100%;
    overflow: scroll;
`;
const SearchType = styled.div`
    padding: 0.5rem;
    border-radius: 2rem;
    
`;
const ResultsContainer= (props) => {
  let isPageWide = media('(min-width: 768px)');
  const [filters, setFilters] = useState({
      all: true,
      locations: false,
        experiences: false,
        blogs: false,
  })
  const _handleAllResults = () => {
      setFilters({
            all: true,
            locations: false,
              experiences: false,
              blogs: false,
        })
  }
  const _handleFilterChange = (filter) => {
      if(filters[filter]) setFilters({...filters, [filter]: false})
      else setFilters({...filters, [filter]: true, all: false})
  }
    return(
        <Container>
            {/* <SearchTypeContainer>
                <SearchType className="border-thin text-center font-poppins" style={{backgroundColor: filters.all ?  "#f7e700" : 'transparent'}} onClick={_handleAllResults}>All</SearchType>
                <SearchType className="border-thin text-center font-poppins" style={{backgroundColor: filters.locations ?  "#f7e700" : 'transparent'}}onClick={() => _handleFilterChange('locations')}>Locations</SearchType>
                <SearchType className="border-thin text-center font-poppins" style={{backgroundColor: filters.experiences ?  "#f7e700" : 'transparent'}} onClick={() => _handleFilterChange('experiences')}>Experiences</SearchType>
                <SearchType className="border-thin text-center font-poppins" style={{backgroundColor: filters.blogs ?  "#f7e700" : 'transparent'}} onClick={() => _handleFilterChange('blogs')}>Blogs</SearchType>
            </SearchTypeContainer> */}
            <Results results={props.results} filters={filters}></Results>
        </Container>
    );
}

export default ResultsContainer;
