import LadakhContainer from '../../containers/travelplanner/Index';
import Head from 'next/head';
import Layout from '../../components/Layout'

const DATA = {
    "page_type": "Destination",
    "destination": "Ladakh",
    "page_title": "Travel Company | India | The Tarzan Way",
    "id": 4,
    "link": "ladkah-trip-planner",
    "banner_heading": null,
    "banner_text": null,
    "overview_heading": "Overview",
    "overview_text": "Lorem Ipsum",
    "image": "media/cities/162608395527500414848327636719.jpg",
    "image_alt_text": null,
    "itineraries": [],
    "itinerary_data": {},
    "locations": [
        {
            "id": 114,
            "name": "Leh, Ladakh",
            "slug": "leh,_ladakh",
            "tagline": "Little Tibet",
            "nicknames": [
                "Ladakh",
                "Leh"
            ],
            "lat": 34.142897,
            "long": 77.555333,
            "state": {
                "id": 26,
                "name": "Ladakh",
                "region": "North India",
                "state_abbr": null,
                "country": "India",
                "country_code": "IN"
            },
            "country": "India",
            "short_description": "Ladakh may be a small district and a neighborhood of Jammu and Kashmir area within the northernmost a part of India. Ladakh is legendary with its scenic views thanks to its location on the hills of the Himalayas. The northern corner of the world touches the border between India and China. The area is sort of dry and is correctly irrigated for agriculture to develop. The local population number is on the brink of 275 thousand people, most of these live at the expense of what they manage to grow in their gardens and fields. There are a couple of tourist attractions within the district, including an outsized natural preserve, Hemis park .",
            "is_active": true,
            "is_live": true,
            "image": "media/cities/162608395527500414848327636719.jpg",
            "most_popular_for": [
                "Adventure and Outdoors",
                "Nature and Retreat",
                "Isolated"
            ],
            "extra_images": [
                "media/cities/162608395550458812713623046875.jpg",
                "media/cities/162608395570659041404724121094.jpg",
                "media/cities/162608395582368302345275878906.jpg",
                "media/cities/162608395594803524017333984375.jpg"
            ],
            "bus_stops": {
                "City Point Name": "",
                "City Point Index": ""
            },
            "has_airport": true,
            "airport_codes": [
                "IXL"
            ],
            "airport_distance": 1,
            "intracity_transport": "Taxi",
            "type": "City"
        },
        {
            "id": 479,
            "name": "Nubra",
            "slug": "nubra",
            "tagline": null,
            "nicknames": [
                "nubra"
            ],
            "lat": 34.6863,
            "long": 77.5673,
            "state": {
                "id": 26,
                "name": "Ladakh",
                "region": "North India",
                "state_abbr": null,
                "country": "India",
                "country_code": "IN"
            },
            "country": "India",
            "short_description": "Located in the northernmost part of Jammu and Kashmir, the Nubra valley is heaven to the eyes. Its scenic beauty and mesmerizing landscapes are what make Nubra special.. The Nubra valley is situated about 150 km from Leh and is popularly known as the orchard of Ladakh. Nubra isn't just an epitome of scenic beauty but also encloses a history of ancient Buddhist tradition within it, making it a significant tourist attraction. Nubra provides a variety of exciting adventures, beautiful monuments, and amazing food to satisfy a traveler's heart. It is the gem of Ladakh's crown. The mesmerizing visuals, the thrilling adventures, and the deep-rooted tradition make the valley a perfect travel destination.",
            "is_active": true,
            "is_live": true,
            "image": "media/cities/165365508947220158576965332031.jpg",
            "most_popular_for": [
                "Adventure and Outdoors",
                "Spiritual",
                "Nature and Retreat",
                "Isolated",
                "Heritage",
                "Art and Culture",
                "Nightlife and Events"
            ],
            "extra_images": [
                "media/cities/165365508966215634346008300781.jpg",
                "media/cities/165365508979673290252685546875.jpg",
                "media/cities/165365508991474747657775878906.jpg",
                "media/cities/165365509003232598304748535156.jpg"
            ],
            "bus_stops": {
                "City Point Name": "",
                "City Point Index": ""
            },
            "has_airport": false,
            "airport_codes": [],
            "airport_distance": null,
            "intracity_transport": "Taxi",
            "type": "Valley"
        },
        {
            "id": 459,
            "name": "Pangong Tso",
            "slug": "pangong_tso",
            "tagline": "A mosaic of myriad shades of blue",
            "nicknames": [
                "Pangong Tso"
            ],
            "lat": 33.78752,
            "long": 78.66381,
            "state": {
                "id": 26,
                "name": "Ladakh",
                "region": "North India",
                "state_abbr": null,
                "country": "India",
                "country_code": "IN"
            },
            "country": "India",
            "short_description": "Located at a height of 4350 meters, Pangong Lake is often called a mosaic of myriad shades of blue because of its pristine water. The Lake is one of the world's highest brackish water lakes. The lake is situated almost on the Indo- China border and a part of it is in India, while the other is in China. A scene from one of the superhit Bollywood movies, 3 Idiots, was shot here and since then the Lake has become a famous tourist destination.",
            "is_active": true,
            "is_live": true,
            "image": "media/cities/165727019626785445213317871094.jpg",
            "most_popular_for": [
                "Adventure and Outdoors",
                "Nature and Retreat",
                "Isolated"
            ],
            "extra_images": [
                "media/cities/165727019643760180473327636719.jpg",
                "media/cities/165727019649076008796691894531.jpg",
                "media/cities/165727019658298373222351074219.jpg",
                "media/cities/165727019677878594398498535156.jpg"
            ],
            "bus_stops": {
                "City Point Name": "",
                "City Point Index": ""
            },
            "has_airport": false,
            "airport_codes": [],
            "airport_distance": null,
            "intracity_transport": "Taxi",
            "type": "One day tour"
        }
    ],
    "image_credit": null,
    "is_verified": false,
    "meta_description": "",
    "social_share_title": "The Tarzan Way | Personalized Travel Experiences",
    "social_media_description": "",
    "meta_title": "Leh, Ladakh Planner",
}
const TravelPlanner = () => {

     return <Layout> 
      <Head>
      <title>{DATA.meta_title}</title>
      <meta name="description" content={DATA.meta_description}></meta>
          <meta property="og:title" content={DATA.social_share_title}/>
          <meta property="og:description" content={DATA.social_media_description} />
          <meta property="og:image" content="/logoblack.svg" />
          <meta property='keywords' content={DATA.meta_keywords}></meta>
</Head><LadakhContainer experienceData={DATA}></LadakhContainer>
</Layout>
    
}

export default TravelPlanner