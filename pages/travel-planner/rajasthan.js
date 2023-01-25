import LadakhContainer from '../../containers/travelplanner/Index';
import Head from 'next/head';
import Layout from '../../components/Layout'

const DATA = {
	"page_type": "Destination",
	"destination": "Rajasthan",
	"page_title": "Rajasthan Trip Planner | India | The Tarzan Way",
	"id": 2,
	"link": "rajasthan",
	"banner_heading": "Rajasthan Trip Planner",
	"banner_text": null,
	"overview_heading": "Rajasthan Overview",
	"overview_text": "The Indian state of Rajasthan is popularly known to many as the Land of the Kings, is a beautiful example of India?s age-old opulence and grandeur, traces of which still linger in the air of this state. One of the most colourful and vibrant states in the country, with a strong blend of culture, history, music, cuisine falling in love with Rajasthan doesn't take much time. Rajasthan has more history than the entire country put together- it is the realm of erstwhile Maharajas and their lavish palaces and majestic forts. Golden-sand deserts, traditional handicrafts, authentic cuisine and awe-inspiring palaces all contribute to making Rajasthan an ideal vacation spot. Don't forget to wish everyone with \"Khamma Ghani\" while you're here!",
	"image": "media/cities/162425717606963467597961425781.jpg",
	"image_alt_text": null,
	"itineraries": [],
	"itinerary_data": {},
	"locations": [
		{
			"id": 5,
			"name": "Ajmer",
			"slug": "ajmer",
			"tagline": "City of Unity",
			"nicknames": [
				"Ajmer"
			],
			"lat": 26.4498954,
			"long": 74.6399163,
			"state": {
				"id": 3,
				"name": "Rajasthan",
				"region": "Western India",
				"state_abbr": "RJ",
				"country": "India",
				"country_code": "IN"
			},
			"country": "India",
			"short_description": "One of the oldest cities in India, Ajmer is famous for its beautiful architecture and religious significance. It has been a significant city both during the medieval and modern eras. \r\nSurrounded by the beautiful Aravalli ranges, the city boasts artificial lakes and a diverse heritage. Ajmer shows an exquisite blend of Rajputana and Mughal architecture, with impressive buildings and mosques. The city is selected as one of the heritage cities for the Government of India's HRIDAY and Smart City Mission schemes.",
			"is_active": true,
			"is_live": true,
			"image": "media/cities/161356932393205499649047851562.jpg",
			"most_popular_for": [
				"Spiritual",
				"Heritage"
			],
			"extra_images": [
				"media/cities/161356932487107086181640625000.jpg",
				"media/cities/161356932509763216972351074219.jpg",
				"media/cities/161356932545907354354858398438.jpg",
				"media/cities/161356932588542103767395019531.jfif"
			],
			"bus_stops": {
				"City Point Name": "",
				"City Point Index": ""
			},
			"has_airport": false,
			"airport_codes": [],
			"airport_distance": null,
			"intracity_transport": "Taxi",
			"type": "City"
		},
		{
			"id": 253,
			"name": "Bikaner",
			"slug": "bikaner",
			"tagline": "Camel Country",
			"nicknames": [
				"Bikaner"
			],
			"lat": 28.0229348,
			"long": 73.3119159,
			"state": {
				"id": 3,
				"name": "Rajasthan",
				"region": "Western India",
				"state_abbr": "RJ",
				"country": "India",
				"country_code": "IN"
			},
			"country": "India",
			"short_description": "Bikaner the fourth largest city in Rajasthan is a cultural heritage hosting many tourists every year for festivals, Fairs, and art exhibits. A tour of the \"camel country\"  is a trail to shrines, ancient forts, and wildlife. A day spent in the city will make you experience the traditions of Marwadis from temples to the livelihood of locals through sanctuaries and centers. Tourists must not miss out on the savories of Bikaner that are world famous- Bikaner Bhujiya, Geneva, Bhajre papad, etc with some mouth-melting desserts for a meal to end. The natives celebrate the camel festival honoring the ship of the desert in January, many foreign and local tourists flock to the city to witness Camel dances, Camel races, Neck shaking Camel rides.",
			"is_active": true,
			"is_live": true,
			"image": "media/cities/166567257024085116386413574219.jpg",
			"most_popular_for": [
				"Heritage",
				"Art and Culture"
			],
			"extra_images": [
				"media/cities/166567257057842302322387695312.jpg",
				"media/cities/166567257063346934318542480469.jpg",
				"media/cities/166567257069689822196960449219.jpg",
				"media/cities/166567257074584722518920898438.jpg"
			],
			"bus_stops": {
				"City Point Name": "",
				"City Point Index": ""
			},
			"has_airport": false,
			"airport_codes": [],
			"airport_distance": 247,
			"intracity_transport": "Taxi",
			"type": "City"
		},
		{
			"id": 164,
			"name": "Jaipur",
			"slug": "jaipur",
			"tagline": "Paris of India",
			"nicknames": [
				"Jaipur"
			],
			"lat": 26.9124336,
			"long": 75.7872709,
			"state": {
				"id": 3,
				"name": "Rajasthan",
				"region": "Western India",
				"state_abbr": "RJ",
				"country": "India",
				"country_code": "IN"
			},
			"country": "India",
			"short_description": "Jaipur is the capital city of the largest state of India. Known as the pink city, Jaipur is covered by mesmerizingly beautiful pink buildings that bring out the glory of the past. Named after the founder of the city, Maharaja Sawai Jai Singh II, Jaipur is one of the oldest planned cities of India. It was founded in 1727 and it took four years to finish the foundation of the city. Jaipur has now been classified as one of the World Heritage Sites by UNESCO. It is famous for the majestic palaces and forts and the for portraying the beautiful culture of Rajasthan. Jaipur boasts of being the part of the Golden Triangle of India, along with the popular tourist destination of Delhi and Agra",
			"is_active": true,
			"is_live": true,
			"image": "media/cities/166695853772606897354125976562.jpeg",
			"most_popular_for": [
				"Heritage"
			],
			"extra_images": [
				"media/cities/161171829474223637580871582031.jpg",
				"media/cities/166695853792755174636840820312.jpeg",
				"media/cities/166695862816701507568359375000.jpeg",
				"media/cities/161171829575363087654113769531.jpg"
			],
			"bus_stops": {
				"City Point Name": "",
				"City Point Index": ""
			},
			"has_airport": true,
			"airport_codes": [
				"JAI"
			],
			"airport_distance": 10,
			"intracity_transport": "Taxi",
			"type": "City"
		},
		{
			"id": 293,
			"name": "Jaisalmer",
			"slug": "jaisalmer",
			"tagline": "Golden",
			"nicknames": [
				"Jaisalmer"
			],
			"lat": 26.9157487,
			"long": 70.9083443,
			"state": {
				"id": 3,
				"name": "Rajasthan",
				"region": "Western India",
				"state_abbr": "RJ",
				"country": "India",
				"country_code": "IN"
			},
			"country": "India",
			"short_description": "Jaisalmer, the golden city, is located in the heart of the Thar. Desert of Rajasthan. The Jaisalmer fort, also known as the Sonar Qila, is one of the first living forts in India, with dwelling human settlements. The place is adorned with many tourist spots, folk music centers, and delicious cuisines. The place is also home to the Ghost village of Kuldhara, which holds a legacy to the Paliwal Brahmins. The place is also home to the Indian army's war memorial, which holds legacies of the soldiers who sacrificed their lives to protect our mother nation. Several adventure sports such as quad biking and paragliding are also common here. The place is one of a kind and refuses to leave anyone unsatisfied.",
			"is_active": true,
			"is_live": true,
			"image": "media/cities/162428369233103537559509277344.jpg",
			"most_popular_for": [
				"Heritage",
				"Shopping"
			],
			"extra_images": [
				"media/cities/162428369253031134605407714844.jpg",
				"media/cities/162428369267189335823059082031.jpg",
				"media/cities/162428369280575037002563476562.jpg",
				"media/cities/162428369297294616699218750000.jpg"
			],
			"bus_stops": {
				"City Point Name": "",
				"City Point Index": ""
			},
			"has_airport": false,
			"airport_codes": [],
			"airport_distance": null,
			"intracity_transport": "Taxi",
			"type": "City"
		},
		{
			"id": 298,
			"name": "Jodhpur",
			"slug": "jodhpur",
			"tagline": "Royal Entrance",
			"nicknames": [
				"Jodhpur"
			],
			"lat": 26.2389469,
			"long": 73.02430939999999,
			"state": {
				"id": 3,
				"name": "Rajasthan",
				"region": "Western India",
				"state_abbr": "RJ",
				"country": "India",
				"country_code": "IN"
			},
			"country": "India",
			"short_description": "Jodhpur is the second-largest city in Rajasthan. It is popularly known as the Blue City, because of the unique paint the houses here are colored in. To its north and northwestern regions lies the Thar Desert. The history of the city dates back to 1459 AD. Rao Jodha, the erstwhile ruler of the Rathore Clan is credited for the origin of this magnificent town. Jodhpur is famous for its grandeur infrastructures, authentic Rajasthani cuisine served in numerous restaurants, old town busy life, and the insurmountable number of views it possesses particularly the breathtaking landscape views from the grand Mehrangarh Fort.",
			"is_active": true,
			"is_live": true,
			"image": "media/cities/166370591731420063972473144531.webp",
			"most_popular_for": [
				"Heritage",
				"Shopping",
				"Travel and Learn"
			],
			"extra_images": [
				"media/cities/161010845391653680801391601562.webp",
				"media/cities/161010845418450641632080078125.webp"
			],
			"bus_stops": {
				"City Point Name": "",
				"City Point Index": ""
			},
			"has_airport": true,
			"airport_codes": [
				"JDH"
			],
			"airport_distance": 2,
			"intracity_transport": "Taxi",
			"type": "City"
		},
		{
			"id": 338,
			"name": "Mount Abu",
			"slug": "mount_abu",
			"tagline": "Oasis in desert",
			"nicknames": [
				"Mount Abu"
			],
			"lat": 24.5925909,
			"long": 72.7156274,
			"state": {
				"id": 3,
				"name": "Rajasthan",
				"region": "Western India",
				"state_abbr": "RJ",
				"country": "India",
				"country_code": "IN"
			},
			"country": "India",
			"short_description": "The only hill station of the desert state of Rajasthan, Mount Abu is often called as the Shimla of Rajasthan. Mount Abu is famous for its scenic beauty and lush green forests.",
			"is_active": true,
			"is_live": true,
			"image": "media/cities/162393230159177684783935546875.jpeg",
			"most_popular_for": [
				"Adventure and Outdoors",
				"Spiritual",
				"Nature and Retreat"
			],
			"extra_images": [
				"media/cities/162393230181332731246948242188.jpeg",
				"media/cities/162393230192227005958557128906.jpeg",
				"media/cities/162393230202135396003723144531.jpeg",
				"media/cities/162393230212287473678588867188.jpg"
			],
			"bus_stops": {
				"City Point Name": "",
				"City Point Index": ""
			},
			"has_airport": false,
			"airport_codes": [],
			"airport_distance": null,
			"intracity_transport": "Taxi",
			"type": "City"
		},
		{
			"id": 183,
			"name": "Pushkar",
			"slug": "pushkar",
			"tagline": "Rose Garden",
			"nicknames": [
				"Pushkar"
			],
			"lat": 26.4885822,
			"long": 74.5509422,
			"state": {
				"id": 3,
				"name": "Rajasthan",
				"region": "Western India",
				"state_abbr": "RJ",
				"country": "India",
				"country_code": "IN"
			},
			"country": "India",
			"short_description": "The holy city that lies tucked away in the Aravallis, Pushkar resembles a coming together of culture, religion, and daily life. Known for hosting the famous Brahma temple, Pushkar attracts millions of tourists all over the world. Adorned with Ghats and, temples that boast of Rajput and Tamil architecture, the city has some other attractions too that tell the story of its rich past. Lying in the center of the town is the Pushkar Sarovar where pilgrims flock to take a holy dip while the outskirts flaunt the deserts and the rural villages presenting a unique scenario of the city. Life is as busy as ever and locals never forget to have some poha or kachori and jalebi before going to work or buying some malpuas on their way back home. There is another side to Pushkar which speaks of a thriving hippie culture, evident in the falafel shops that have come across the city. There is also the Pushkar Annual Camel Fair, a one-of-a-kind amalgamation of life and culture in Rajasthan that remains as the highlight. A must-visit place, Pushkar is truly the gem of the Rajasthan.",
			"is_active": true,
			"is_live": true,
			"image": "media/cities/158512954269407153129577636719.jpg",
			"most_popular_for": [
				"Spiritual"
			],
			"extra_images": [
				"media/cities/162425717566178369522094726562.jpg",
				"media/cities/162425717583579087257385253906.jpg",
				"media/cities/162425717595090889930725097656.jpg",
				"media/cities/162425717606963467597961425781.jpg"
			],
			"bus_stops": {
				"City Point Name": "",
				"City Point Index": ""
			},
			"has_airport": false,
			"airport_codes": [],
			"airport_distance": null,
			"intracity_transport": "Taxi",
			"type": "City"
		}
	],
	"children": [],
	"image_credit": null,
	"is_verified": false,
	"meta_tags": null,
	"meta_description": "",
	"social_share_title": "Rajasthan Trip Planner | India | The Tarzan Way",
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