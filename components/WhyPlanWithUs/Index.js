import styled from "styled-components"

const Heading = styled.p`
font-weight: 600;
font-size: 14px;
margin-bottom : 5px;
margin-top : -5px;
@media screen and (min-width: 768px){
    font-size: 18px;
}
    `
    const Text = styled.p`
font-weight: 400;
font-size: 12px;
padding-right : 5px;
@media screen and (min-width: 768px){
    font-size: 15px;
}
    `
    const Flex = styled.div`
    display : grid;
    grid-template-columns : 1fr 3fr;
    margin-block : 25px;
@media screen and (min-width: 768px){
    column-gap : 20px;
}
`
const Icon = styled.div`
    font-size : 55px;
    margin-top : -15px
`

    const Items = styled.div`

    @media screen and (min-width: 768px){
        display : grid;
        grid-template-columns : 2fr 2fr;
        margin-inline : 0px;
        column-gap : 10%;
        width : 55%
    }
    `
    const ImagesArr = [
        '🌴',
        '🌍',
        '📱',
        '🕰️',
        '🦜',
        '💰',
    ]
    const HeadingArr  =[
        'Personalization in seconds',
        'Best Real-Time Negotiated Bookings',
        'Book-it-all in one click',
        '24x7 Live Assistance as you explore',
        'Offbeat Experiences, curated for you',
        'Transparent Pricing - No Commissions'
    ]
    const TextArr = [
        'Personalized and flexible itineraries crafted by our AI-powered planner',
        'Dedicated travel experts negotiate the best prices within your budget',
        'Book all your personalized and flexible travel needs in just one click',
        '24x7 support that keeps you swinging all day and night, no monkey business!',
        'Discover offbeat adventures, activities & experiences.',
        'Transparent pricing with no hidden fees - pay only a small service fee!'
    ]

   

const WhyPlanWithUs = (props)=>{
    const newArr = []
    for(let i = 0;i<ImagesArr.length;i++){
        newArr.push(
            <Flex>
            {/* <ImageLoader widthmobile='55px' width='55px' height='55px' url={ImagesArr[0]}></ImageLoader> */}
            <Icon>{ImagesArr[i]}</Icon>
            <div>
                <Heading>{HeadingArr[i]}</Heading>
                <Text>{TextArr[i]}</Text>
            </div>
            </Flex>
        )
    }

    return (
        <Items>
        {newArr.map(e=>e)}
        </Items> 
    )
}

export default WhyPlanWithUs