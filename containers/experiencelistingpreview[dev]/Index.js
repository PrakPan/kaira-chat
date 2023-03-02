import React, {useState, useRef, useEffect, createRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Footer from '../../components/footer/Index';
import styled from 'styled-components';
import FullImage from '../../components/FullImage';
import media from '../../components/media';;
import FullImgContent from './FullImgContent';
import axioslistinginstance from '../../services/website-customization/listing';
import Details from './Details';
import Transition from 'react-transition-group/Transition';
import Loading from '../../components/LoadingPage';

const  Listings = (props) =>{
  let isPageWide = media('(min-width: 768px)')

    const [listingData, setListingData] = useState();
    const [loaded, setLoaded] = useState();

  useEffect(() => {
    window.scrollTo(0,0);

    // window.addEventListener('scroll', event => handleScroll(event));

    axioslistinginstance
      .get(
        `/`
      )
      .then((res) => {

        setListingData({
          ...listingData,
          data: res.data,
        });
        setLoaded(true);
         
        window.scrollTo(0, 0);

      })
      .catch((error) => {
        alert('Page could not be loaded. Please try again.');
      });
   
  },[]);

  
  const [showPersonaliseModal, setShowPersonaliseModal] = useState(false);
  const handlePersonaliseClose = () => setShowPersonaliseModal(false);
  const handlePersonaliseShow = () => { setShowPersonaliseModal(true); }

  const SetWidthContainer = styled.div`
    width: 100%;
    margin: auto;
    @media screen and (min-width: 768px){
      width: 80%;
    }
  `;
const ContentContainer = styled.div`
@media screen and (min-width: 768px){
  margin-top: 5rem;
}
`;
  
  const data = [
    [
        {
          "id": 5,
          "name": "Try out this December",
          "page": "City Guide",
          "priority_order": 1,
          "experiences": [
            {
                "id": "odDvndpxQzYmOq5C",
                "name": "Offbeat Goa",
                "slug": "offbeat-goa",
                "images": [
                  "media/experiences/162668216081343507766723632812.jpeg"
                ],
                "rating": 4.7,
                "experience_region": "Goa",
                "duration": "4 days",
                "categories": {
                  "theme_category": "Adventure",
                  "duration_based_category": null,
                  "budget_based_category": null,
                  "group_type_category": null
                },
                "short_text": "During these four days, the offbeat Goa vacation will help relieve all your anxiety and tension, as you will spend some time segregated from the crowd and touristy places of Goa's party life.",
                "starting_price": 600000,
                "experience_filters": [
                  "Adventure and Outdoors",
                  "Nature and Retreat",
                  "Isolated",
                  "Heritage"
                ]
              },
              {
                "id": "odDvndpxQzYmOq5C",
                "name": "Offbeat Goa",
                "slug": "offbeat-goa",
                "images": [
                  "media/experiences/162668216081343507766723632812.jpeg"
                ],
                "rating": 4.7,
                "experience_region": "Goa",
                "duration": "4 days",
                "categories": {
                  "theme_category": "Adventure",
                  "duration_based_category": null,
                  "budget_based_category": null,
                  "group_type_category": null
                },
                "short_text": "During these four days, the offbeat Goa vacation will help relieve all your anxiety and tension, as you will spend some time segregated from the crowd and touristy places of Goa's party life.",
                "starting_price": 600000,
                "experience_filters": [
                  "Adventure and Outdoors",
                  "Nature and Retreat",
                  "Isolated",
                  "Heritage"
                ]
              },
            {
              "id": "odDvndpxQzYmOq5C",
              "name": "Offbeat Goa",
              "slug": "offbeat-goa",
              "images": [
                "media/experiences/162668216081343507766723632812.jpeg"
              ],
              "rating": 4.7,
              "experience_region": "Goa",
              "duration": "4 days",
              "categories": {
                "theme_category": "Adventure",
                "duration_based_category": null,
                "budget_based_category": null,
                "group_type_category": null
              },
              "short_text": "During these four days, the offbeat Goa vacation will help relieve all your anxiety and tension, as you will spend some time segregated from the crowd and touristy places of Goa's party life.",
              "starting_price": 600000,
              "experience_filters": [
                "Adventure and Outdoors",
                "Nature and Retreat",
                "Isolated",
                "Heritage"
              ]
            },
            {
              "id": "ENcO6m0OidRG6hgu",
              "name": "Rishikesh Offbeat Experience",
              "slug": "rishikesh-offbeat-experience",
              "images": [
                "media/experiences/162419039424955773353576660156.jpeg"
              ],
              "rating": 4.8,
              "experience_region": "Uttarakhand",
              "duration": "2 nights",
              "categories": {
                "theme_category": null,
                "duration_based_category": null,
                "budget_based_category": null,
                "group_type_category": null
              },
              "short_text": "Take a halt from the rush and motion of the cities and take a relaxing trip to the Yoga Capital of the World.",
              "starting_price": 250000,
              "experience_filters": [
                "Adventure and Outdoors",
                "Spiritual",
                "Nature and Retreat",
                "Isolated",
                "Shopping"
              ]
            },
            {
              "id": "nvL5bBaPijoycZJh",
              "name": "Manali Trance",
              "slug": "manali-trance",
              "images": [
                "media/experiences/162339664600439214706420898438.jpg"
              ],
              "rating": 4.8,
              "experience_region": "Manali",
              "duration": "3 nights",
              "categories": {
                "theme_category": null,
                "duration_based_category": null,
                "budget_based_category": null,
                "group_type_category": null
              },
              "short_text": "Renounce yourself in the abyss and experience trance. Manali will either give you existential crises or put a rest on them!",
              "starting_price": 600000,
              "experience_filters": [
                "Adventure and Outdoors",
                "Spiritual",
                "Nature and Retreat",
                "Isolated",
                "Heritage"
              ]
            }
          ],
          "reviews": [],
          "blogs": [
            {
              "id": "d677b219-1489-4f6f-9ae0-e58c3d2c92ce",
              "image": null,
              "is_active": true,
              "created_at": "2021-07-26 15:29:11",
              "modified_at": "2021-07-26 15:29:11",
              "is_adventure_and_outdoors": false,
              "is_spiritual": false,
              "is_nature_and_retreat": false,
              "is_isolated": false,
              "is_heritage": false,
              "is_nightlife": false,
              "is_shopping": false,
              "is_art_and_culture": false,
              "is_science_and_knowledge": false,
              "is_romantic": false,
              "name": "JIM CORBETT NATIONAL PARK – A WALK THROUGH THE WILDERNESS",
              "cities": null,
              "tags": [
                "Jim Corbett"
              ],
              "link": "https://www.thetarzanway.com/post/jim-corbett-national-park",
              "short_text": null,
              "author": null
            },
            {
              "id": "224c0b77-8b3a-4905-9385-026a4a757913",
              "image": null,
              "is_active": true,
              "created_at": "2021-07-26 15:29:11",
              "modified_at": "2021-07-26 15:29:11",
              "is_adventure_and_outdoors": false,
              "is_spiritual": false,
              "is_nature_and_retreat": false,
              "is_isolated": false,
              "is_heritage": false,
              "is_nightlife": false,
              "is_shopping": false,
              "is_art_and_culture": false,
              "is_science_and_knowledge": false,
              "is_romantic": false,
              "name": "5 Awesome Places to visit in Kasol",
              "cities": null,
              "tags": [
                "Kasol"
              ],
              "link": "https://www.thetarzanway.com/post/5-awesome-places-to-visit-in-kasol",
              "short_text": null,
              "author": null
            },
            {
              "id": "e4719318-425b-41f6-86af-3641927b87c7",
              "image": null,
              "is_active": true,
              "created_at": "2021-07-26 15:29:11",
              "modified_at": "2021-07-26 15:29:11",
              "is_adventure_and_outdoors": false,
              "is_spiritual": false,
              "is_nature_and_retreat": false,
              "is_isolated": false,
              "is_heritage": false,
              "is_nightlife": false,
              "is_shopping": false,
              "is_art_and_culture": false,
              "is_science_and_knowledge": false,
              "is_romantic": false,
              "name": "10 WATER SPORTS IN GOA, YOU SHOULD TRY BEFORE TURNING 30.",
              "cities": null,
              "tags": [
                "Goa"
              ],
              "link": "https://www.thetarzanway.com/post/10-water-sports-in-goa",
              "short_text": null,
              "author": null
            }
          ],
          "cities": [
            {
              "id": 277,
              "name": "Goa",
              "slug": "goa",
              "tagline": "Beach Capital",
              "nickname": "Goa",
              "lat": 15.2993,
              "long": 74.124,
              "state": {
                "id": 17,
                "name": "Goa",
                "region": "Western India"
              },
              "short_description": "Goa is an Indian state situated on the south-western coast. Maharashtra and Karnataka are the neighboring states to North and southeast respectively, with the Arabian Sea surrounding on its western side. The beauty of Goa is due to the beaches lying along the Arabian Sea and the Western Ghats covering them on the sides. The flora and fauna of Goa are diverse due to the climate and its belongingness to the sea. A large variety of water life exists here and gives life to the delicious seafood for the lover of them.\r\n\r\nGoa is perfect for a getaway to clean beaches, breezy wind, amazing food, and party vibes. Famous for its pristine beaches and lip-smacking seafood, Goa is also considered the party capital of India. Generally divided into two sides, North and South, North Goa is the place for you to party and South Goa is the place to just unwind and relax. Goa also has a rich heritage since it was an overseas holding for the Portuguese territory and hence you can see a lot of Portuguese settlements too. \r\n\r\nIt is the smallest state in India and has the highest GDP per capita among all other states. Panaji is the capital of Goa and Vasco Da Gama is its largest city. It is considered the richest state of India and therefore the development of the state is at its peak.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/158548001626422548294067382812.jpg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Nature and Retreat"
              ]
            },
            {
              "id": 278,
              "name": "Andaman and Nicobar Islands",
              "slug": "andaman_and_nicobar_islands",
              "tagline": "Romantic Paradise",
              "nickname": "Andaman",
              "lat": 11.7401,
              "long": 92.6586,
              "state": {
                "id": 11,
                "name": "Andaman And Nicobar Islands",
                "region": "Southeast India"
              },
              "short_description": "A heavenly abode in all aspects, Andaman boasts of nature and serenity amongst the natural habitats. Andaman is a location which is at a peaceful location with serenity in the environment.\r\nThe group of islands are so stunning that they leave everyone speechless. There islands have various activities which you can indulge in to explore various locations as well as to experiment with new activities.\r\nThat ranges from adrenaline activities to nature trails, underwater diving to bird watching, and from historical locations to energetic night activities.\r\nAndaman is a combination of all these activities and much more, which can only be uncovered as the waves take us.\r\nAndaman is a location which is a perfect getaway with a whole bunch of activities to choose from.\r\nIt's unique natural treasure of beaches, forests, marine life, corals and birds makes it a favorite among nature lovers who want to explore nature.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/163527923662664651870727539062.jpeg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Nature and Retreat",
                "Isolated",
                "Heritage"
              ]
            },
            {
              "id": 269,
              "name": "Shimla",
              "slug": "shimla",
              "tagline": "Picture perfect",
              "nickname": "Shimla",
              "lat": 31.1048,
              "long": 77.1734,
              "state": {
                "id": 4,
                "name": "Himachal Pradesh",
                "region": "North India"
              },
              "short_description": "Shimla is the capital and administrative headquarters of the North Indian state of Himachal Pradesh, in the Himalayan foothills called Shiwaliks. Once known as the summer capital of British India, it remains the terminus of the narrow-gauge Kalka-Shimla Railway, completed in 1903. It’s also recognized for the handicraft shops that line The Mall Road, as well as the Lakkar Bazaar, a market peculiar for wooden toys, and crafts. It's one of the most popular holiday destinations in India and is known for its aesthetic and picturesque beauty.\r\n\r\nShimla gets its name from Shyamala Devi who was believed to be an incarnation of Goddess Kali. Shimla is known for its bright and colorful markets. It's densely covered in Pine, Deodar, and Oak forests, which present the tourists with very stunning and panoramic views. The high tourist footfall to Shimla is mostly due to its amazing weather and really easy accessibilty from major cities of North India.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/159009922008175086975097656250.jpg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Nature and Retreat",
                "Shopping"
              ]
            },
            {
              "id": 293,
              "name": "Jaisalmer",
              "slug": "jaisalmer",
              "tagline": "Golden",
              "nickname": "Jaisalmer",
              "lat": 26.9157,
              "long": 70.9083,
              "state": {
                "id": 3,
                "name": "Rajasthan",
                "region": "Western India"
              },
              "short_description": "Jaisalmer, the golden city, is located in the heart of the Thar. Desert of Rajasthan. The Jaisalmer fort, also known as the Sonar Qila, is one of the first living forts in India, with dwelling human settlements. The place is adorned with many tourist spots, folk music centers, and delicious cuisines. The place is also home to the Ghost village of Kuldhara, which holds a legacy to the Paliwal Brahmins. The place is also home to the Indian army's war memorial, which holds legacies of the soldiers who sacrificed their lives to protect our mother nation. Several adventure sports such as quad biking and paragliding are also common here. The place is one of a kind and refuses to leave anyone unsatisfied.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/162428369233103537559509277344.jpg",
              "most_popular_for": [
                "Heritage",
                "Shopping"
              ]
            },
            {
              "id": 331,
              "name": "Jim Corbett National Park",
              "slug": "jim_corbett_national_park",
              "tagline": "Tiger capital",
              "nickname": "Jim Corbett",
              "lat": 29.53019,
              "long": 78.77465,
              "state": {
                "id": 2,
                "name": "Uttarakhand",
                "region": "North India"
              },
              "short_description": "The Jim Corbett National Park, located in the Nainital district and Pauri Garhwal district of Uttarakhand is the oldest national park in India. It was established in 1936 as Hailey National Park to protect the endangered Bengal tiger and was named after hunter and naturalist Jim Corbett. Spread over an area of 521 sq. km, The park contains 488 different species of flora, a wide variety of wildlife, and around 600 different species of bird. Corbett National Park is one of the valuable pearls of Indian timberlands that welcomes everybody to encounter the mesmerizing landscapes and the astonishments hidden inside. The transparent greenery, thriving plants, wildlife, and birdlife, and presence of two streams, Kosi and Ramganga make Jim Corbett a jewel of a spot to explore. The park is a hub for adventure buffs, bird watchers, and wildlife lovers. Uncover the numerous delightful and hidden secrets of this forest land.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/161760809417842102050781250000.jpg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Spiritual",
                "Nature and Retreat",
                "Isolated",
                "Heritage"
              ]
            },
            {
              "id": 338,
              "name": "Mount Abu",
              "slug": "mount_abu",
              "tagline": "Oasis in desert",
              "nickname": "Mount Abu",
              "lat": 24.5926,
              "long": 72.7156,
              "state": {
                "id": 3,
                "name": "Rajasthan",
                "region": "Western India"
              },
              "short_description": "The only hill station of the desert state of Rajasthan, Mount Abu is often called as the Shimla of Rajasthan. Mount Abu is famous for its scenic beauty and lush green forests.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/162393230159177684783935546875.jpeg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Spiritual",
                "Nature and Retreat"
              ]
            }
          ]
        },
        {
          "id": 1,
          "name": "Revive your romance(or start it)",
          "page": "City Guide",
          "priority_order": 2,
          "experiences": [],
          "reviews": [],
          "blogs": [],
          "cities": [
            {
              "id": 278,
              "name": "Andaman and Nicobar Islands",
              "slug": "andaman_and_nicobar_islands",
              "tagline": "Romantic Paradise",
              "nickname": "Andaman",
              "lat": 11.7401,
              "long": 92.6586,
              "state": {
                "id": 11,
                "name": "Andaman And Nicobar Islands",
                "region": "Southeast India"
              },
              "short_description": "A heavenly abode in all aspects, Andaman boasts of nature and serenity amongst the natural habitats. Andaman is a location which is at a peaceful location with serenity in the environment.\r\nThe group of islands are so stunning that they leave everyone speechless. There islands have various activities which you can indulge in to explore various locations as well as to experiment with new activities.\r\nThat ranges from adrenaline activities to nature trails, underwater diving to bird watching, and from historical locations to energetic night activities.\r\nAndaman is a combination of all these activities and much more, which can only be uncovered as the waves take us.\r\nAndaman is a location which is a perfect getaway with a whole bunch of activities to choose from.\r\nIt's unique natural treasure of beaches, forests, marine life, corals and birds makes it a favorite among nature lovers who want to explore nature.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/163527923662664651870727539062.jpeg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Nature and Retreat",
                "Isolated",
                "Heritage"
              ]
            },
            {
              "id": 277,
              "name": "Goa",
              "slug": "goa",
              "tagline": "Beach Capital",
              "nickname": "Goa",
              "lat": 15.2993,
              "long": 74.124,
              "state": {
                "id": 17,
                "name": "Goa",
                "region": "Western India"
              },
              "short_description": "Goa is an Indian state situated on the south-western coast. Maharashtra and Karnataka are the neighboring states to North and southeast respectively, with the Arabian Sea surrounding on its western side. The beauty of Goa is due to the beaches lying along the Arabian Sea and the Western Ghats covering them on the sides. The flora and fauna of Goa are diverse due to the climate and its belongingness to the sea. A large variety of water life exists here and gives life to the delicious seafood for the lover of them.\r\n\r\nGoa is perfect for a getaway to clean beaches, breezy wind, amazing food, and party vibes. Famous for its pristine beaches and lip-smacking seafood, Goa is also considered the party capital of India. Generally divided into two sides, North and South, North Goa is the place for you to party and South Goa is the place to just unwind and relax. Goa also has a rich heritage since it was an overseas holding for the Portuguese territory and hence you can see a lot of Portuguese settlements too. \r\n\r\nIt is the smallest state in India and has the highest GDP per capita among all other states. Panaji is the capital of Goa and Vasco Da Gama is its largest city. It is considered the richest state of India and therefore the development of the state is at its peak.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/158548001626422548294067382812.jpg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Nature and Retreat"
              ]
            },
            {
              "id": 121,
              "name": "Udaipur",
              "slug": "udaipur",
              "tagline": "White city",
              "nickname": "Udaipur",
              "lat": 24.585413,
              "long": 73.711371,
              "state": {
                "id": 3,
                "name": "Rajasthan",
                "region": "Western India"
              },
              "short_description": "Founded in the 1550s by Udai Singh II, Udaipur is popularly known as the 'City of Lakes' for the great number of lakes it houses. The city is located in the southern parts of Rajasthan, surrounded by the Aravalli hills range. The city boasts of being one of the most romantic destinations in Asia, also known for its rich history, culture, museums, galleries, the gigantic forts it houses, and most importantly, the scenic locations. It has drawn the attention of travelers and artists worldwide, being shot in several Indian and Hollywood movies. The city experiences moderate to high temperature during summer and mildly chill in the winter months. The city possesses rich and vibrant cultural practices and has an energetic zing tagged with its people and streets.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/162227416908536243438720703125.jpg",
              "most_popular_for": [
                "Nature and Retreat",
                "Heritage",
                "Travel and Learn"
              ]
            },
            {
              "id": 13,
              "name": "Manali",
              "slug": "manali",
              "tagline": "The Noble",
              "nickname": "Manali",
              "lat": 32.2432,
              "long": 77.1892,
              "state": {
                "id": 4,
                "name": "Himachal Pradesh",
                "region": "North India"
              },
              "short_description": "Manali is a very popular hill station and tourist attraction located in Kullu Valley in Himachal Pradesh.\r\nManali is often referred to as a gift of the Himalayas to the world. It is one of the most popular destinations for backpacking and couple honeymoons. From skiing in Solang Valley to trekking in Parvati Valley, visitors can undertake a bunch of recreational and adventure activities, that make Manali one of the most thrilling tourist attractions of India. For snow lovers, it's completely snow-capped throughout December and January which makes the place very romantic and aesthetic.\r\n\r\nManali is one of the most popular tourist attractions of India and Himachal Pradesh. With all of its mesmerizing destinations and thrilling adventure activities, Manali will surely climb the list of one of your best vacations ever. There are a huge number of places to visit and for a variety of reasons. There are temples for spiritual people, treks and trails for nature lovers, art museums, skiing, and other sporting activities for thrill-seekers",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/160960646853482961654663085938.jpg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Nature and Retreat"
              ]
            },
            {
              "id": 293,
              "name": "Jaisalmer",
              "slug": "jaisalmer",
              "tagline": "Golden",
              "nickname": "Jaisalmer",
              "lat": 26.9157,
              "long": 70.9083,
              "state": {
                "id": 3,
                "name": "Rajasthan",
                "region": "Western India"
              },
              "short_description": "Jaisalmer, the golden city, is located in the heart of the Thar. Desert of Rajasthan. The Jaisalmer fort, also known as the Sonar Qila, is one of the first living forts in India, with dwelling human settlements. The place is adorned with many tourist spots, folk music centers, and delicious cuisines. The place is also home to the Ghost village of Kuldhara, which holds a legacy to the Paliwal Brahmins. The place is also home to the Indian army's war memorial, which holds legacies of the soldiers who sacrificed their lives to protect our mother nation. Several adventure sports such as quad biking and paragliding are also common here. The place is one of a kind and refuses to leave anyone unsatisfied.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/162428369233103537559509277344.jpg",
              "most_popular_for": [
                "Heritage",
                "Shopping"
              ]
            },
            {
              "id": 8,
              "name": "Ooty",
              "slug": "ooty",
              "tagline": "Queen of Hills",
              "nickname": "Ooty",
              "lat": 11.4102,
              "long": 76.695,
              "state": {
                "id": 5,
                "name": "Tamil Nadu",
                "region": "South India"
              },
              "short_description": "Udagamandalam also known as Ooty or Ootacamund is a breathtaking town situated in Nilgiri Hills. The town is a famous tourist place because of the picturesque beauty and amazing activities that it provides. The place is full of magical gifts that nature has given to the town, beautiful lakes, forests, and greenery surround the whole town. The ethereal vast meadows that Ooty provides have been a perfect location for film shooting for directors, one of the famous movies \"Kuch Kuch Hota hai\" was shot here in this beautiful place. Because of its vast landscape, Ooty also gives us the amazing opportunity to try out some rare sports that can be only seen on television like, hang gliding, Golf, of course how one can miss the opportunity to play golf in this beautiful town? Moving onto the glory of this town that is farming. The town produces “English vegetables and fruits” which are basically peaches, plums, strawberries, cabbage, and cauliflower, etc. not to forget the infamous Tea farming of the town. Concluding all of it, the magical town of joy awaits your presence.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/162100053097655916213989257812.jpg",
              "most_popular_for": [
                "Nature and Retreat"
              ]
            }
          ]
        },
        {
          "id": 2,
          "name": "To get that Adrenaline rush",
          "page": "City Guide",
          "priority_order": 3,
          "experiences": [
            {
              "id": "mxD84w8eMPm9Rj9g",
              "name": "An offbeat trail in Parvati Valley",
              "slug": "an-offbeat-trail-in-parvati-valley",
              "images": [
                "media/experiences/162391870183287906646728515625.jpg"
              ],
              "rating": 4.9,
              "experience_region": "Kasol",
              "duration": "4 days",
              "categories": {
                "theme_category": null,
                "duration_based_category": null,
                "budget_based_category": null,
                "group_type_category": null
              },
              "short_text": "This time it's not Kasol that we are suggesting but an offbeat experience in the Parvati Valley en route to Shilha, Pulga, and Tosh.",
              "starting_price": 400000,
              "experience_filters": [
                "Adventure and Outdoors",
                "Nature and Retreat",
                "Isolated"
              ]
            },
            {
              "id": "KlGydBElUh3m3ZlX",
              "name": "Jibhi - Thirthan Adventure",
              "slug": "jibhi---thirthan-adventure",
              "images": [
                "media/experiences/162376375297298502922058105469.jpg"
              ],
              "rating": 5.0,
              "experience_region": "Himachal Pradesh",
              "duration": "4 nights",
              "categories": {
                "theme_category": null,
                "duration_based_category": null,
                "budget_based_category": null,
                "group_type_category": null
              },
              "short_text": "Take a lapse from the predatory world, and gift yourself a vacation to reinvigorate your heart and soul.",
              "starting_price": 600000,
              "experience_filters": [
                "Adventure and Outdoors",
                "Nature and Retreat",
                "Isolated"
              ]
            },
            {
              "id": "uSKyRT7Q9RMr3OTV",
              "name": "Malana - Waichan adventure",
              "slug": "malana---waichan-adventure",
              "images": [
                "media/experiences/162661698124656176567077636719.jpg"
              ],
              "rating": null,
              "experience_region": "Himachal Pradesh",
              "duration": "3 nights",
              "categories": {
                "theme_category": null,
                "duration_based_category": null,
                "budget_based_category": null,
                "group_type_category": null
              },
              "short_text": "Visit the unique and mysterious village of Malana, and make your way up to the Magic Valley.",
              "starting_price": 400000,
              "experience_filters": [
                "Adventure and Outdoors",
                "Nature and Retreat",
                "Isolated",
                "Shopping"
              ]
            }
          ],
          "reviews": [],
          "blogs": [],
          "cities": [
            {
              "id": 144,
              "name": "Kasol",
              "slug": "kasol",
              "tagline": "The Hippy",
              "nickname": "Kasol",
              "lat": 32.01,
              "long": 77.31,
              "state": {
                "id": 4,
                "name": "Himachal Pradesh",
                "region": "North India"
              },
              "short_description": "Kasol is a hamlet in the district of Kullu, situated in the Parvati valley. The place is a paradise for travelers and explorers. It is also known as Mini Israel of India, due to the large number of Israeli tourists visiting here. The place acts as a base camp for several treks, thus serving as a hotspot for backpackers and trekkers. Kasol music festival takes place every year on New years eve, this event attracts a large number of tourists here. The place has a pleasant climate making it an ideal destination all around the year. The place also offers amazing views of nature and the Himalayas. The place can be classified as an escape from the hustle-bustle of city life.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/162653335312065196037292480469.jpg",
              "most_popular_for": [
                "Adventure and Outdoors"
              ]
            },
            {
              "id": 93,
              "name": "Rishikesh",
              "slug": "rishikesh",
              "tagline": "Yoga Capital",
              "nickname": "Rishikesh",
              "lat": 30.0869,
              "long": 78.2676,
              "state": {
                "id": 2,
                "name": "Uttarakhand",
                "region": "North India"
              },
              "short_description": "Located in the foothills of the Himalayas along the convergence of Ganga and Chandrabhaga River, Rishikesh is a small town in the Dehradun district, located close to Haridwar in Uttarakhand. Rishikesh (also called as Hrishikesh) is known for its adventure activities, ancient temples, popular cafes and as the \"Yoga Capital of the World\". Gateway to Garhwal Himalayas, Rishikesh is also a pilgrimage town and one of the holiest places for Hindus.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/160956220045094466209411621094.jpg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Spiritual",
                "Nature and Retreat",
                "Travel and Learn",
                "Social Tourism",
                "Shopping"
              ]
            },
            {
              "id": 177,
              "name": "Bir Billing",
              "slug": "bir_billing",
              "tagline": "Adventure capital",
              "nickname": "Bir",
              "lat": 32.04572,
              "long": 76.72378,
              "state": {
                "id": 4,
                "name": "Himachal Pradesh",
                "region": "North India"
              },
              "short_description": "Bir is a small village in Himachal Pradesh, well-known for adventure activities like paragliding. Billing is the takeoff site for paragliding and, Bir is the landing site; collectively, it is called \"Bir Billing\". This village is home to several Buddhist monasteries like the Palpung Monastery and Tsering Jong Monastery, with stunning architecture. There are several cafes in Bir where you can relax with a book. The excellent food and beautiful view of the countryside make these cafes an ideal place to unwind. The toy train running from Joginder Nagar to Pathankot is a 160km ride, offering picturesque views. People also check out the local souvenir shops for handmade woollens and handicrafts to take back home. Next to Bir bus station is a tea factory that offers tours of the tea gardens to the visitors.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/163005607325070333480834960938.jpeg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Nature and Retreat"
              ]
            },
            {
              "id": 114,
              "name": "Ladakh",
              "slug": "ladakh",
              "tagline": "Little Tibet",
              "nickname": "Ladakh",
              "lat": 34.142897,
              "long": 77.555333,
              "state": {
                "id": 26,
                "name": "Ladakh",
                "region": "North India"
              },
              "short_description": "Ladakh may be a small district and a neighborhood of Jammu and Kashmir area within the northernmost a part of India. Ladakh is legendary with its scenic views thanks to its location on the hills of the Himalayas. The northern corner of the world touches the border between India and China. The area is sort of dry and is correctly irrigated for agriculture to develop. The local population number is on the brink of 275 thousand people, most of these live at the expense of what they manage to grow in their gardens and fields. There are a couple of tourist attractions within the district, including an outsized natural preserve, Hemis park .",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/162608395527500414848327636719.jpg",
              "most_popular_for": [
                "Adventure and Outdoors"
              ]
            },
            {
              "id": 184,
              "name": "Tirthan Valley",
              "slug": "tirthan_valley",
              "tagline": "Adventure Junkie",
              "nickname": "Tirthan Valley",
              "lat": 31.83,
              "long": 77.16,
              "state": {
                "id": 4,
                "name": "Himachal Pradesh",
                "region": "North India"
              },
              "short_description": "The clouds, the hills, the waterfalls are just like mother nature's arms where anyone can find peace and happiness, Tirthan valley happens to be one such hidden jewel of Himachal Pradesh, where peace and happiness come hand in hand. Tirthan valley, the perfect hideaway of the Himalayas, is perched at an altitude of 1600 meters above sea level, in the Kullu district of the state.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/162766660189017796516418457031.jpg",
              "most_popular_for": [
                "Adventure and Outdoors"
              ]
            },
            {
              "id": 133,
              "name": "Dhanaulti",
              "slug": "dhanaulti",
              "tagline": "Outdoor capital",
              "nickname": "Dhanaulti",
              "lat": 30.411,
              "long": 78.23401,
              "state": {
                "id": 2,
                "name": "Uttarakhand",
                "region": "North India"
              },
              "short_description": "Dhanaulti is a hill station situated in the foothills of the Garhwal Himalayan range, located 24 km from the queen of hills, Mussoorie. This beautiful tourist destination of Uttarakhand makes for an ideal weekend getaway. The town itself is very quiet and small, there is not much to see in the town,  but one can enjoy the beautiful views and relax. Dhanaulti is best during winters when the place turns into an ice blanket with the flakes of snow depositing on the branches of the trees to match its hue with the surrounding. In summers, Dhanaulti boasts blooming of rhododendrons, lush deodar, and oak trees enveloped in the tranquilizing charm. Indeed this scenic little place is considered one of the phenomenal points of tourist's interest in Uttarakhand. The adventure park here is a hub for adventure seekers.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/161952548814207434654235839844.jpg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Nature and Retreat",
                "Isolated"
              ]
            }
          ]
        },
        {
          "id": 3,
          "name": "For the History Buffs",
          "page": "City Guide",
          "priority_order": 4,
          "experiences": [],
          "reviews": [],
          "blogs": [
            {
              "id": "f1eeb9d4-2d31-4e4b-9714-7f3d0d530238",
              "image": null,
              "is_active": true,
              "created_at": "2021-07-26 15:29:11",
              "modified_at": "2021-07-26 15:29:11",
              "is_adventure_and_outdoors": false,
              "is_spiritual": false,
              "is_nature_and_retreat": false,
              "is_isolated": false,
              "is_heritage": false,
              "is_nightlife": false,
              "is_shopping": false,
              "is_art_and_culture": false,
              "is_science_and_knowledge": false,
              "is_romantic": false,
              "name": "A Complete Guide to the City of Mughal Marvels, Agra",
              "cities": null,
              "tags": [
                "Agra"
              ],
              "link": "https://www.thetarzanway.com/post/a-complete-guide-to-the-city-of-mughal-marvels-agra",
              "short_text": null,
              "author": null
            },
            {
              "id": "2d5c1446-73f0-4ff8-9744-0feec842f036",
              "image": null,
              "is_active": true,
              "created_at": "2021-07-26 15:29:11",
              "modified_at": "2021-07-26 15:29:11",
              "is_adventure_and_outdoors": false,
              "is_spiritual": false,
              "is_nature_and_retreat": false,
              "is_isolated": false,
              "is_heritage": false,
              "is_nightlife": false,
              "is_shopping": false,
              "is_art_and_culture": false,
              "is_science_and_knowledge": false,
              "is_romantic": false,
              "name": "6 Must-Visit Places Near Udaipur That Would Feed You History Bug! ",
              "cities": null,
              "tags": [
                "Udaipur",
                " Kumbhalgarh",
                " Chittorgarh",
                " Haldighati",
                " Ranakpur",
                " Nathdwara",
                " Rajsamand",
                " "
              ],
              "link": "https://www.thetarzanway.com/post/6-must-visit-places-near-udaipur-that-would-feed-your-history-bug",
              "short_text": null,
              "author": null
            },
            {
              "id": "48d78525-a5e2-4436-bb4a-ada887d53256",
              "image": null,
              "is_active": true,
              "created_at": "2021-07-26 15:29:11",
              "modified_at": "2021-07-26 15:29:11",
              "is_adventure_and_outdoors": false,
              "is_spiritual": false,
              "is_nature_and_retreat": false,
              "is_isolated": false,
              "is_heritage": false,
              "is_nightlife": false,
              "is_shopping": false,
              "is_art_and_culture": false,
              "is_science_and_knowledge": false,
              "is_romantic": false,
              "name": "RAJASTHAN ON ROAD",
              "cities": null,
              "tags": [
                "Rajasthan"
              ],
              "link": "https://www.thetarzanway.com/post/rajasthan-on-road",
              "short_text": null,
              "author": null
            }
          ],
          "cities": [
            {
              "id": 164,
              "name": "Jaipur",
              "slug": "jaipur",
              "tagline": "Paris of India",
              "nickname": "Jaipur",
              "lat": 26.9124,
              "long": 75.7873,
              "state": {
                "id": 3,
                "name": "Rajasthan",
                "region": "Western India"
              },
              "short_description": "Jaipur is the capital city of the largest state of India. Known as the pink city, Jaipur is covered by mesmerizingly beautiful pink buildings that bring out the glory of the past. Named after the founder of the city, Maharaja Sawai Jai Singh II, Jaipur is one of the oldest planned cities of India. It was founded in 1727 and it took four years to finish the foundation of the city. Jaipur has now been classified as one of the World Heritage Sites by UNESCO. It is famous for the majestic palaces and forts and the for portraying the beautiful culture of Rajasthan. Jaipur boasts of being the part of the Golden Triangle of India, along with the popular tourist destination of Delhi and Agra",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/161171829304026794433593750000.jpg",
              "most_popular_for": [
                "Heritage"
              ]
            },
            {
              "id": 298,
              "name": "Jodhpur",
              "slug": "jodhpur",
              "tagline": "Royal Entrance",
              "nickname": "Jodhpur",
              "lat": 26.2389,
              "long": 73.0243,
              "state": {
                "id": 3,
                "name": "Rajasthan",
                "region": "Western India"
              },
              "short_description": "Jodhpur is the second-largest city in Rajasthan. It is popularly known as the Blue City, because of the unique paint the houses here are colored in. To its north and northwestern regions lies the Thar Desert. The history of the city dates back to 1459 AD. Rao Jodha, the erstwhile ruler of the Rathore Clan is credited for the origin of this magnificent town. Jodhpur is famous for its grandeur infrastructures, authentic Rajasthani cuisine served in numerous restaurants, old town busy life, and the insurmountable number of views it possesses particularly the breathtaking landscape views from the grand Mehrangarh Fort.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/161010845254216551780700683594.webp",
              "most_popular_for": [
                "Heritage",
                "Shopping",
                "Travel and Learn"
              ]
            },
            {
              "id": 315,
              "name": "McLeod Ganj",
              "slug": "mcleod_ganj",
              "tagline": "Little Lhasa",
              "nickname": "McLeod Ganj",
              "lat": 32.32737,
              "long": 76.34028,
              "state": {
                "id": 4,
                "name": "Himachal Pradesh",
                "region": "North India"
              },
              "short_description": "Mcleod Ganj is a village named after Lord David McLeod with a population of around 10,000 people, largely consisting of the Tibetan community. It is 3kms north of Dharamshala in the Kangra district of Himachal Pradesh. It is also known as 'Little Lhasa' or 'Dhasa.'  McLeod Ganj is one of the most famous places in Dharamshala and attracts thousands of tourists from all over India as well as the world. This place gives an option to the visitors to volunteer with the Tibetan community, provides courses in Buddhism, meditation, or yoga classes, and is famous for shopping for Tibetan crafts and trekking. Visitors having a low budget can also enjoy the free spiritual vibe along with numerous good cafes.  The best time of the year to visit this place is between  September to March.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/161988879019726610183715820312.jpg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Spiritual",
                "Nature and Retreat",
                "Isolated",
                "Heritage"
              ]
            },
            {
              "id": 1,
              "name": "Agra",
              "slug": "agra",
              "tagline": "Home of Taj",
              "nickname": "Agra",
              "lat": 27.172709,
              "long": 78.010908,
              "state": {
                "id": 1,
                "name": "Uttar Pradesh",
                "region": "North India"
              },
              "short_description": "Agra is a north-western city in the state of Uttar Pradesh situated on the banks of the river Yamuna about 210 kilometers south of the national capital, Delhi. It is a part of the famous tourist circuit, the Golden Triangle. The city has a glorious past. It finds a place in the Hindu epic Mahabharata in addition to serving as the capital of the grand Mughal Empire for a lot of years before the capital was shifted to Delhi. The historical past and magnificent infrastructure of this city make it a must-go-to-place when in India. It is has emerged as a famous tourist attraction with the Taj Mahal seeing an average of 8 million visitors annually.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/162308491507835650444030761719.jpg",
              "most_popular_for": [
                "Heritage",
                "Art and Culture",
                "Travel and Learn"
              ]
            },
            {
              "id": 307,
              "name": "Amritsar",
              "slug": "amritsar",
              "tagline": null,
              "nickname": "Amritsar",
              "lat": 31.634,
              "long": 74.8723,
              "state": {
                "id": 16,
                "name": "Punjab",
                "region": "North India"
              },
              "short_description": "Amritsar also known as Ambarsar is a wonderful city in Indian state of Punjab situated 455 km from New Delhi.Spiritually more significant place and home to Harmandir Sahib  meaning \"abode of God or Darbār Sahib.Popularly called as \"THE GOLDEN TEMPLE\", holiest Gurdwara and the most important pilgrimage site of Sikhism.Guru Ram Das, the fourth Sikh guru is credited with founding the holy city of Amritsar in the Sikh tradition.Built by Guru Arjan,the fifth Sikh guru.The temple is surrounded by \"pool of nectar\",called the Amrita Saras .The structure is overlaid with gold,hence called the golden temple.\r\nJallianwala Bagh, a walled garden near the Golden Temple, to protest British rule. Today, the furthest end of the Bagh is marked by a Martyrs’ Memorial built in the shape of an eternal flame. \r\nThe lowering of the flags ceremony at the Attari-Wagah border is a daily military practice that the security forces of India (Border Security Force, BSF) and Pakistan (Pakistan Rangers) have jointly followed since 1959.\r\nThe Durgiana Temple also known as Lakshmi Narayan Temple, Durga Tirath and Sitla Mandir, is a premier temple situated in the city of Amritsar, Punjab, IndiaThe architecture of Sri Durgiana Temple is similar to Golden Temple.\r\nThe place is also well known for heritage walk ,food,shopping.The very popular amritsari juttis,punjabi phulkari,woollen products are must buy.Lavishing malai lassi,amritsari kulcha chaas,amritsari naan are lipsmacking delights.",
              "is_active": true,
              "is_live": false,
              "image": "media/cities/163544062509531235694885253906.jpeg",
              "most_popular_for": [
                "Spiritual",
                "Heritage"
              ]
            },
            {
              "id": 121,
              "name": "Udaipur",
              "slug": "udaipur",
              "tagline": "White city",
              "nickname": "Udaipur",
              "lat": 24.585413,
              "long": 73.711371,
              "state": {
                "id": 3,
                "name": "Rajasthan",
                "region": "Western India"
              },
              "short_description": "Founded in the 1550s by Udai Singh II, Udaipur is popularly known as the 'City of Lakes' for the great number of lakes it houses. The city is located in the southern parts of Rajasthan, surrounded by the Aravalli hills range. The city boasts of being one of the most romantic destinations in Asia, also known for its rich history, culture, museums, galleries, the gigantic forts it houses, and most importantly, the scenic locations. It has drawn the attention of travelers and artists worldwide, being shot in several Indian and Hollywood movies. The city experiences moderate to high temperature during summer and mildly chill in the winter months. The city possesses rich and vibrant cultural practices and has an energetic zing tagged with its people and streets.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/162227416908536243438720703125.jpg",
              "most_popular_for": [
                "Nature and Retreat",
                "Heritage",
                "Travel and Learn"
              ]
            }
          ]
        },
        {
          "id": 4,
          "name": "Chill Weekend Getaways",
          "page": "City Guide",
          "priority_order": 5,
          "experiences": [],
          "reviews": [],
          "blogs": [],
          "cities": [
            {
              "id": 331,
              "name": "Jim Corbett National Park",
              "slug": "jim_corbett_national_park",
              "tagline": "Tiger capital",
              "nickname": "Jim Corbett",
              "lat": 29.53019,
              "long": 78.77465,
              "state": {
                "id": 2,
                "name": "Uttarakhand",
                "region": "North India"
              },
              "short_description": "The Jim Corbett National Park, located in the Nainital district and Pauri Garhwal district of Uttarakhand is the oldest national park in India. It was established in 1936 as Hailey National Park to protect the endangered Bengal tiger and was named after hunter and naturalist Jim Corbett. Spread over an area of 521 sq. km, The park contains 488 different species of flora, a wide variety of wildlife, and around 600 different species of bird. Corbett National Park is one of the valuable pearls of Indian timberlands that welcomes everybody to encounter the mesmerizing landscapes and the astonishments hidden inside. The transparent greenery, thriving plants, wildlife, and birdlife, and presence of two streams, Kosi and Ramganga make Jim Corbett a jewel of a spot to explore. The park is a hub for adventure buffs, bird watchers, and wildlife lovers. Uncover the numerous delightful and hidden secrets of this forest land.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/161760809417842102050781250000.jpg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Spiritual",
                "Nature and Retreat",
                "Isolated",
                "Heritage"
              ]
            },
            {
              "id": 1,
              "name": "Agra",
              "slug": "agra",
              "tagline": "Home of Taj",
              "nickname": "Agra",
              "lat": 27.172709,
              "long": 78.010908,
              "state": {
                "id": 1,
                "name": "Uttar Pradesh",
                "region": "North India"
              },
              "short_description": "Agra is a north-western city in the state of Uttar Pradesh situated on the banks of the river Yamuna about 210 kilometers south of the national capital, Delhi. It is a part of the famous tourist circuit, the Golden Triangle. The city has a glorious past. It finds a place in the Hindu epic Mahabharata in addition to serving as the capital of the grand Mughal Empire for a lot of years before the capital was shifted to Delhi. The historical past and magnificent infrastructure of this city make it a must-go-to-place when in India. It is has emerged as a famous tourist attraction with the Taj Mahal seeing an average of 8 million visitors annually.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/162308491507835650444030761719.jpg",
              "most_popular_for": [
                "Heritage",
                "Art and Culture",
                "Travel and Learn"
              ]
            },
            {
              "id": 164,
              "name": "Jaipur",
              "slug": "jaipur",
              "tagline": "Paris of India",
              "nickname": "Jaipur",
              "lat": 26.9124,
              "long": 75.7873,
              "state": {
                "id": 3,
                "name": "Rajasthan",
                "region": "Western India"
              },
              "short_description": "Jaipur is the capital city of the largest state of India. Known as the pink city, Jaipur is covered by mesmerizingly beautiful pink buildings that bring out the glory of the past. Named after the founder of the city, Maharaja Sawai Jai Singh II, Jaipur is one of the oldest planned cities of India. It was founded in 1727 and it took four years to finish the foundation of the city. Jaipur has now been classified as one of the World Heritage Sites by UNESCO. It is famous for the majestic palaces and forts and the for portraying the beautiful culture of Rajasthan. Jaipur boasts of being the part of the Golden Triangle of India, along with the popular tourist destination of Delhi and Agra",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/161171829304026794433593750000.jpg",
              "most_popular_for": [
                "Heritage"
              ]
            },
            {
              "id": 154,
              "name": "Kasauli",
              "slug": "kasauli",
              "tagline": "Weekend cure",
              "nickname": "Kasauli",
              "lat": null,
              "long": null,
              "state": {
                "id": 4,
                "name": "Himachal Pradesh",
                "region": "North India"
              },
              "short_description": null,
              "is_active": true,
              "is_live": true,
              "image": "",
              "most_popular_for": null
            },
            {
              "id": 93,
              "name": "Rishikesh",
              "slug": "rishikesh",
              "tagline": "Yoga Capital",
              "nickname": "Rishikesh",
              "lat": 30.0869,
              "long": 78.2676,
              "state": {
                "id": 2,
                "name": "Uttarakhand",
                "region": "North India"
              },
              "short_description": "Located in the foothills of the Himalayas along the convergence of Ganga and Chandrabhaga River, Rishikesh is a small town in the Dehradun district, located close to Haridwar in Uttarakhand. Rishikesh (also called as Hrishikesh) is known for its adventure activities, ancient temples, popular cafes and as the \"Yoga Capital of the World\". Gateway to Garhwal Himalayas, Rishikesh is also a pilgrimage town and one of the holiest places for Hindus.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/160956220045094466209411621094.jpg",
              "most_popular_for": [
                "Adventure and Outdoors",
                "Spiritual",
                "Nature and Retreat",
                "Travel and Learn",
                "Social Tourism",
                "Shopping"
              ]
            },
            {
              "id": 183,
              "name": "Pushkar",
              "slug": "pushkar",
              "tagline": "Rose Garden",
              "nickname": "Pushkar",
              "lat": 26.488674,
              "long": 74.5509,
              "state": {
                "id": 3,
                "name": "Rajasthan",
                "region": "Western India"
              },
              "short_description": "The holy city that lies tucked away in the Aravallis, Pushkar resembles a coming together of culture, religion, and daily life. Known for hosting the famous Brahma temple, Pushkar attracts millions of tourists all over the world. Adorned with Ghats and, temples that boast of Rajput and Tamil architecture, the city has some other attractions too that tell the story of its rich past. Lying in the center of the town is the Pushkar Sarovar where pilgrims flock to take a holy dip while the outskirts flaunt the deserts and the rural villages presenting a unique scenario of the city. Life is as busy as ever and locals never forget to have some poha or kachori and jalebi before going to work or buying some malpuas on their way back home. There is another side to Pushkar which speaks of a thriving hippie culture, evident in the falafel shops that have come across the city. There is also the Pushkar Annual Camel Fair, a one-of-a-kind amalgamation of life and culture in Rajasthan that remains as the highlight. A must-visit place, Pushkar is truly the gem of the Rajasthan.",
              "is_active": true,
              "is_live": true,
              "image": "media/cities/158512954269407153129577636719.jpg",
              "most_popular_for": [
                "Spiritual"
              ]
            }
          ]
        }
      ]
  ]
return (
    <div style={{minHeight: '100vh'}}>
      {/* <DesktopPersonaliseBanner onclick={_handlePersonaliseRedirect} text="Want to personalize your own experience?"></DesktopPersonaliseBanner> */}
      <div>
        <FullImage url={""}>
        <FullImgContent tagline="Travel Experiences" text="Some quote comes here"/>

        </FullImage>
      {/* <ExperienceGallery  filter={experienceLoaded && experienceData.data.most_popular_for ? experienceData.data.most_popular_for[0] : null}  experienceLoaded={experienceLoaded} title={experienceData.data.name} region={experienceLoaded ? experienceData.data.state_name : null} duration={experienceLoaded ? experienceData.data.ideal_duration_days+" Days" : null} setGalleryOpen={setGalleryOpen} images={experienceData.data.images}  /> */}
        <Details  data={data} loaded={loaded}     ></Details>
      {/* <ChatBot history={props.history} /> */}
    </div>
    {/* <Loading hide={experienceLoaded}></Loading> */}
      <Transition in={!loaded} timeout={1000} unmountOnExit>
          { state => 
          <div
          className="center-div"
          style={{
            backgroundColor: "#F7e700",
             width: '100vw',
             transition: 'all 1s ease-out',
             zIndex: '1000',
              height: '100vh',
             position: 'fixed',
             left: state=='exiting' ? '-100vw' : 0,

             top: '0',
             }}>
             <Loading/>
             </div>


          }
           {/* <div style={{backgroundColor: '#F7e700', height: '50vh'}}></div> */}
           </Transition>
    </div>
  );
}


export default Listings;
