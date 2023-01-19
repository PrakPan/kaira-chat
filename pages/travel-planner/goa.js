import LadakhContainer from '../../containers/travelplanner/Index';
import Head from 'next/head';
import Layout from '../../components/Layout'

const DATA ={
	"page_type": "Destination",
	"destination": "Goa",
	"page_title": "Travel Company | India | The Tarzan Way",
	"id": 7,
	"link": "goa-trip-planner",
	"banner_heading": null,
	"banner_text": null,
	"overview_heading": null,
	"overview_text": "",
	"image": "media/cities/158548001626422548294067382812.jpg",
	"image_alt_text": null,
	"itineraries": [],
	"itinerary_data": {},
	"locations": [
		{
			"id": 277,
			"name": "Goa",
			"slug": "goa",
			"tagline": "Beach Capital",
			"nicknames": [
				"Goa"
			],
			"lat": 15.2993265,
			"long": 74.12399599999999,
			"state": {
				"id": 17,
				"name": "Goa",
				"region": "Western India",
				"state_abbr": "GOA",
				"country": "India",
				"country_code": "IN"
			},
			"country": "India",
			"short_description": "Goa is an Indian state situated on the south-western coast. Maharashtra and Karnataka are the neighboring states to North and southeast respectively, with the Arabian Sea surrounding on its western side. The beauty of Goa is due to the beaches lying along the Arabian Sea and the Western Ghats covering them on the sides. The flora and fauna of Goa are diverse due to the climate and its belongingness to the sea. A large variety of water life exists here and gives life to the delicious seafood for the lover of them.\r\n\r\nGoa is perfect for a getaway to clean beaches, breezy wind, amazing food, and party vibes. Famous for its pristine beaches and lip-smacking seafood, Goa is also considered the party capital of India. Generally divided into two sides, North and South, North Goa is the place for you to party and South Goa is the place to just unwind and relax. Goa also has a rich heritage since it was an overseas holding for the Portuguese territory and hence you can see a lot of Portuguese settlements too. \r\n\r\nIt is the smallest state in India and has the highest GDP per capita among all other states. Panaji is the capital of Goa and Vasco Da Gama is its largest city. It is considered the richest state of India and therefore the development of the state is at its peak.",
			"is_active": true,
			"is_live": true,
			"image": "media/cities/158548001626422548294067382812.jpg",
			"most_popular_for": [
				"Adventure and Outdoors",
				"Nature and Retreat"
			],
			"extra_images": [
				"media/cities/162556898541237854957580566406.jpg",
				"media/cities/162556898553716158866882324219.jpg",
				"media/cities/162556898563314509391784667969.jpeg",
				"media/cities/162556898575286674499511718750.jpeg"
			],
			"bus_stops": {
				"City Point Name": "",
				"City Point Index": ""
			},
			"has_airport": true,
			"airport_codes": [
				"GOI"
			],
			"airport_distance": 32,
			"intracity_transport": "Taxi",
			"type": "City"
		}
	],
	"children": [],
	"image_credit": null,
	"is_verified": false,
	"meta_description": "",
	"social_share_title": "The Tarzan Way | Personalized Travel Experiences",
	"social_media_description": ""
}
const TravelPlanner = () => {

     return <Layout> 
      <Head>
      <title>{DATA.page_title}</title>
      <meta name="description" content={DATA.meta_description}></meta>
          <meta property="og:title" content={DATA.social_share_title}/>
          <meta property="og:description" content={DATA.social_media_description} />
          <meta property="og:image" content="/logoblack.svg" />
          <meta property='keywords' content={DATA.meta_keywords}></meta>
</Head><LadakhContainer experienceData={DATA}></LadakhContainer>
</Layout>
    
}

export default TravelPlanner