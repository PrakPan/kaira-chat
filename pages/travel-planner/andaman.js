import LadakhContainer from '../../containers/travelplanner/Index';
import Head from 'next/head';
import Layout from '../../components/Layout'

const DATA ={
	"page_type": "Destination",
	"destination": "Andaman",
	"page_title": "Andaman Trip Planner | India | The Tarzan Way",
	"id": 3,
	"link": "andaman",
	"banner_heading": "Andaman Trip Planner",
	"banner_text": null,
	"overview_heading": "Andaman Overview",
	"overview_text": "Andaman is a beautiful destination for travelers looking for a tropical paradise. It is an archipelago comprising of many islands located in the Bay of Bengal, off the eastern coast of India. Blessed with captivating beauty, it is an ideal place to relax and unwind. From pristine beaches to lush green forests, this place has something to offer to everyone. It's an ideal place to enjoy some beautiful sunsets and a great opportunity to explore the unique wildlife and marine life.\r\nThe crystal clear waters of Andaman are perfect for snorkeling and scuba diving, allowing tourists to explore the colorful coral reefs and beautiful underwater life. It offers many activities like sea walking, glass bottom boat rides, banana boat rides, and jet skiing. Andaman is also renowned for its heritage, culture, and history. It is home to many ancient monuments, caves, and forts. Tourists can also explore the tribal villages of Andaman, meet the local community, and learn about their culture and traditions.\r\nWhether you're looking for a relaxing beach holiday, a thrilling dive adventure, or an educational expedition, the Andaman Islands have something to offer for all types of travelers.",
	"image": "media/page/167463864604858756065368652344.jpg",
	"image_alt_text": "View of the Ross and Smith Island in Andaman & Nicobar Island",
	"itineraries": [],
	"itinerary_data": {},
	"locations": [
		{
			"id": 419,
			"name": "Havelock",
			"slug": "havelock",
			"tagline": "Jewel of Andaman",
			"nicknames": [
				"Havelock"
			],
			"lat": 11.9760503,
			"long": 92.9875565,
			"state": {
				"id": 11,
				"name": "Andaman And Nicobar Islands",
				"region": "Southeast India",
				"state_abbr": "ANI",
				"country": "India",
				"country_code": "IN"
			},
			"country": "India",
			"short_description": "Considered the jewel of India’s Andaman and Nicobar Islands, Havelock Island is a small strip of land wreathed by the clear waters of the Andaman Sea, resulting in miles and miles of uninterrupted shoreline, frequently populated by wandering elephants. Havelock is widely known for its pristine beaches, crystal clear waters, and the variety of water sports that it can offer to adventure junkies. Havelock Island is a popular spot for activities like scuba diving, snorkeling, hiking, island camping, kayaking, sailing, etc.\r\nNarrow roads compassed of either thick tropical jungles with unique trees or long strips of fields covered with the greenery of rice and paddies, combined with an abrupt jump of clear open waters on the side of the road make Havelock Island, one of the best places to explore with a rental bike.",
			"is_active": true,
			"is_live": true,
			"image": "media/cities/161477233223542022705078125000.jpg",
			"most_popular_for": [
				"Adventure and Outdoors",
				"Nature and Retreat",
				"Isolated",
				"Nightlife and Events",
				"Shopping"
			],
			"extra_images": [
				"media/cities/161477233281473708152770996094.jpg",
				"media/cities/161477233307552409172058105469.jpg",
				"media/cities/161477233335385251045227050781.jpg",
				"media/cities/161477233387444972991943359375.jpg"
			],
			"bus_stops": {
				"City Point Name": "",
				"City Point Index": ""
			},
			"has_airport": true,
			"airport_codes": [
				"IXZ"
			],
			"airport_distance": 46,
			"intracity_transport": "Taxi",
			"type": "Island"
		},
		{
			"id": 420,
			"name": "Neil Island",
			"slug": "neil_island",
			"tagline": "Shaheed Dweep",
			"nicknames": [
				"Neil Island"
			],
			"lat": 11.8329186,
			"long": 93.052612,
			"state": {
				"id": 11,
				"name": "Andaman And Nicobar Islands",
				"region": "Southeast India",
				"state_abbr": "ANI",
				"country": "India",
				"country_code": "IN"
			},
			"country": "India",
			"short_description": "Neil Island is one of the top picks of tourists for stays, adventures, getaways, and beach parties after Goa. This island has a minimum population with friendly locals to guide you to the best resorts, food, and farms for fresh veggies. Neil island has well fared with things to excite the tourists on their vacation such as glass boat rides, snorkeling in deep waters, scuba diving with aquatic species, and shore excursions. Enjoy the bliss of laying back in nature away from the rings and notifications on the shores of beautiful beaches.",
			"is_active": true,
			"is_live": true,
			"image": "media/cities/165667434017442631721496582031.jpeg",
			"most_popular_for": [
				"Romantic"
			],
			"extra_images": [
				"media/cities/165667434028355073928833007812.jpg",
				"media/cities/165667434034664106369018554688.jpg",
				"media/cities/165667434040810489654541015625.jpg",
				"media/cities/165667434052678251266479492188.jpg"
			],
			"bus_stops": {
				"City Point Name": "",
				"City Point Index": ""
			},
			"has_airport": true,
			"airport_codes": [
				"IXZ"
			],
			"airport_distance": 41,
			"intracity_transport": "Taxi",
			"type": "Island"
		},
		{
			"id": 418,
			"name": "Port Blair",
			"slug": "port_blair",
			"tagline": "Mini India",
			"nicknames": [
				"Port Blair"
			],
			"lat": 11.6233774,
			"long": 92.7264828,
			"state": {
				"id": 11,
				"name": "Andaman And Nicobar Islands",
				"region": "Southeast India",
				"state_abbr": "ANI",
				"country": "India",
				"country_code": "IN"
			},
			"country": "India",
			"short_description": "Port Blair is a popular tourist destination and is the gateway to many other beautiful islands like Havelock, Neil Island, and Ross. Port Blair itself has many places to expound the tourists, a trail to the city would take you to the freedom stories, British rule, World war remittances, and sacrifices of the great leaders. To entice on your vacay to the Island choose to spend time trekking to the national park, Walking along the Palm trees, and trying out the best water activities. Visit the Anthropological Museum to know about the tribes living in and around the Islands like Negrito, Jarawa's, Great Andamanese, Sentinelese, and Onges. Food lovers can try out some of the seafood and international cuisines with some delicious fare and live band soothing at the restaurants on MG road. The nightlife of this UT has a different way to explore the moonlight with the cocktail mix in coconut shells, and a drive on the bay along the water waves.",
			"is_active": true,
			"is_live": true,
			"image": "media/cities/165702066492575263977050781250.jpg",
			"most_popular_for": [
				"Adventure and Outdoors",
				"Nature and Retreat"
			],
			"extra_images": [
				"media/cities/165702066511837625503540039062.jpg",
				"media/cities/165702066520773577690124511719.jpg",
				"media/cities/165702066525719761848449707031.jpg",
				"media/cities/165702066534090495109558105469.jpg"
			],
			"bus_stops": {
				"City Point Name": "",
				"City Point Index": ""
			},
			"has_airport": true,
			"airport_codes": [
				"IXZ"
			],
			"airport_distance": 2,
			"intracity_transport": "Taxi",
			"type": "Island"
		}
	],
	"children": [],
	"image_credit": null,
	"is_verified": true,
	"meta_tags": null,
	"meta_description": "",
	"social_share_title": "Andaman Trip Planner | India | The Tarzan Way",
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