import React, {useState} from 'react';
import Flickity from './Flickity';


const FlickityCarousel = (props) => {
  const [hover, setHover] = useState(false);
const _onMouseEnter = () => {
   setHover(true);
}
let cards=[<div>1</div>, <div>3</div>]
      return(
        <div onMouseOver={_onMouseEnter} onMouseLeave={() => setHover(false)}>
        <Flickity hover={hover}   review_score={props.review_score} review_count={props.review_count} images={props.images} cards={[<div>1</div>, <div>3</div>]}></Flickity>
        </div> );
  } 


export default FlickityCarousel;