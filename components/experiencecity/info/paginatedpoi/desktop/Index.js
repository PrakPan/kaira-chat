import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Icon from '../Poi';
// import Button from '../../../../Button';
import Button from '../../../../ui/button/Index';
import axiosthingsinstance from '../../../../../services/poi/thingstodo';
import media from '../../../../media';
import Spinner from '../../../../Spinner';

const Container = styled.div`
max-width: 100%;
display: grid;
padding: 0;
grid-template-columns: 1fr 1fr 1fr;
grid-template-rows: auto;
grid-gap: 1rem;
@media screen and (min-width: 768px){
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;

}
@media (min-width: 768px) and (max-width: 1024px) {
    grid-template-columns: 33% 33% 33%;
}
`;
const Inlcusions = (props) => {

    let isPageWide = media('(min-width: 768px)')

    const [showMoreStatus, setShowMoreStatus] = useState(true);
    const [offset, setOffset] = useState(0);
    const [pois, setPois] = useState([]);
    const [poisJSX, setPoisJSX]= useState([]);
    const [loading, setLoading] = useState(true);

    let poisJSXArr = [];
    let totalcount  = 0;

    useEffect(() => {
          axiosthingsinstance
          .get(
            `/?slug=`+props.slug+'&limit=10&offset=0'
          )
          .then((res) => {
              let newArr = [];
            let newJSXArr = [];
            totalcount+=res.data.results.length;
            for(var i = 0; i<res.data.results.length; i++){
                newArr.push({...res.data.results[i]});

                newJSXArr.push(
                    <Icon data={res.data.results[i]} _openPoiModal={(poi) => props._openPoiModal(poi)}   icon={res.data.results[i]}></Icon>
                )
            }
            setPois(newArr);
            setPoisJSX(newJSXArr); 
            setLoading(false);
   
          })
          .catch((error) => {
            setLoading(false);

          });
    
     
    }, []);

   
    
    const _showMoreHandlerNew = () => {
        let newArr = [];
        setLoading(true);

        let newoffset = offset + 10;
        axiosthingsinstance
        .get(
          `/?slug=`+props.slug+'&limit=10&offset='+newoffset
        )
        .then((res) => {
            let newJSXArr = [];

            for(var j = 0 ; j< pois.length ; j++){
               newArr.push({...pois[j]});
              newJSXArr.push(
                <Icon data={pois[j]} _openPoiModal={(poi) => props._openPoiModal(poi)}   icon={{...pois[j]}}></Icon>
            )

            }
 

         if(!res.data.results.length){
            setShowMoreStatus(false);
            setLoading(false);

        }
        else{

             if(totalcount == res.data.count) setShowMoreStatus(false);
          for(var i = 0; i<res.data.results.length; i++){
              newArr.push({...res.data.results[i]});
              newJSXArr.push(
                <Icon data={res.data.results[i]} _openPoiModal={(poi) => props._openPoiModal(poi)}   icon={{...res.data.results[i]}}></Icon>
            )
          }
          setPois(newArr); 
          setPoisJSX(newJSXArr); 
          setLoading(false);
          if(newJSXArr.length === res.data.count) setShowMoreStatus(false);

        }  
        })
        .catch((error) => {
            setLoading(false);

        });
        setOffset(newoffset);

        
    }



    return(
    <div>
        <Container>
         {poisJSX}
        </Container>
        {loading ? <div className="center-div"><Spinner></Spinner></div> : null}

        {showMoreStatus ? <Button boxShadow hoverBgColor="black" hoverColor="white" margin="1rem auto" borderRadius="2rem" borderWidth="1px" padding="2px 1.25rem" onclick={_showMoreHandlerNew} >Show More</Button>  : null}
    </div>
  ); 
}

export default React.memo(Inlcusions);


{/* <Button hoverBgColor="black" hoverColor="white" margin="1rem auto" borderRadius="2rem" borderWidth="1px" padding="2px 1.25rem" onclick={_showMoreHandlerNew} >Show More</Button>  */}