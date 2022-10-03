import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import urls from '../../services/urls';
const LinksContainer = styled.div`
display: grid;
grid-template-columns: 50% 50%;
grid-template-rows: auto;
color: white;
padding-top: 10px;
@media screen and (min-width: 768px){ 
    grid-template-columns: 25% 25% 25% 25%;
    width: 90%;
    margin: auto;
}
@media screen and (min-width: 768px) and (min-height: 1024px) {
    grid-template-columns: 50% 50%;
}
@media screen and (min-width: 768px) and (min-height: 1024px){
    grid-template-columns: 50% 50%;
}
`;
const Column = styled.div`
text-align: center;
margin: 0;
padding: 0.5rem 0;

@media screen and (min-width: 768px){ 
padding: 4rem 0;
}
@media screen and (min-width: 768px) and (min-height: 1024px) {
padding: 2rem 0;
}
`;
const UL = styled.ul`
list-style-type: none;
padding: 0 !important;
margin: none !important;
font-size: 0.75rem;

font-size:0.85rem;
/* font-size: ${props => props.theme.fontsizes.mobile.text.four ? props.theme.fontsizes.mobile.text.four : props.theme.fontsizes.mobile.text.four}; */

@media screen and (min-width: 768px){ 
font-size: 1.1rem;
    /* font-size: ${props => props.theme.fontsizes.desktop.text.default ? props.theme.fontsizes.desktop.text.default : props.theme.fontsizes.desktop.text.default}; */
line-height: 2;
}
`;
const LinkHeading = styled.p`
margin: 1rem 0;
font-weight: 700;

font-size:1rem;
/* font-size: ${props => props.theme.fontsizes.mobile.text.default ? props.theme.fontsizes.mobile.text.default : props.theme.fontsizes.mobile.text.default}; */

@media screen and (min-width: 768px){ 
font-size: 2.5rem;
    /* font-size: ${props => props.theme.fontsizes.desktop.headings.four ? props.theme.fontsizes.desktop.headings.four : props.theme.fontsizes.desktop.headings.four}; */
}
@media screen and (min-width: 768px) and (max-width: 1024px){
font-size: 1.5rem;
}

`;
const StyledA = styled.a`
text-decoration: none;
color: white;
&:hover{
    text-decoration: underline;
    cursor: pointer;
    color: white;
}
`;
const Footer = (props) => {
   
   
    return(
            <LinksContainer>

                <Column className="font-nunito">
                    <LinkHeading className="font-opensans">Travellers</LinkHeading>
                    <UL>
                    {/* <Link href="/tailored-travel" <Link href="/travel-experiences" <Link href="/travel-experiences"  */}
                        <li><Link href={urls.travel_experiences.BASE} style={{textDecoration: "none", color: "white"}}><StyledA>Travel Experiences</StyledA></Link></li>
                        <li><Link href={urls.travel_experiences.BASE} style={{textDecoration: "none", color: "white"}}><StyledA>Experience Types</StyledA></Link></li>
                        <li><Link href={urls.TAILORED_TRAVEL} style={{textDecoration: "none", color: "white"}}><StyledA>Personalise</StyledA></Link></li>
                        <li><StyledA href={urls.supplier_thetarzanway.organisation.RESISTER} >Groups</StyledA></li>
                        <li><StyledA href="https://www.thetarzanway.com/contact">FAQs</StyledA></li>
                    </UL>
                </Column>
                <Column className="font-nunito">
                <LinkHeading className="font-opensans">Organisations</LinkHeading>
                    <UL>
                        <li><Link href={urls.CONTACT} style={{textDecoration: "none", color: "white"}}><StyledA >Individuals</StyledA></Link></li>
                        <li><StyledA href={urls.supplier_thetarzanway.BASE}>Tour Operators</StyledA></li>
                        <li><Link href={urls.CONTACT} style={{textDecoration: "none", color: "white"}}><StyledA >Affiliates</StyledA></Link></li>
                        <li><StyledA href={urls.supplier_thetarzanway.BASE} >Accomodations</StyledA></li>
                        <li><StyledA href={urls.supplier_thetarzanway.BASE}>Corporates</StyledA></li>
                    </UL>
                </Column>
                <Column className="font-nunito">
                <LinkHeading>Company</LinkHeading>
                    <UL>
                        <li><Link href={urls.ABOUT_US}style={{textDecoration: "none", color: "white"}}><StyledA >About Us</StyledA></Link></li>
                        <li><Link href={urls.CONTACT} style={{textDecoration: "none", color: "white"}}><StyledA >Contact Us</StyledA></Link></li>
                        <li><StyledA href={urls.PRIVACY_POLICY}>Privacy Policy</StyledA></li>
                        <li><Link href={urls.COVID_19_SAFE_TRAVEL_INDIA} style={{textDecoration: "none", color: "white"}}><StyledA>COVID-19 Safety</StyledA></Link></li>
                        <li><StyledA href={urls.SITEMAP}>Sitemap</StyledA></li>
                    </UL>
                </Column>
                <Column className="font-nunito">
                <LinkHeading className="font-opensans">Community</LinkHeading>
                    <UL>
                        <li><StyledA href="http://blog.thetarzanway.com/" >Travel Feed</StyledA></li>
                        <li><Link href={urls.CONTACT} style={{textDecoration: "none", color: "white"}}><StyledA >Subscribe</StyledA></Link></li>
                        <li><Link href={urls.CONTACT}style={{textDecoration: "none", color: "white"}}><StyledA >Freelance</StyledA></Link></li>
                        <li><Link href={urls.CONTACT} style={{textDecoration: "none", color: "white"}}><StyledA >Bloggers</StyledA></Link></li>
                        <li><Link href={urls.CONTACT} style={{textDecoration: "none", color: "white"}}><StyledA >Travel Help</StyledA></Link></li>

                    </UL>
                </Column>
            </LinksContainer>
    );
}

export default Footer;
