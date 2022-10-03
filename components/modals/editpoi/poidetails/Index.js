import React from 'react';
import styled from 'styled-components'
import Poi from '../../poi-updated/Body';
 
const Container = styled.div`
  
   
 `;
 
const  Index = (props) =>{
    const POI = {
        "name": "Old Manali",
        "image": "media/pois/159897320973892593383789062500.jpg",
        "is_activity": false,
        "short_description": "Old Manali is situated near the Mali town, around 3 km away. It is the most attractive place in Manali and has a variety of pleasing things to offer. From the beautiful views, the calming environment to fashioned shopping streets and restaurants and cafes, people love to spend a day or two here. It is the perfect place to relax and indulge in the beauty of nature.\r\nA visit to Old Manali is a total stress buster, the scenic views of the mountains and beautiful waterfalls are just breathtaking and for delicious meals do try the cafes and restaurants. \r\nOld Manali is a place that can be visited at any time of the year, but if you are someone that enjoys the cool breezes and love winters, visit this place in the months of December-February.",
        "getting_around": "Old Manali is situated at a distance of 3 km from Manali town. One could reach Old Manali by various modes of transportation.\r\nBy Car: You can drive to Old Manali yourself or hire a private rental car from Manali town.\r\nBy Taxi/cab: Many cabs and taxis can be hired to take you to Old Manali. They even offer the passengers to roam around in their taxi/cab for the whole day at discounted prices.\r\nBy Bus: Local buses run in close intervals that can take you to Old Manali. It is the cheapest mode of transportation.",
        "ideal_duration_hours": 5.0,
        "tips": [
            "Do carry woolen clothes even in summers\n",
            "Do not always go according to the cab drivers, check online for the famous places to visit\n",
            "Do try an activity or two when visiting Old Manali\n"
        ],
        "recommendation": [
            "You should try at least one or two restaurants/cafes\n",
            "Always leave your hotel/guest house early in the morning to avoid traffic\n"
        ],
        "lat": 32.253185,
        "long": 77.178169,
        "experience_filters": [
            "Adventure and Outdoors",
            "Nature and Retreat",
            "Nightlife and Events",
            "Shopping"
        ],
        "entry_fees": [
            "Free\n"
        ],
        "timings": {
            "opening_time": "00:00:00",
            "closing_time": "06:00:00"
        },
        "weekday": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ]
    }
     return(
        <Container>
             <Poi poi={props.data}></Poi>
        </Container>
    );
     }

export default Index;