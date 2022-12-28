
import Flickity from 'react-flickity-component';
import styled from 'styled-components';
import SlideOne from "./SlideOne";
import React, {useState, useRef} from "react";

const Card = styled.div`
width: 100%;
margin: 2px 1rem;
 
`;
const flickityOptions = {
    initialIndex:0,
    prevNextButtons: false,
    wrapAround: false,
    draggable: false,
    pageDots: false,

};
class Carousel extends React.Component {

    componentDidMount = () => {
      // You can register events in componentDidMount hook
      this.flkty.on('settle', () => {
        console.log(`current index is ${this.flkty.selectedIndex}`)
      })
    }
  
    myCustomNext = () => {
      // You can use Flickity API
      this.flkty.next()
    }
  
    render() {
      return (
        <div style={{width: '100%'}}><Flickity 
          className={'carousel'}
          elementType={'div'}
          options={flickityOptions}
          reloadOnUpdate
          static
        flickityRef={c => this.flkty = c}>
                            <Card><SlideOne></SlideOne></Card>
                            <Card><SlideOne></SlideOne>
                            <SlideOne></SlideOne></Card>
                            <Card><SlideOne></SlideOne></Card>

        </Flickity>
        <div  style={{backgroundColor: 'black', width: '100%'}} className="text-center font-opensans" onClick={() => this.flkty.next()}>next button</div></div>
      )
    }
  }

  export default  Carousel;