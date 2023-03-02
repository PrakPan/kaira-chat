import React from 'react';
import styled from 'styled-components';
// import Button from '../../components/Button';
import Button from '../ui1/button1/Index1';
import ImageLoader from '../ImageLoader';
import urls from '../../services/urls';

const YellowBar = styled.div`
max-width: 100vw !important;
padding: 2rem;
background-color: #E7F700;
/* background-color: ${props => props.theme.colors.brandColor}; */
margin: 0;
`;
const YellowBarContent = styled.div`
width: 100%;
margin: auto;
padding: 0rem;
display: grid;
grid-gap: 1rem;
grid-template-columns: max-content auto;
@media screen and (min-width: 768px){ 
    width: 80%;
    padding: 1rem;
    grid-template-columns: 50% 50%;


}
`;



const IconsContainer = styled.div`
display: none;
@media screen and (min-width: 768px){ 
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 2rem 0;
}
`;
const IconContainer = styled.div`
text-align: center;
padding: 0 2rem;
`;
const Icon = styled.img`
height: auto;
@media screen and (min-width: 768px){ 
    width: 40%;
}
`
const LinkHeading = styled.p`
margin: 1rem 0;
text-align: center;
font-size: 1.5rem;
/* font-size: ${props => props.theme.fontsizes.mobile.text.one}; */
@media screen and (min-width: 768px){ 
font-size: 3rem;
/* font-size: ${props => props.theme.fontsizes.desktop.headings.three}; */
margin: 3rem 0;
}

@media (min-width: 768px) and (max-width: 1024px) {
font-size: 1.5rem;
/* font-size: ${props => props.theme.fontsizes.mobile.text.one}; */
}
`;
const WhyUs = styled.p`
display: none;
@media screen and (min-width: 768px){ 
margin: 0 0 1rem 0;
display: initial;
font-size:2rem ;
/* font-size: ${props => props.theme.fontsizes.desktop.text.one}; */
margin-bottom:  2rem;
font-weight: 300;
text-align: center;

}
@media (min-width: 768px) and (max-width: 1024px) {
font-size: 1.25rem;
}

`;
const IconText = styled.p`
margin: 0.5rem;
font-size: 0.75rem;
@media screen and (min-width: 768px){ 
font-size: 1.1rem;
/* font-size: ${props => props.theme.fontsizes.desktop.text.default}; */
}
@media (min-width: 768px) and (max-width: 1024px) {
font-size: 1rem;
}
`;

const Yellow = (props) => {
   
    return(
            <YellowBar>
                <YellowBarContent>
                    <div className="center-div">
                        <LinkHeading className="font-opensans"><b>The Tarzan Way</b></LinkHeading>
                        <WhyUs className="font-opensans">What make us different?</WhyUs>
                        <IconsContainer >
                            <IconContainer style={{borderStyle: "none solid none none", borderWidth: "1px"}}>
                            <ImageLoader  widthtab="25%" width="40%" url="media/icons/general/personalise.svg"></ImageLoader>
                                <IconText className="font-opensans">Personalization</IconText>
                            </IconContainer>
                            <IconContainer>
                            <ImageLoader  widthtab="25%"  width="40%" url="media/icons/general/transparency.svg"></ImageLoader>
                                <IconText className="font-opensans">Transparency</IconText>
                            </IconContainer>
                        </IconsContainer>
                        {/*<Link to="https://thetarzanway.com/testimonials" style={{textDecoration: "none", color: "black"}}>*/}
                        {/*    {window.innerWidth > 768 ? */}
                                
                                <Button
                                link={urls.TESTIMONIALS}
                            borderWidth="2px"
                            hoverColor="#F7e700"
                            // borderWidth="1px"
                            fontSizeMobile="0.75rem"
                            padding="0.5rem"
                            //onclick={null}
                            >
                            Read More
                            </Button>
                               
                        {/*</Link>*/}
                    </div>
                    <div className="center-div">
                        <ImageLoader widthtab="70%" dimensions={{width: 1400, height: 900}} fit="cover" dimensionsMobile={{width: 1400, height: 900}} width="100%" url="media/illustrations/footer.png"></ImageLoader>
                    </div>
                </YellowBarContent>
            </YellowBar>
    );
}

export default Yellow;

{/* <a href="https://thetarzanway.com/testimonials">
<Button
link={"https://thetarzanway.com/testimonials"}
borderWidth="2px"
hoverColor="#F7e700"
// borderWidth="1px"
fontSizeMobile="0.75rem"
padding="0.5rem"
//onclick={null}
>
Read More
</Button>
</a> */}