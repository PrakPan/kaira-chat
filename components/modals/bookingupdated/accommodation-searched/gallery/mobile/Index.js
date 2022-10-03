import React, {useState} from 'react';
import Flickity from './Flickity';
import ImageLoader from '../../../../../ImageLoader';


const FlickityCarousel = (props) => {
  const [hover, setHover] = useState(false);

  
const _onMouseEnter = () => {
   setHover(true);
}
       return(
        <div onMouseOver={_onMouseEnter} onMouseLeave={() => setHover(false)}>
        <Flickity hover={hover}   review_score={props.review_score} review_count={props.review_count} images={props.images} cards={[<div>1</div>, <div>3</div>]}></Flickity>
        {/* <div>PRESS</div> */}
        </div> );
  } 


export default FlickityCarousel;