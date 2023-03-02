import React from 'react';
import styled from 'styled-components';
import service from '../../../public/assets/icons/whyus/color-line/service.svg'
import flexibility from '../../../public/assets/icons/whyus/color-line/flexibility.svg';
import personalise from '../../../public/assets/icons/whyus/color-line/personalise.svg';
import transparency from '../../../public/assets/icons/whyus/color-line/transparency.svg';
import culture from '../../../public/assets/icons/whyus/color-line/culture.svg';
import community from '../../../public/assets/icons/whyus/color-line/community.svg';
// import Heading from '../../../components/heading/Heading';
import Heading from '../../../components/newheading/heading/Index';
import media from '../../../components/media';

const Container = styled.div`

display: grid;      
grid-template-columns: 1fr 1fr;
@media screen and (min-width: 768px){   
    grid-template-columns: 1fr 1fr 1fr;
    width: 80%;
    margin: auto;
}
@media only screen 
and (min-device-width : 768px) 
and (max-device-width : 1024px){ 

    display: grid;      
    grid-template-columns: 1fr 1fr;
}
`;

const Card = styled.div`
 `;

const Icon = styled.img`
width: 25%;
display: block;
margin: auto;
@media screen and (min-width: 768px){   
    width: 30%;
}
`;

const Text = styled.p`    
font-weight: 300;


`;
const SubHeading = styled.p`

font-weight: 600;
margin: 1.5rem 0.25rem 1rem 0.25rem;
text-align: center;

@media screen and (min-width: 768px){   
font-size: ${props => props.theme.fontsizes.desktop.text.three};

}
`;


const WhyTarzan = () => {
    let isPageWide = media('(min-width: 768px)')
    const content = [
        {
            heading: "Transparency",
            text: "We charge no commissions and only a small & reasonable service fee for any travel experience.",
        },
        {
            heading: "Personalization",
            text: "We believe every traveler is unique which is why create completely personalized and customizable travel experiences.",
        },
        {
            heading: "Community-Driven",
            text: "Our immersive experiences are built to showcase the local communities' traditions and culture."
        },
        {
            heading: "Culturally Immersive",
            text: "Curated after extensive research, our experiences are unique and culturally authentic to give an immersive experience."
        },
        {
            heading: "Flexibility",
            text: "Our experiences are completely flexible and leave space for traveler's independence and self-exploration."
        },
        {
            heading: "24/7 Live Concierge",
            text: "To ensure every little thing goes smoothly in your experience we offer 24/7 on-chat and on-call support to all travelers."
        }
    ]
    return (
        <div>
            <Heading  align="center" aligndesktop="center" bold margin={!isPageWide  ? "3rem 0 3rem 0" : "3rem"} className="text-center font-opensans">Why The Tarzan Way?</Heading>
            <Container >
                <Card className="font-nunito">
                    <Icon src={transparency} />
                    <SubHeading className="font-opensans" >{content[0].heading}</SubHeading>
                    {isPageWide  ? <Text className="text-center font-nunito">{content[0].text}</Text> : null}
                </Card>
                <Card className="font-nunito" >
                    <Icon src={personalise} />
                    <SubHeading className="font-opensans" >{content[1].heading}</SubHeading>
                      {isPageWide ? <Text className="text-center font-nunito">{content[1].text}</Text> : null}
                </Card>
                <Card className="font-nunito">
                    <Icon src={community} />
                    <SubHeading className="font-opensans" >{content[2].heading}</SubHeading>
                      { isPageWide ? <Text className="text-center font-nunito">{content[2].text}</Text> : null}
                </Card>
                <Card className="font-nunito">
                    <Icon src={culture} />
                    <SubHeading className="font-opensans" >{content[3].heading}</SubHeading>
                      { isPageWide ? <Text className="text-center font-nunito">{content[3].text}</Text> : null}
                </Card>
                <Card className="font-nunito">
                    <Icon src={flexibility} />
                    <SubHeading className="font-opensans" >{content[4].heading}</SubHeading>
                      { isPageWide ? <Text className="text-center font-nunito">{content[4].text}</Text> : null}
                </Card>
                <Card className="font-nunito">
                    <Icon src={service} />
                    <SubHeading className="font-opensans" >{content[5].heading}</SubHeading>
                      { isPageWide ? <Text className="text-center font-nunito">{content[5].text}</Text> : null}
                </Card>
            </Container>
        </div>
    );
    
}

export default WhyTarzan;