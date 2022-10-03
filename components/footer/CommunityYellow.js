import React from 'react';
import styled from 'styled-components';
import ImageLoader from '../ImageLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook , faLinkedin, faTwitter, faPinterest} from "@fortawesome/free-brands-svg-icons"
import media from '../media';

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
const YellowBar = styled.div`
max-width: 100vw !important;
padding: 2rem;
background-color: #f7e700;
margin: 0;
`;

const LinkHeading = styled.p`
    margin: 1rem 0;
    text-align: center;
    font-size: 1.5rem;
    /* font-size: ${props => props.theme.fontsizes.mobile.text.one ? props.theme.fontsizes.mobile.text.one : props.theme.fontsizes.mobile.text.one}; */
    font-weight: 800;
    @media screen and (min-width: 768px){ 
       font-size: 3rem;
        /* font-size: ${props => props.theme.fontsizes.desktop.headings.three ? props.theme.fontsizes.desktop.headings.three : props.theme.fontsizes.desktop.headings.three}; */
        margin: 3rem 0 0 0;
    }

    @media (min-width: 768px) and (max-width: 1024px) {
       font-size: 1.5rem;
        /* font-size: ${props => props.theme.fontsizes.mobile.text.one ?props.theme.fontsizes.mobile.text.one :props.theme.fontsizes.mobile.text.one}; */
    }
    `;
    const WhyUs = styled.p`
    display: none;
    @media screen and (min-width: 768px){ 
        margin: 2rem 0;
        display: initial;
       font-size: 2rem;
        /* font-size: ${props => props.theme.fontsizes.desktop.text.one ? props.theme.fontsizes.desktop.text.one :props.theme.fontsizes.desktop.text.one}; */
        font-weight: 300;
        text-align: center;

    }
    @media (min-width: 768px) and (max-width: 1024px) {
        font-size: 1.25rem;
    }

    `;
    const StyledFontAwesome = styled(FontAwesomeIcon)`
      font-size: 2rem;
      /* font-size: ${props => props.theme.fontsizes.desktop.text.one ? props.theme.fontsizes.desktop.text.one : props.theme.fontsizes.desktop.text.one}; */
    `;
const Yellow = (props) => {
    let isPageWide = media('(min-width: 768px)')

 
   
    
    // if(typeof window !== 'undefined')
    return(
            <YellowBar>
                <YellowBarContent>
                    <div className="center-div">
                        <LinkHeading className="font-opensans">The Tarzan Way</LinkHeading>
                        <WhyUs className="font-opensans">Join our community</WhyUs>
                        {typeof window !== 'undefined' ? <div style={{ }}>
                            <a href="https://www.instagram.com/thetarzanway" target="_blank"><FontAwesomeIcon style={{color: "black", fontSize:  isPageWide? '3rem' :'1.5rem', marginRight: isPageWide ? '2rem' : '1rem'}} icon={faInstagram} /></a>
                            <a href="https://www.facebook.com/thetarzanway/" target="_blank"><FontAwesomeIcon style={{color: "black",fontSize:  isPageWide? '3rem' :'1.5rem', marginRight: isPageWide ? '2rem' : '1rem'}} icon={faFacebook} /></a>
                            <a href="https://twitter.com/thetarzanway" target="_blank"><FontAwesomeIcon style={{color: "black", fontSize:  isPageWide ? '3rem' :'1.5rem', marginRight: isPageWide ? '2rem' : '1rem'}} icon={faTwitter} /></a>
                            <a href="https://linkedin.com/company/thetarzanway" target="_blank"><FontAwesomeIcon style={{color: "black", fontSize:  isPageWide ? '3rem' :'1.5rem', marginRight: isPageWide ? '2rem' : '1rem'}} icon={faLinkedin} /></a>
                            <a href="https://in.pinterest.com/thetarzanway/" target="_blank"><FontAwesomeIcon style={{color: "black", fontSize:  isPageWide ? '3rem' :'1.5rem'}} icon={faPinterest} /></a>                                              
                    </div> : null}
                    </div>
                    <div className="center-div">
                        <ImageLoader widthtab="70%" dimensions={{width: 1400, height: 900}} fit="cover" dimensionsMobile={{width: 700, height: 450}} width="100%" url="media/illustrations/footer.png"></ImageLoader>
                    </div>
                </YellowBarContent>
            </YellowBar>
    );
    // else return null;
}

export default Yellow;
