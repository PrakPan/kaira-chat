import React, {useState} from 'react';
import {Modal} from 'react-bootstrap';
// import img from '../../../assets/carousel/yoga.jpg';
// import img2 from '../../../assets/carousel/food.jpg';
// import img3 from '../../../assets/carousel/yoga.jpg';
// import img4 from '../../../assets/carousel/scuba.jpg';
// import img5 from '../../../assets/carousel/monument.jpg';
// import img6 from '../../../assets/carousel/play.jpg';
// import img7 from '../../../assets/carousel/concert.jpg';
// import img8 from '../../../assets/carousel/trek.jpg';
// import img9 from '../../../assets/carousel/art.jpg';
// import img10 from '../../../assets/carousel/road.jpg';
import Button from '../../Button';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Option from './Option';
const Carousel = (props) => {
    const [selectedState, setSelectedState] = useState([
        false, false, false, false, false,false, false, false, false, false 
    ]);
    const [hoverState, setHoverState] = useState([
        false, false, false, false, false,false, false, false, false, false 
    ]);
    const Heading = styled.h1`
        font-size: ${props => props.theme.fontsizes.desktop.headings.three};
        text-align: center;
    `;
    const GridContainer = styled.div`
        display: grid;
        width: 100%;
        margin: auto;
        @media screen and (min-width: 768px){
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

        }
    `;
    const ImgContainer = styled.div`

    width: 10vw;
    margin: auto;
    height: 10vw;
    border-radius: 50%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    &:hover{
        
        cursor: pointer;
    }
    `;
    const Selected = styled.div`
    width: max-content;
    `;
    const Img = styled.img`
        border-radius: 50%;
        width: 70%;
        display: block;
        margin: auto;
        &:hover{ 
            filter: brightness(70%);
            cursor: pointer;
        }
    `;
    const _setSelectedStateHandler = (index) => {
        let newarr=[...selectedState];
        newarr[index] = !selectedState[index]
        setSelectedState(newarr);
     }
    const _setHoverStateHandler = (index) => {
        let newarr=[...hoverState];
        newarr[index] = !hoverState[index]
        setHoverState(newarr)
    }
    return(
    <Modal className="edit-modal" show={props.show}  size="xl" centered onHide={props.hide}>
        <Modal.Body style={{padding: "2rem", borderStyle: "solid", borderColor: "#f7e700", borderRadius: "5px", borderWidth: '10px'}}>
            <h1 style={{fontSize: "32px", textAlign: "left"}} className="font-lexend">Hi Maria,</h1>
            <h2 style={{fontSize: "24px", fontWeight: "200"}} className="font-nunito">Thanks for joining our little community.</h2>
            <h2 style={{fontSize: "24px", fontWeight: "600", textAlign: "center", margin: "2rem 0"}} className="font-nunito">Pick activities you like</h2>
            <GridContainer>
                {/* <Option
                selectedState={selectedState[0]}
                _setSelectedStateHandler={_setSelectedStateHandler}
                hoverState={hoverState[0]}
                _setHoverStateHandler={_setHoverStateHandler}
                img={img}
                text="Shopping for local handicrafts"
                index={0}
                ></Option>
                <Option
                selectedState={selectedState[1]}
                _setSelectedStateHandler={_setSelectedStateHandler}
                hoverState={hoverState[1]}
                _setHoverStateHandler={_setHoverStateHandler}
                img={img}
                text="Eating local street food"
                index={1}
                ></Option>
                <Option
                selectedState={selectedState[2]}
                _setSelectedStateHandler={_setSelectedStateHandler}
                hoverState={hoverState[2]}
                _setHoverStateHandler={_setHoverStateHandler}
                img={img}
                text="Attending a yoga workshop"
                index={2}
                ></Option>
                <Option
                selectedState={selectedState[3]}
                _setSelectedStateHandler={_setSelectedStateHandler}
                hoverState={hoverState[3]}
                _setHoverStateHandler={_setHoverStateHandler}
                img={img}
                text="Scuba diving"
                index={3}
                ></Option>
                <Option
                selectedState={selectedState[4]}
                _setSelectedStateHandler={_setSelectedStateHandler}
                hoverState={hoverState[4]}
                _setHoverStateHandler={_setHoverStateHandler}
                img={img}
                text="Visiting a historic monument"
                index={4}
                ></Option>
                <Option
                selectedState={selectedState[5]}
                _setSelectedStateHandler={_setSelectedStateHandler}
                hoverState={hoverState[5]}
                _setHoverStateHandler={_setHoverStateHandler}
                img={img}
                text="Attending a play about a historic story"
                index={5}
                ></Option>
                <Option
                selectedState={selectedState[6]}
                _setSelectedStateHandler={_setSelectedStateHandler}
                hoverState={hoverState[6]}
                _setHoverStateHandler={_setHoverStateHandler}
                img={img}
                text="Traveling for a music concert"
                index={6}
                ></Option>
                <Option
                selectedState={selectedState[7]}
                _setSelectedStateHandler={_setSelectedStateHandler}
                hoverState={hoverState[7]}
                _setHoverStateHandler={_setHoverStateHandler}
                img={img}
                text="Solo trek"
                index={7}
                ></Option>
                <Option
                selectedState={selectedState[8]}
                _setSelectedStateHandler={_setSelectedStateHandler}
                hoverState={hoverState[8]}
                _setHoverStateHandler={_setHoverStateHandler}
                img={img}
                text="Appreciating art in a museum"
                index={8}
                ></Option>
                <Option
                selectedState={selectedState[9]}
                _setSelectedStateHandler={_setSelectedStateHandler}
                hoverState={hoverState[9]}
                _setHoverStateHandler={_setHoverStateHandler}
                img={img}
                text="Biking road trip"
                index={9}
                ></Option> */}
            </GridContainer>
            <Button margin="auto" borderRadius="2rem" padding="0.5rem 1rem" borderWidth="1px" onclick={props.hide} hoverColor="black" hoverBgColor="#F7e700">Confirm</Button>
        </Modal.Body>
    </Modal>);

}

export default Carousel; 