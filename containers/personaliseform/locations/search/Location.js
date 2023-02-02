import React, { useState, useEffect }  from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../../components/ImageLoader';

const Container = styled.div`
    padding: 1rem 0.5rem;
    &:hover{
        cursor: pointer;
    }
    max-width: 100%;
    border-radius: 10px;
    display: grid;
    grid-template-columns: 2fr 4fr;
    grid-gap: 0.5rem;
    &:hover{
        cursor: pointer;
    }
 
`;
const Name = styled.p`
    font-weight: 400;
    margin: 0;
    padding: 0;
    font-size: 0.7rem;
    letter-spacing: 1.92px;
`;

const Location = (props) => {
    const [isSelected, setIsSelected ] = useState(false);
    const _isCityAdded = (location) => {

        for(var i=0 ; i<props.selectedCities.length; i++){
           if(props.selectedCities[i].city_id === location) setIsSelected(true);
       }
       
     }

    useEffect(() => {
        // _isCityAdded(props.id);
        // if(!isSelected){
            if(props.selectedCities){
            if(props.selectedCities.length) for(var i=0 ; i<props.selectedCities.length; i++){
                if(props.selectedCities[i].city_id === props.id){
                    setIsSelected(true);
                    break
                }
                else setIsSelected(false);
            }
            else setIsSelected(false)
        }
            else{
                // for(var i=0 ; i<props.selectedCities.length; i++){
                //     if(props.selectedCities[i].city_id === props.id) setIsSelected(true);
                //     else setIsSelected(false);
                // }
                setIsSelected(false)
            }

        // }
      
      },[props.selectedCities, props.id]);
     return(
        <Container className="border-thin" onClick={ isSelected ?  () => props._removeCityHandler(props.id, {"name": props.name, "parent": props.parent, "city_id": props.id}) : () => props._addCityHandler(props.id, {"name": props.name, "parent": props.parent, "city_id": props.id})} style={{backgroundColor : isSelected ? 'rgba(247,231,0,0.3)' : 'transparent'}}>
            <div className='center-div' style={{backgroundColor: '#e4e4e4', borderRadius: '50%', height: '55px' , width: '55px'}} ><ImageLoader
                    url={props.location ? props.location.image ? props.location.image : 'media/website/grey.png' :  'media/website/grey.png'}
                    borderRadius='50%'
                    height="55px"
                    width="55px"
                    heighttab="55px"
                    widthmobile="55px"
                    dimensions={{width: 100, height: 100}}
                    dimensionsMobile={{width: 100, height: 100}}
                    fit="cover"
                    hoveropacity="0.6"
                    hoverpointer/>
                    </div>
                <div className='center-div font-nunito text-center'><Name>{props.location ? props.location.name : ''}</Name></div>
        </Container>
    );
   
}

export default Location;