import React from 'react';
import styled from 'styled-components';
// import Button from '../../components/ui/button/Index';
import ImageLoader from '../../components/ImageLoader';
const Container = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr;
    
@media screen and (min-width: 768px){
       grid-template-columns: 1fr 1fr 1fr;
       gap: 2rem;
        width: 100%;
        margin: 0;
    }
`;

const Card = styled.div`
    padding: 0.5rem;
    @media screen and (min-width: 768px){
        padding: 1rem;
    }
`;

const CardHeading = styled.p`
    font-size: 1rem;
    font-weight: 700;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
`;

const CardListItem = styled.li`
    font-size: 0.9rem;
    font-weight: 300;
    margin-bottom: 1rem;
    line-height: 1.2;
`;
const FullImgContent = (props) => {
    return (

        <Container className='font-lexend'>
            <Card className='border center-v text-cener'>
                <ImageLoader
                url="media/website/b2b/passenger.png" 
                dimensions={{width: 100, height: 100}}
                dimensionsMobile={{width: 100, height: 100}}
                width="3rem"
                leftalign
                />
                <CardHeading className='font-lexend'>Leisure Travel: Team building company retreats</CardHeading>
                <ul style={{padding: '0 0 0 1rem'}}>
                    <CardListItem >Workcation to travel, work, and collaborate with all your employees</CardListItem>
                    <CardListItem>Weekend getaways for team building and exploring together</CardListItem>
                    <CardListItem>Unique experiences to instill team bonding with activites</CardListItem>

                </ul>
            </Card>
          
            
            <Card className='border centr-div textcenter'>
                <ImageLoader
                url="media/website/b2b/airplane-ticket.png" 
                dimensions={{width: 100, height: 100}}
                dimensionsMobile={{width: 100, height: 100}}
                width="3rem"
                leftalign
                />
                <CardHeading className='font-lexend'>Booking Needs: Employee business travel needs</CardHeading>
                <ul style={{padding: '0 0 0 1rem'}}>
                    <CardListItem>Book flights & hotels at cheap prices for employees</CardListItem>
                    <CardListItem>Track your bookings & get a dedicated travel expert</CardListItem>
                    <CardListItem>24/7 travel support and booking support</CardListItem>

                </ul>
            </Card>
            <Card className='border cente-div textcenter'>
                <ImageLoader
                url="media/website/b2b/conference.png" 
                dimensions={{width: 100, height: 100}}
                dimensionsMobile={{width: 100, height: 100}}
                width="3rem"
                leftalign
                />
                <CardHeading className='font-lexend'>Conferences: Company travel excursions and conferences</CardHeading>
                <ul style={{padding: '0 0 0 1rem'}}>
                    <CardListItem >Townhall meetings with activities during the day</CardListItem>
                    <CardListItem>Travel to an offsite location and meet with the team</CardListItem>
                    <CardListItem>Work offsite for a weekend or week while exploring</CardListItem>

                </ul>
            </Card>
        </Container>
    );
}

export default FullImgContent;