import React from 'react';
import styled from 'styled-components';
//  import LocationsContainer from './LocationsContainer'
import axiossearchsuggestinstance from "../../../../../../services/search/searchsuggest";

import axios from 'axios';
const Container = styled.input`
  &:focus {
    border: solid 1px #dedede;
    outline: none;
    border-radius: 8px;
  }
  font-size: 14px;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border: solid 1px #dedede;
  border-radius: 8px;

  width: 100%;
  @media screen and (min-width: 768px) {
  }
`;

const SearchInput = (props) => {
  const _handleKey = (e) => {
    axiossearchsuggestinstance.get(
      `?q=` + event.target.value + "&parent=Himachal Pradesh"
    ).then((res) => {
        if (res.data.length) {
          props._showSearchedLocations(res.data);
        }
        // else setShowResults(false);
        else props._showSearchedLocations([]);
      });
  };
  // const [showCities, setShowCities] = useState(false);
  // const [selectedCities, setSelectedCities] = useState([]);

  return (
    <Container
      placeholder="Search cities"
      className="font-lexend"
      autoFocus
      onChange={(event) => _handleKey(event)}
    ></Container>
  );
};

export default SearchInput;
