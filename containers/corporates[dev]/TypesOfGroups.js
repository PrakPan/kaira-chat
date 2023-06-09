import React from 'react';
import styled from 'styled-components';
// import Button from '../../components/Button';
import Button from '../../components/ui/button/Index'
import ImageLoader from '../../components/ImageLoader';
// import Heading from '../../components/heading/Heading';
import Heading from '../../components/newheading/heading/Index';
import urls from '../../services/urls';

/*
Description:
BusinessWhyUs component
------------------------------------------------------------------------------------------------
Props:
none
------------------------------------------------------------------------------------------------
Components used:
styled, Button, ImageLoader, Heading
*/

const Container = styled.div`
@media screen and (min-width: 768px){
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
`;

const Card = styled.div`

@media screen and (min-width: 768px){
    &:nth-of-type(1){
        grid-row: 1;
        grid-column: 2/2;
    }
    &:nth-of-type(2){
        grid-row: 1;
        grid-column: 1/2;
    }
    
    &:nth-of-type(5){
        grid-row: 3;
        grid-column: 2/2;
    }
    &:nth-of-type(6){
        grid-row: 3;
        grid-column: 1/2;
    }
    
    &:nth-of-type(9){
        grid-row: 5;
        grid-column: 2/2;
    }
    &:nth-of-type(10){
        grid-row: 5;
        grid-column: 1/2;
    }
}

`;



const Text = styled.p`
font-size: 0.8rem;
@media screen and (min-width: 768px){
    font-size: 1.25rem;
    line-height: 1.75;
    font-weight: 300;
    width: 60%;
}
`;

const BusinessWhyUs = () => {
    return (
        <Container>
            <Card>
                <ImageLoader dimensions={{ width: 600, height: 350 }} url="media/ruby/cycletour.jpg" />
            </Card>
            <Card className="center-div">
                    <Heading bold noline align="center">For Corporates</Heading>

                    <Text className="font-nunito text-center">
                        “Lorem Ipsum Talking to customerLorem Ipsum Talking to customer Lorem
                        Ipsum Talking to customer Lorem ”
          </Text>

                    <Button boxShadow link={urls.ERROR404}  display={"inline"} borderRadius={"3rem"} borderWidth="1px">Check Out Now</Button>
            </Card>

            <Card>
                <ImageLoader dimensions={{ width: 1200, height: 900 }} url="media/ruby/cycletour.jpg" />
            </Card>
            <Card className="center-div">
                    <Heading  bold noline  align="center">For Startups</Heading>

                    <Text className="font-nunito text-center">
                        “Lorem Ipsum Talking to customerLorem Ipsum Talking to customer Lorem
                        Ipsum Talking to customer Lorem ”
              </Text>
                    {/* <Button display={"inline"} borderRadius={"3rem"} borderWidth="1px">Check Out Now</Button> */}
                    {/* <Button boxShadow link={'/'} display={"inline"} borderRadius={"3rem"} borderWidth="1px">Check Out Now</Button> */}

            </Card>

            <Card>
                <ImageLoader dimensions={{ width: 1200, height: 900 }} url="media/ruby/cycletour.jpg" />
            </Card>
            <Card className="center-div">
                    <Heading  bold noline  align="center" >For Old-Age Homes</Heading>

                    <Text className="font-nunito text-center">
                        “Lorem Ipsum Talking to customerLorem Ipsum Talking to customer Lorem
                        Ipsum Talking to customer Lore ”
              </Text>
                    {/* <Button display={"inline"} borderRadius={"3rem"} borderWidth="1px">Check Out Now</Button> */}
                    <Button boxShadow link={"/404"} display={"inline"} borderRadius={"3rem"} borderWidth="1px">Check Out Now</Button>
            </Card>

            <Card>
                <ImageLoader dimensions={{ width: 1200, height: 900 }} url="media/ruby/cycletour.jpg" />
            </Card>
            <Card className="center-div">
                    <Heading  bold noline  align="center">Women Groups</Heading>

                    <Text className="font-nunito text-center">
                        “Lorem Ipsum Talking to customerLorem Ipsum Talking to customer Lorem
                        Ipsum Talking to customer Lorem Ip ”
              </Text>
                    <Button boxShadow link={"/404"} display={"inline"} borderRadius={"3rem"} borderWidth="1px">Check Out Now</Button>
            </Card>

            <Card>
                <ImageLoader dimensions={{ width: 1200, height: 900 }} url="media/ruby/cycletour.jpg" />
            </Card>
            <Card className="center-div">
                    <Heading  bold noline  align="center">Institutions</Heading>

                    <Text className="font-nunito text-center">
                        “Lorem Ipsum Talking to customerLorem Ipsum Talking to customer Lorem
                        Ipsum Talking to customer Lorem Ipsu ”
              </Text>
                    <Button boxShadow link={"/404"} display={"inline"} borderRadius={"3rem"} borderWidth="1px">Check Out Now</Button>
            </Card>

        </Container>
    );
}

export default BusinessWhyUs;