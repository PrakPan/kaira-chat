import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import media from '../../../../../media';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import Result from './Result';
import CityResult from './CityResult';
import ExperienceResult from './ExperienceResult';
const Container = styled.div`
   padding: 1rem 0;
   display: grid;
   grid-template-columns: 1fr;
   grid-row-gap: 0.5rem;
`;

const Results= (props) => {
  let isPageWide = media('(min-width: 768px)')
  let LocationResultsArr=[];
  let ExperienceResultsArr=[];
  let BlogResultsArr=[];

  const [locationresults, setLocationResults] = useState();
  const [experienceresults, setExperienceResults] = useState();
  const [blogresults, setBlogResults] = useState();


  useEffect(() => {
      if(props.results){
      for(var i = 0; i<props.results.length; i++){
                let cta = props.results[i]["_source"].cta;
                let type = props.results[i]["_source"].type;
                if(type === 'Blog'){
                    if(props.filters['blogs'] || props.filters['all'])
                BlogResultsArr.push(
                <Result key={i} title={props.results[i]["_source"].name} type={type} cta={cta} onclick={null}></Result> 
                )
                }
                else if(type === 'Experience'){
                if(props.filters['experiences'] || props.filters['all'])
                ExperienceResultsArr.push(
                <Result key={i}title={props.results[i]["_source"].name} type={type} cta={cta} onclick={null}></Result> 
                )
                }
                else if(type==='Location'){
                    if(props.filters['locations'] || props.filters['all'])
                        LocationResultsArr.push(
                            <CityResult id={props.results[i]["_source"].resource_id} key={i} title={props.results[i]["_source"].name} parent={props.results[i]["_source"].parent} type={type} cta={cta} onclick={null}></CityResult> 
 
                        )
                }
            }
            setLocationResults(LocationResultsArr);
            setExperienceResults(ExperienceResultsArr);
            setBlogResults(BlogResultsArr);

        }
        },[props.results, props.filters]);

    return(
        <Container>
            {locationresults}
            {experienceresults}
            {blogresults}
        </Container>
    );
}

export default Results;
