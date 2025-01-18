import Head from "next/head";
// import { useEffect } from "react";
// import { connect } from "react-redux";
import ThemePage from "../../containers/travelplanner/ThemePage";
import Layout from "../../components/Layout";
// import { axiosPageInstance } from "../../services/pages/travel-planner";
// import axiospagelistinstance, {
//   axiosPageList,
// } from "../../services/pages/list";
// import axioslocationsinstance from "../../services/search/search";
// import setHotLocationSearch from "../../store/actions/hotLocationSearch";



const HoneymoonTheme = () => {
  const locations =  [
      {
        name: "Paris",
        slug: "paris",
        tagline: "The City of Light",
        text: "Discover the romantic streets of Paris, from the Eiffel Tower to the charming cafes.",
        image: "media/themes/banner.png",
        path: "/paris",
        cta_path: "/explore-paris",
        tags: ["romantic", "culture", "art", "history"],
        most_popular_for: ["romantic getaways", "art lovers", "foodies"]
      },
      {
        name: "Tokyo",
        slug: "tokyo",
        tagline: "A Fusion of Tradition and Modernity",
        text: "Experience the bustling streets of Tokyo, with its ancient temples and cutting-edge technology.",
        image: "media/themes/banner.png",
        path: "/tokyo",
        cta_path: "/explore-tokyo",
        tags: ["modern", "technology", "culture"],
        most_popular_for: ["tech enthusiasts", "cultural explorers"]
      },
      {
        name: "New York",
        slug: "new-york",
        tagline: "The City That Never Sleeps",
        text: "Explore the iconic landmarks of New York, from Times Square to Central Park.",
        image: "media/themes/banner.png",
        path: "/new-york",
        cta_path: "/explore-new-york",
        tags: ["urban", "iconic", "diverse"],
        most_popular_for: ["city life", "tourism", "nightlife"]
      },
      {
        name: "Rome",
        slug: "rome",
        tagline: "The Eternal City",
        text: "Walk through the ancient ruins of Rome, where history comes alive around every corner.",
        image: "media/themes/banner.png",
        path: "/rome",
        cta_path: "/explore-rome",
        tags: ["history", "architecture", "culture"],
        most_popular_for: ["history buffs", "architecture lovers"]
      },
      {
        name: "Sydney",
        slug: "sydney",
        tagline: "Harbor Views and Sunny Beaches",
        text: "Relax on the beaches or explore the iconic Sydney Opera House and Harbour Bridge.",
        image: "media/themes/banner.png",
        path: "/sydney",
        cta_path: "/explore-sydney",
        tags: ["beach", "outdoor", "adventure"],
        most_popular_for: ["beach lovers", "adventure seekers"]
      },
      {
        name: "London",
        slug: "london",
        tagline: "A Blend of Royalty and Modernity",
        text: "From Buckingham Palace to the buzzing streets of Shoreditch, London offers something for everyone.",
        image: "media/themes/banner.png",
        path: "/london",
        cta_path: "/explore-london",
        tags: ["royalty", "history", "modern"],
        most_popular_for: ["royal history", "shopping", "nightlife"]
      },
      {
        name: "Barcelona",
        slug: "barcelona",
        tagline: "A Coastal Gem in Spain",
        text: "With its beautiful beaches and unique architecture, Barcelona is a vibrant city for travelers.",
        image: "media/themes/banner.png",
        path: "/barcelona",
        cta_path: "/explore-barcelona",
        tags: ["beach", "architecture", "culture"],
        most_popular_for: ["architecture enthusiasts", "food lovers"]
      },
      {
        name: "Amsterdam",
        slug: "amsterdam",
        tagline: "The Venice of the North",
        text: "Cruise through canals and visit world-class museums in the charming city of Amsterdam.",
        image: "media/themes/banner.png",
        path: "/amsterdam",
        cta_path: "/explore-amsterdam",
        tags: ["canals", "museums", "culture"],
        most_popular_for: ["museum lovers", "history enthusiasts"]
      },
      {
        name: "Berlin",
        slug: "berlin",
        tagline: "The Creative Capital of Europe",
        text: "Known for its vibrant culture and rich history, Berlin is a city where creativity thrives.",
        image: "media/themes/banner.png",
        path: "/berlin",
        cta_path: "/explore-berlin",
        tags: ["creative", "history", "culture"],
        most_popular_for: ["art lovers", "history buffs"]
      },
      {
        name: "Los Angeles",
        slug: "los-angeles",
        tagline: "The Entertainment Capital",
        text: "From Hollywood to the beach, LA is a city full of star-studded attractions.",
        image: "media/themes/banner.png",
        path: "/los-angeles",
        cta_path: "/explore-los-angeles",
        tags: ["entertainment", "beach", "urban"],
        most_popular_for: ["movie buffs", "beach lovers"]
      }
    ]

    const Data = {
      "success": true,
      "data": {
        "id": 2,
        "page_type": "Theme",
        "slug": "volunteer-in-india",
        "name": "Volunteer in India",
        "image": "media/themes/banner.png",
        "headings": [
          {
            "page": 2,
            "priority": 1,
            "name": "Trips by our users",
            "carousel": null,
            "text": null,
            "itineraries": [
              {
                "id": "81c2a011-0256-402c-885f-accfe5f9acbc",
                "review": null,
                "created_at": "2022-11-22 17:26:30",
                "modified_at": "2023-02-28 19:46:49",
                "slug": null,
                "page_title": null,
                "meta_description": null,
                "social_share_title": null,
                "social_media_description": null,
                "meta_keywords": null,
                "name": "Volunteering in The Heritage City- Mysore",
                "start_date": null,
                "end_date": null,
                "start_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "end_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "status": "Prepared",
                "route": [
                  "d1cf4315-0db3-4e26-bdc6-7ac95fd74f12",
                  "5261666c-aa02-40d6-bc52-6495d6eb5048",
                  "f4b9f3b1-d2f0-4efe-a4cb-e91e83ee71d6",
                  "0e9286cc-d03d-497e-9b5f-88c582a55f7e",
                  "ace57352-1ecb-43cc-9a1d-f4e784bd2fd0",
                  "daee6397-d339-4db8-bbce-133d25ad79ff",
                  "1fc4684a-1d2f-456b-bbef-11bbe7f74f07"
                ],
                "number_of_adults": 2,
                "number_of_children": 0,
                "number_of_infants": 0,
                "travellers": {
                  "authorized_emails": []
                },
                "images": [
                  "media/itinerary/1559891641_shutterstock_152941832.jpg.jpg",
                  "media/itinerary/coorg-reviews-tourist-places-tourist-destinations.webp",
                  "media/itinerary/shravanabelaloga-17-1024x683.jpg",
                  "media/itinerary/img_4474-hdr.jpg",
                  "media/itinerary/mysore_palace__india_(photo_-_jim_ankan_deka).jpg",
                  "media/itinerary/fe92dfc3-lm-48454-167a97bd72f.jpg"
                ],
                "experience_filters": null,
                "budget": "Affordable",
                "group_type": null,
                "rating_count": null,
                "index": false,
                "featured": true,
                "is_active": true,
                "version": "v1",
                "customer": 1956
              },
              {
                "id": "076605fb-a415-4e9b-b3de-a380d3ec0224",
                "review": null,
                "created_at": "2022-11-24 00:33:25",
                "modified_at": "2023-02-28 19:46:49",
                "slug": "volunteering-in-a-jodhpur-village",
                "page_title": null,
                "meta_description": null,
                "social_share_title": null,
                "social_media_description": null,
                "meta_keywords": null,
                "name": "Volunteering in a Jodhpur village",
                "start_date": null,
                "end_date": null,
                "start_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "end_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "status": "Prepared",
                "route": null,
                "number_of_adults": 1,
                "number_of_children": null,
                "number_of_infants": null,
                "travellers": {
                  "authorized_emails": []
                },
                "images": null,
                "experience_filters": [
                  "Isolated",
                  "Art and Culture"
                ],
                "budget": null,
                "group_type": null,
                "rating_count": null,
                "index": false,
                "featured": true,
                "is_active": true,
                "version": "v1",
                "customer": 1595
              },
              {
                "id": "dc952549-8b13-4634-92cb-25b13ff13b8a",
                "review": null,
                "created_at": "2022-11-15 19:06:30",
                "modified_at": "2023-02-02 00:17:59",
                "slug": null,
                "page_title": null,
                "meta_description": null,
                "social_share_title": null,
                "social_media_description": null,
                "meta_keywords": null,
                "name": "Matt's volunteering in India",
                "start_date": null,
                "end_date": null,
                "start_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "end_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "status": "Not Prepared",
                "route": [
                  "992aeb23-74e2-4af3-a693-a2c06335e652",
                  "da1fb5f4-5ee4-4e8d-bc42-6c8111b2a3d0",
                  "e716d7a9-b54a-4380-8fe1-b7b8cbf1e943",
                  "10cd9fab-b040-464e-839a-1ba83a84279a",
                  "8ef9c6dd-c7ae-4353-89c0-ffc68fe0813a",
                  "85fdb9e2-35f0-46cd-8a95-c7a0bdf26f33"
                ],
                "number_of_adults": null,
                "number_of_children": null,
                "number_of_infants": null,
                "travellers": {
                  "authorized_emails": []
                },
                "images": [
                  "media/itinerary/img_9762.jpg"
                ],
                "experience_filters": null,
                "budget": null,
                "group_type": null,
                "rating_count": null,
                "index": false,
                "featured": false,
                "is_active": true,
                "version": "v1",
                "customer": 42234
              },
              {
                "id": "30a9fdb2-d217-4df0-a425-9dcc01d19975",
                "review": null,
                "created_at": "2022-11-24 00:33:26",
                "modified_at": "2023-02-28 19:46:49",
                "slug": "volunteer-in-rishikesh",
                "page_title": null,
                "meta_description": null,
                "social_share_title": null,
                "social_media_description": null,
                "meta_keywords": null,
                "name": "Volunteer in Rishikesh",
                "start_date": null,
                "end_date": null,
                "start_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "end_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "status": "Prepared",
                "route": [
                  "70c93e8e-bf70-4ad8-822d-747b06977020",
                  "cf84de38-5dfe-4011-a7fd-08d66f77fc7b",
                  "bba6c77d-32a7-496a-92c6-3b5b3a3d7137",
                  "5e2a2728-6f2f-4629-bb3f-561ca075afbd"
                ],
                "number_of_adults": 1,
                "number_of_children": null,
                "number_of_infants": null,
                "travellers": {
                  "authorized_emails": []
                },
                "images": [
                  "media/experiences/162555833680835938453674316406.jpg",
                  "media/experiences/162555833711797666549682617188.jpg",
                  "media/experiences/162555833716471982002258300781.jpg",
                  "media/experiences/162555833720775485038757324219.jpg",
                  "media/experiences/162555833725244474411010742188.jpg",
                  "media/experiences/162555833736828732490539550781.jpeg"
                ],
                "experience_filters": [
                  "Adventure and Outdoors",
                  "Spiritual",
                  "Heritage"
                ],
                "budget": null,
                "group_type": null,
                "rating_count": null,
                "index": false,
                "featured": true,
                "is_active": true,
                "version": "v1",
                "customer": 1595
              },
              {
                "id": "5138a1cc-c3e8-4aa1-96ad-47d599702447",
                "review": null,
                "created_at": "2022-11-24 00:33:29",
                "modified_at": "2023-02-28 19:44:04",
                "slug": "social-travel-north-india",
                "page_title": null,
                "meta_description": "",
                "social_share_title": null,
                "social_media_description": "",
                "meta_keywords": null,
                "name": "Social Travel: North India",
                "start_date": null,
                "end_date": null,
                "start_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "end_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "status": "Prepared",
                "route": [
                  "2b0e2832-b33e-4e94-9248-f2c8da48a1e4",
                  "081d0dc4-6c44-4fd7-8f46-7dc1ea2407c8",
                  "45b2b15c-791c-4145-b8fb-6e8cda8fb9a5",
                  "3693367f-3bf8-4615-a049-e16109320ea7",
                  "c256c35e-0a17-49d3-b3d4-cc160762a0a6",
                  "527a538d-1db1-48fd-877a-adf537ae0542",
                  "467d0b4a-cd57-40eb-851c-6d72b06013e6"
                ],
                "number_of_adults": 1,
                "number_of_children": 0,
                "number_of_infants": 0,
                "travellers": {
                  "authorized_emails": []
                },
                "images": [
                  "media/experiences/Main-julian-yu-unsplash.jpg",
                  "media/experiences/DSC08631.jpg",
                  "media/experiences/Copy_of_20180707_170743.jpg",
                  "media/experiences/IMG-20180820-WA0015.jpg",
                  "media/experiences/IMG-20180821-WA0035.jpg",
                  "media/experiences/Portrait_CaKKqZs.jpg"
                ],
                "experience_filters": [
                  "Adventure and Outdoors",
                  "Nature and Retreat",
                  "Heritage",
                  "Art and Culture"
                ],
                "budget": null,
                "group_type": null,
                "rating_count": null,
                "index": false,
                "featured": false,
                "is_active": true,
                "version": "v1",
                "customer": 1595
              },
              {
                "id": "bb29593e-014b-46bb-b7e3-bf9553882d89",
                "review": null,
                "created_at": "2023-02-02 20:09:35",
                "modified_at": "2023-02-28 19:46:49",
                "slug": null,
                "page_title": null,
                "meta_description": "",
                "social_share_title": null,
                "social_media_description": "",
                "meta_keywords": null,
                "name": "South India Volunteering",
                "start_date": "2022-11-22",
                "end_date": "2022-12-06",
                "start_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "end_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "status": "Prepared",
                "route": [
                  "16397505-fdc3-418a-afd8-92d6f8eec22c",
                  "214d4a64-eb4a-442b-82b5-456d3400b741",
                  "163eaccc-906a-4c1d-9bd0-dbfbb61d0fbb",
                  "89729f5b-3e7a-4d03-ac3b-5a2ef4e4c099",
                  "1db89f80-816b-4670-95d5-ec35ed917756",
                  "f4b48eeb-08ff-416f-a51b-bf03a1f8d9a9",
                  "1e8911d6-a6ff-4650-9ee2-e2de26e4ab6a",
                  "40b9b270-7e72-49cc-b0d4-36ccbb1f9e44",
                  "a35d99f1-d332-4b23-bc8c-4a178f8e500d",
                  "411f5287-790f-4f84-830f-2f73ceb54ee7",
                  "92162095-fdae-49b5-a0ac-da512dc285bf"
                ],
                "number_of_adults": 1,
                "number_of_children": 0,
                "number_of_infants": 0,
                "travellers": {
                  "authorized_emails": []
                },
                "images": [
                  "media/itinerary/naveen-ivolunteer-2.jpg",
                  "media/itinerary/f0.jpg",
                  "media/itinerary/su-10-palace-1-961674-1615662449.jpg",
                  "media/itinerary/1000x650-250.jpg",
                  "media/itinerary/pexels-mikhail-nilov-7474351.jpg"
                ],
                "experience_filters": null,
                "budget": "Average",
                "group_type": "Solo",
                "rating_count": null,
                "index": false,
                "featured": false,
                "is_active": true,
                "version": "v1",
                "customer": 1956
              },
              {
                "id": "f6f6066d-fb6d-49c7-a3a5-a37cbbd513c0",
                "review": 4.6,
                "created_at": "2022-11-01 15:04:06",
                "modified_at": "2024-07-10 17:09:11",
                "slug": "2-weeks-volunteer-in-delhi-excursion-a37cbbd513c0",
                "page_title": "2 Weeks Volunteer in Delhi Excursion | Itinerary",
                "meta_description": "Travel with our free handcrafted itinerary to Delhi Excursion covering Agra. Explore unique stays, book flights, activities, transfers all in one place for a hassle free experience!",
                "social_share_title": "2 Weeks Volunteer in Delhi Excursion | 2 People | The Tarzan Way",
                "social_media_description": "Travel with our free handcrafted itinerary to Delhi Excursion covering Agra. Explore unique stays, book flights, activities, transfers all in one place for a hassle free experience!",
                "meta_keywords": null,
                "name": "Grace's Volunteer in Delhi Excursion",
                "start_date": "2023-04-10",
                "end_date": "2023-04-25",
                "start_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "end_city": {
                  "region": "",
                  "country": "",
                  "location": ""
                },
                "status": "Released",
                "route": [
                  "a1318bcc-d4cc-424c-9b85-113521cd696c",
                  "770ca779-0b07-40e9-81b9-31e37e53d68e"
                ],
                "number_of_adults": 2,
                "number_of_children": 0,
                "number_of_infants": 0,
                "travellers": {
                  "authorized_emails": []
                },
                "images": [
                  "media/experiences/aquib-akhter-obcc0hw6lrq-unsplash.jpg"
                ],
                "experience_filters": null,
                "budget": null,
                "group_type": null,
                "rating_count": 97,
                "index": true,
                "featured": true,
                "is_active": true,
                "version": "v1",
                "customer": 1636
              },
              {
                "id": "787f8908-1fff-424e-8ebd-21f7ae604fed",
                "review": null,
                "created_at": "2022-11-24 02:09:58",
                "modified_at": "2023-03-02 11:08:26",
                "slug": null,
                "page_title": null,
                "meta_description": "",
                "social_share_title": null,
                "social_media_description": "",
                "meta_keywords": null,
                "name": "Volunteering in Land of God- Kochi",
                "start_date": "2023-02-01",
                "end_date": "2023-02-14",
                "start_city": {
                  "bavaria": "",
                  "germany": "",
                  "Schweinfurt": ""
                },
                "end_city": {
                  "bavaria": "",
                  "germany": "",
                  "Schweinfurt": ""
                },
                "status": "Prepared",
                "route": [
                  "6bfab974-ffd9-4ea4-9e9c-94235d7fff85",
                  "ea1316df-e12d-4bb0-81af-62d7f5971670",
                  "f4bccd83-2058-4c07-85de-f34554d6a45a",
                  "f87f24b0-1ecb-43f6-af19-629951292b05"
                ],
                "number_of_adults": 1,
                "number_of_children": 0,
                "number_of_infants": 0,
                "travellers": {
                  "authorized_emails": []
                },
                "images": [
                  "media/itinerary/pexels-mohammed-nasim-12593493.jpg"
                ],
                "experience_filters": null,
                "budget": "Average",
                "group_type": "Solo",
                "rating_count": null,
                "index": false,
                "featured": false,
                "is_active": true,
                "version": "v1",
                "customer": 1621
              }
            ],
            "elements": []
          },
          {
            "page": 2,
            "priority": 2,
            "name": "Top Locations",
            "carousel": "type-3",
            "text": null,
            "itineraries": [],
            "elements": [
              {
                "name": "New Delhi",
                "text": "Historical, Monuments, Culture, Shopping, Food",
                "trip_planner": false,
                "price": null,
                "cta_path": null,
                "image": "https://thetarzanway-web.s3.us-west-2.amazonaws.com/media/cities/166254311192069172859191894531.jpeg?AWSAccessKeyId=AKIA2XNWS34AMEDQN4X7&Signature=ZHQkAJGb6IIX%2FZoi2gGfOBkun6Q%3D&Expires=1737019384",
                "image_alt_text": "India Gate in Delhi",
                "image_credit": "Shalender Kumar from Unsplash"
              },
              {
                "name": "Mumbai",
                "text": "Bollywood, Gateway of India, Street Food, Shopping, Beaches",
                "trip_planner": false,
                "price": 10474,
                "cta_path": null,
                "image": "https://thetarzanway-web.s3.us-west-2.amazonaws.com/media/cities/157910358988507986068725585938.jpg?AWSAccessKeyId=AKIA2XNWS34AMEDQN4X7&Signature=to%2BvNXglkxkgYTA03XJAr8ezzkc%3D&Expires=1737019384",
                "image_alt_text": "Mumbai- the city of dreams",
                "image_credit": "crazytravellers.com"
              },
              {
                "name": "Rishikesh",
                "text": "Yoga, Meditation, Ashrams, Ganges River, Adventure",
                "trip_planner": false,
                "price": 7763,
                "cta_path": null,
                "image": "https://thetarzanway-web.s3.us-west-2.amazonaws.com/media/cities/160956220045094466209411621094.jpg?AWSAccessKeyId=AKIA2XNWS34AMEDQN4X7&Signature=MLb5OA8grX361dhnmQTt4XCsmOY%3D&Expires=1737019384",
                "image_alt_text": "Ganga river in rishikesh",
                "image_credit": "unsplash"
              },
              {
                "name": "Kasol",
                "text": "Trekking, Camping, River Rafting, Nature, Parvati Valley",
                "trip_planner": false,
                "price": 4062,
                "cta_path": null,
                "image": "https://thetarzanway-web.s3.us-west-2.amazonaws.com/media/cities/162653335312065196037292480469.jpg?AWSAccessKeyId=AKIA2XNWS34AMEDQN4X7&Signature=Ycs8L0uag4v6sbzctEwKpBFFi0c%3D&Expires=1737019384",
                "image_alt_text": "Kasol to Grahan trek",
                "image_credit": "ankit choudhary on unsplash"
              },
              {
                "name": "Jaipur",
                "text": "Pink City, Historical Sites, Forts, Palaces, Culture",
                "trip_planner": false,
                "price": null,
                "cta_path": null,
                "image": "https://thetarzanway-web.s3.us-west-2.amazonaws.com/media/cities/166695853772606897354125976562.jpeg?AWSAccessKeyId=AKIA2XNWS34AMEDQN4X7&Signature=4JhujhakGNeAfNyWSzlKUfh5tgA%3D&Expires=1737019384",
                "image_alt_text": "Front view with aerial of fort",
                "image_credit": "Photo by Ved on Unsplash"
              },
              {
                "name": "Kochi",
                "text": "Backwaters, Fort Kochi, Spice Trade, Kerala Culture, Colonial History",
                "trip_planner": false,
                "price": 6329,
                "cta_path": null,
                "image": "https://thetarzanway-web.s3.us-west-2.amazonaws.com/media/cities/166237706725509333610534667969.jpeg?AWSAccessKeyId=AKIA2XNWS34AMEDQN4X7&Signature=fzB76zDCz843w1c7WzaZ4jMD5IE%3D&Expires=1737019384",
                "image_alt_text": "The ancient Dutch building known as Mattechery palace.",
                "image_credit": "@keralatourism"
              }
            ]
          }
        ],
        "meta_keywords": "",
        "tagline": null,
        "banner_heading": "Celebrate Love, Your Way! ",
        "banner_text": "Romantic Getaways, Unforgettable Moments & Experiences Tailored to Your Dream Honeymoon.",
        "overview_text": "Volunteering while traveling in India can be a great way to immerse oneself in the local culture, gain new skills, and make a positive impact on the community. India has a vast range of volunteering opportunities available, from working with children in orphanages or schools, to conservation projects and community development programs. One of the most popular volunteering opportunities in India is teaching English. Many schools and organizations in rural areas are in need of English teachers, and as a native speaker or someone fluent in the language, one can make a significant impact on the students' lives. Volunteering in this area not only helps children to gain a valuable skill but also provides them with the confidence and motivation to pursue their goals. When volunteering in India, it's essential to be respectful of the local culture, customs, and traditions, and to learn some basic phrases in the local language. Volunteering in India can be a rewarding and fulfilling experience, offering a chance to make a positive impact while gaining new perspectives and insights into the country's culture and way of life.",
        "meta_description": "",
        "social_share_title": "The Tarzan Way | Personalized Travel Experiences",
        "social_media_description": ""
      }
    }
     return (
        <>
        <Layout>
      <Head>
        <title>
          Plan Your Trip to {Data.destination} | Trip Planner & Itinerary
          | The Tarzan Way
        </title>
        <meta
          name="description"
          content={`Plan your dream trip to ${Data.destination} with The Tarzan Way's AI itinerary. Explore top attractions, local cuisine, and book your flights, accommodations, and transfers all in one go ${Data.destination}.`}
        ></meta>
        <meta
          property="og:title"
          content={`Plan Your Trip to ${Data.destination} | Trip Planner & Itinerary | The Tarzan Way`}
        />
        <meta
          property="og:description"
          content={`Plan your dream trip to ${Data.destination} with The Tarzan Way's AI itinerary. Explore top attractions, local cuisine, and book your flights, accommodations, and transfers all in one go ${Data.destination}.`}
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content={`${Data.destination} trip planner, ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, travel in ${Data.destination}, ${Data.destination} tour package, experience ${Data.destination} culture, ${Data.destination} holiday package, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, best places in ${Data.destination}, places to visit in ${Data.destination}, best activities in ${Data.destination}, things to do in ${Data.destination}, package for ${Data.destination}, top places in ${Data.destination}, wanderlog, inspirock, tripit, hotels, flights, activities, transfers, solo travel, family travel,`}
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/`}
        ></link>
      </Head>

      <ThemePage
        themePage
        experienceData={Data.data}
        locations={locations}
        eventDates={
          Data?.event_dates &&
          Object.keys(Data.event_dates).length !== 0
        }
      ></ThemePage>
    </Layout>
        </>
     )
}

export default HoneymoonTheme;