
import React, {useState, useEffect } from 'react';
<<<<<<< HEAD
  
import media from '../../../../../media';
//  import Button from '../../../../ui/button/Index';
import styled from 'styled-components';
//  import ImageLoader from '../../../ImageLoader';
//  import Location from './Destination';
//  import { TbArrowBack } from 'react-icons/tb';
// import Search from './search/Index';
// import Animate from '../../../HOC/'
=======
import SkeletonCard from '../../../../../ui/SkeletonCard'
import styled from 'styled-components';
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
import Result from './Result';
 const AbsoluteContainer = styled.div`
 background-color: white;
 padding: 0 0.5rem;
position: absolute;
top: ${props => props.top};
width: 100%;
left: 0;
<<<<<<< HEAD
z-index: 10;
=======
z-index: 1500;
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
 `
 const LocationContainer = styled.div`
 padding: 0.25rem 0;
 width: 100%;

 max-width: 100%;
 
 display: grid;
 grid-template-columns: 1fr 1fr 1fr;
 grid-gap: 0.5rem ;
 &:hover{
     cursor: pointer;
 }
 
 `;
<<<<<<< HEAD
 
const SearchResults = (props) => {

  const [locationsJSX, setLocationsJSX] = useState([]);
  const [moreLocationsJSX, setMoreLocationJSX] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const [searchedLocationsJSX, setSearchedLocationJSX] = useState([]);

  let isPageWide = media('(min-width: 768px)');

  const _isCityAdded =  (city) => {
 
  }

  const _handleClick = (city) => {
    
  }
   useEffect(() => {
    

  },[]);

  const _showSearchedLocations = (results) => {
    let seaarchedlocationsarr = [];
    for(var i = 0 ; i < results.length; i++) {
      seaarchedlocationsarr.push(
        // <Location image={results[i]["_source"].image} text={results[i]["_source"].name} onclick={_handleClick} onclickparam={results[i]["_source"]} is_selected={_isCityAdded(results[i]["_source"])} ></Location>

      )
    }
    setSearchedLocationJSX(seaarchedlocationsarr.slice())
  }

  return (
    <AbsoluteContainer className='border' top={props.top}>{
      props.results.length ?
      props.results.map(result => {
        return(
          <Result name={result["_source"].name} type={result["_source"].type} setSearchFinalized={props.setSearchFinalized}></Result>

        )
      })
      : null
    }
     


   </AbsoluteContainer>
=======
 const Heading = styled.p`
   font-weight: 500;
   font-style: normal;
   font-size: 12px;
   line-height: 16px;
   display: flex;
   align-items: center;
   text-align: center;
   text-transform: uppercase;
   margin: 1rem;
   color: #7a7a7a;
   margin-left: 0.2rem;
 `;
 
 const skeleton = <div style={{display:'grid' ,gridTemplateColumns : '34px 1fr', gap : '12px', marginBlock:'1rem'}}>
        <SkeletonCard borderRadius='100%'></SkeletonCard>
        <div>
        <SkeletonCard height='14px' width={'70%'} borderRadius={'2px'}></SkeletonCard>
        <SkeletonCard height='12px' mt='4px' width={'45%'} borderRadius={'2px'}></SkeletonCard>
        </div>
        </div>

const SearchResults = (props) => {
  useEffect(() => {
     document.body.addEventListener('click', ()=>props.setShowResults(false) );

     return ()=> {
      document.body.removeEventListener('click', ()=>props.setShowResults(false) );
  } 
  }, []);
  if(props.loading) return <AbsoluteContainer className='border' top={props.top}>{[skeleton,skeleton,skeleton,skeleton,skeleton]}</AbsoluteContainer>
  return (
    <AbsoluteContainer
      className={props.results.length && "border"}
      top={props.top}
    >
      {props.hotLocations && props.results.length ? (
        <Heading className="font-lexend">POPULAR DESTINATIONS</Heading>
      ) : null}
      {props.results.length
        ? props.results.map((result, i) => {
            if (i < 5)
              return (
                <div key={i}>
                  <Result
                    _updateDestinationHandler={props._updateDestinationHandler}
                    setShowResults={props.setShowResults}
                    setFocusSearch={props.setFocusSearch}
                    inbox_id={props.inbox_id}
                    setDestination={props.setDestination}
                    name={result.name}
                    result={result}
                    type={result.type}
                    setSearchFinalized={props.setSearchFinalized}
                    setSelectedCities={props.setSelectedCities}
                    selectedCities={props.selectedCities}
                  ></Result>
                </div>
              );
          })
        : 
        (props.results && props.results.type === 'error') ?<>{props.results.data}</>:null
        }
    </AbsoluteContainer>
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
  );
}


export default (SearchResults);

