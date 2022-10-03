import React from 'react';
import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';

/*
Description:
LookFor component
------------------------------------------------------------------------------------------------
Props:
width
height
------------------------------------------------------------------------------------------------
Components used:
styled, ImageLoader
*/

const Container = styled.div`
display: grid;
grid-template-columns: repeat(2, 1fr);
grid-gap: 1rem;
padding:1rem;
@media screen and (min-width: 768px){
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2rem;
    padding:2rem;
    }
`;


const ImageText = styled.p`
text-align: center;
font-size: 0.8rem;
margin: 1rem;
@media screen and (min-width: 768px){
    font-size: 1.25rem;

}
`;




const LookFor = (props) => {
    return (

        <Container>
            <div>
                <ImageLoader dimensions={{ width: props.width, height: props.height }} url="media/ruby/cycletour.jpg" />
                <ImageText className="font-nunito">Lorem ipsum dolor sit amet</ImageText>
            </div>
            <div>
                <ImageLoader dimensions={{ width: props.width, height: props.height }} url="media/ruby/cycletour.jpg" />
                <ImageText className="font-nunito">Lorem ipsum dolor sit amet</ImageText>
            </div>
            <div>
                <ImageLoader dimensions={{ width: props.width, height: props.height }} url="media/ruby/cycletour.jpg" />
                <ImageText className="font-nunito">Lorem ipsum dolor sit amet</ImageText>
            </div>
            <div>
                <ImageLoader dimensions={{ width: props.width, height: props.height }} url="media/ruby/cycletour.jpg" />
                <ImageText className="font-nunito">Lorem ipsum dolor sit amet</ImageText>
            </div>
            <div>
                <ImageLoader dimensions={{ width: props.width, height: props.height }} url="media/ruby/cycletour.jpg" />
                <ImageText className="font-nunito">Lorem ipsum dolor sit amet</ImageText>
            </div>
            <div>
                <ImageLoader dimensions={{ width: props.width, height: props.height }} url="media/ruby/cycletour.jpg" />
                <ImageText className="font-nunito">Lorem ipsum dolor sit amet</ImageText>
            </div>
        </Container>
    );
}

export default LookFor;