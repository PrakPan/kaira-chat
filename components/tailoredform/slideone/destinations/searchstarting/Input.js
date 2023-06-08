
import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 
import styled from 'styled-components';
import SearchResult from './SearchResult';
import Spinner from '../../../../Spinner';

//  import LocationsContainer from './LocationsContainer'
import axiossearchstartinginstance from '../../../../../services/search/startinglocation';
import SkeletonCard from '../../../../ui/SkeletonCard';

const Container = styled.div`
 `;
const ResultsContainer = styled.div`
  position: absolute;
  width: 100%;
  background-color: white;
  left: 0;
  top: 2.75rem;
  z-index: 4;
 `;
const InputContainer = styled.input`
width: 9rem;
 &:focus{
    border: none;
    outline: none;
 }
 border: none;
 
  @media screen and (min-width: 768px){
 
}

`;

const skeleton = <div style={{display:'flex' , marginBlock:'1rem' , marginLeft :'10px'}}>
<SkeletonCard borderRadius='100%' width='52px' ml='1px'></SkeletonCard>
<div>
<SkeletonCard height='14px' ml='4px' width={'50%'} borderRadius={'2px'}></SkeletonCard>
<SkeletonCard height='12px' ml='4px' mt='4px' width={'35%'} borderRadius={'2px'}></SkeletonCard>
</div>
</div>



const SearchInput = (props) => {

  let isPageWide = media('(min-width: 768px)');
  const [loading, setLoading] = useState(false);
  const [resultsJSX, setResultsJSX] = useState([]);
  // const [selected, setSelected] = useState(false);
  // const [showCities, setShowCities] = useState(false);
  // const [props.startingLocationCities, setSelectedCities] = useState([]);

  const _selectResult  =(event, text, place_id) => {
    event.stopPropagation();
     setResultsJSX([]);
    props.setShowSearchStarting(false);
    props.setStartingLocation({'name': text, 'place_id': place_id});
  }
  const _getResults = (query) => {
<<<<<<< HEAD
    setLoading(true);
    if(query)
    if(query.length > 1)

=======
    if(query)
    if(query.length > 1)
{
  setLoading(true);
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
  axiossearchstartinginstance.get(
        `?q=`+query
      )
      .then((res) => {
        setLoading(false);
        let results = [];
       if(!res.data.length) _handleClearResults();
       else
       for(var i = 0 ; i < res.data.length; i++){
        results.push(
          <SearchResult selectResult={_selectResult} text={res.data[i].text} place_id={res.data[i].place_id}></SearchResult>
        );
       }
       setResultsJSX(results)
      //   setLocations(res.data);
      //  setLoaded(true);

      })
      .catch((error) => {
        setLoading(false);
        _handleClearResults();
        setResultsJSX([<div style={{margin : '1rem'}}>Something went wrong! Please try again later.</div>])
        // alert('Page could not be loaded. Please try again.');
      });
    
    }
    }
    const _handleClearResults = () => {
      setResultsJSX([]);
      props.onfocus();
      // props.setStartingLocation(false);
    }
    const _handleBlur = (e)=>{
      props.onblur() ; 
      if(!e.target.value)props.setShowSearchStarting(false)
    }


   return (
     <Container>
       {props.showSearchStarting ? (
         <div style={{ display: "flex" }}>
           <InputContainer
             onFocus={props.onfocus}
             onBlur={_handleBlur}
             placeholder="Departing from"
             className="font-lexend"
             autoFocus
             onChange={(e) => _getResults(e.target.value)}
           >
             {/* ed */}
           </InputContainer>
           {loading ? <Spinner size={16} margin="0"></Spinner> : null}
         </div>
       ) : null}
       {!props.showSearchStarting && props.startingLocation ? (
         <div className="font-lexend" onClick={_handleClearResults}>
           {props.startingLocation.name}
         </div>
       ) : null}
       {resultsJSX.length && props.showSearchStarting ? (
         <ResultsContainer className="border">
           {loading
             ? [skeleton, skeleton, skeleton, skeleton, skeleton]
             : resultsJSX}
         </ResultsContainer>
       ) : null}
     </Container>
   );
}


export default SearchInput;

