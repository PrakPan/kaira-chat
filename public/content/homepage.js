const experiences = {
    //Locations on top 
    "Top Locations" : [
        {
            "tagline": "Mountain Paradise",
            "id": 114,
            "name": "Ladakh",
            "slug": 'leh,_ladakh',
            "state": {
              "name": "Ladakh"
            },
            "image": "media/website/ayandrali-dutta-GAWiEPB0uEk-unsplash.jpeg",
            "url": "",
        },
        {
            "tagline": "Heaven on Earth",
            "name": "Kashmir",
            "slug": 'srinagar',
            "id":152,
            "state": {
              "name": "Kashmir",
            },
            "image": "media/website/praneet-kumar-H8dcf-v98mA-unsplash.jpeg",
            "url": "",
        },
        {
            "id": 278,
            "tagline": "Awe-Inspiring",
            "name": "Andaman",
            "slug": 'andaman_islands',
            "state":{
              "name": "Andaman And Nicobar Islands",
            },
            "image": "media/website/Andaman.jpeg",
            "url": "",
        },
        {
          "tagline": "Splendid",
          "name": "Goa",
          "id": 277,
          "slug": 'goa',
          "state": {
            "name": "Goa"
          },
          "image": "media/website/Goa.jpg",
          "url": "",
      },
        {
            "tagline": "Experience Heritage",
            "name": "Jodhpur",
            "id": 298,
            "slug": 'jodhpur',
            "state": {
              "name": "Rajasthan",
            },
            "image": "media/website/Jodhpur.jpeg",
            "url": "",
        }
    ],
    //Experiences under 1st heading
    "Recommended experiences": [
        //Add mukteshwar caravan experience
        {  
          "id":"553f6a52-40af-40b9-bc18-10121194026d",
          "slug": "life-in-a-pahadi-village",
          "experience_filters": ["Isolated"],
          "name": "Life in a Pahadi Village",
          'number_of_adults': 2,

          "experience_region": "Rishikesh",
          "rating": 4.8,
          'budget': 'Affordable',
          'group_type': 'Friends',
          "duration": "4 days",
          "short_text": "With this immersive travel experience, the focus is providing insight, to the travelers, into the lifestyle, culture and local traditions of a Pahadi Village. Travelers are encouraged to interact with the local community, and, celebrate wearing the fabric of diversity and pluralism.",
          "starting_cost" : "550000",
          "images": {
              "main_image": "media/experiences/Main.jpg",
              "main_image_alt_text": null,
            },
            "payment_info": 
              {
                "per_person_total_cost": 550000,
                "currency": "USD",
                "total_cost": 185000,
                "service_fee": 15000,
                "duration": "4 weeks"
              }
            ,
      },
        {  
            "id": "edc49cb9-d375-4473-aa2f-3555dd4354c3",
            "slug": "the-lake-city-caravan-experience",
            "name": "The Lake City Caravan Experience",
            'number_of_adults': 6,

            "experience_filters": [    "Adventure and Outdoors",          ],
            "starting_cost": "20000000",
            "experience_region": "Uttarakhand",
            'budget': 'Luxury',
            'group_type': 'Friends',

            "rating": 4.8,
            "duration": "4 days",
            "short_text": "Enjoy the serenity away from the hustle and bustle of city life from the romantic lake city of Bhimtal to Pangoot, a town filled with colorful winged birds who will make you want to fly!",
            "starting_cost" : "1050000",
            "images": {
              "main_image": "media/experiences/162555084767278409004211425781.jpeg",
              "main_image_alt_text": null,
              },
              "payment_info": 
                {
                  "per_person_total_cost": 2750000,
                  "currency": "USD",
                  "total_cost": 185000,
                  "service_fee": 15000,
                  "duration": "4 weeks"
                }
              ,
        },
        {  
            "id":"8975c808-d678-481d-af0b-bdc0b0342db4",
            "slug": "meadows-of-kheerganga",
            "name": "Meadows of Kheerganga",
            'budget': 'Affordable',
            'number_of_adults': 2,
          'group_type': 'Friends',
            "experience_filters": [    "Adventure and Outdoors",          ],
            "experience_region": "Kasol",
            "rating": 4.8,
            "duration": "2 nights",
            "starting_cost" : "180000",
            "short_text": "Head over to the serene and peaceful village of Tosh and conquer the trek of Kheerganga on this 2-night experience.",            "starting_cost" : "550000",
            "images": {
                "main_image": "media/experiences/161712852740653038024902343750.jpeg",
                "main_image_alt_text": null,
              },
              "payment_info": 
                {
                  "per_person_total_cost": 550000,
                  "currency": "USD",
                  "total_cost": 185000,
                  "service_fee": 15000,
                  "duration": "4 weeks"
                }
              ,
        },
        {  
            "id":"ac14fffd-9115-4dec-a3ad-08239b831c74",
            'budget': 'Affordable',
          'group_type': 'Solo',
          'number_of_adults': 1,
            "slug": "workcation-at-manali",
             "experience_filters": [    "Nature and Retreat",       ],

            "name": "Workcation at Manali",
            "experience_region": "Manali",
            "rating": 4.8,
            "duration": "1 week",
            "starting_cost" : "750000",
            "short_text": "Enjoy weekends full of activities and weekdays at this beautiful mountainous workation in Manali. Rejuvenate away from the city, while keeping up with your work.",            "images": {
                "main_image": "media/experiences/162270407079772591590881347656.jpeg",
                "main_image_alt_text": null,
              },
              "payment_info": 
                {
                  "per_person_total_cost": 750000,
                  "currency": "USD",
                  "total_cost": 185000,
                  "service_fee": 15000,
                  "duration": "4 weeks"
                }
              ,
        },
    ],
    //Experiences under second heading
    "Work from home redefined": [
      {  
        "id":"269b812b-53cc-4ad7-9946-8a97b91e197f",
        'budget': 'Affordable',
        'group_type': 'Solo',
        'number_of_adults': 1,
        "slug": "workcation-in-goa",
        "experience_filters": [    "Nature and Retreat",       ],
        "starting_cost": "7500",
        "name": "Workcation in Goa",
        "experience_region": "Goa",
        "rating": 4.8,
        "duration": "1 week",
        "short_text": "The beach is where we leave all our worries away but imagine working at the beach itslef! Enjoy work in the week + vacation in the evening in Goa.",
        "starting_cost" : "8000",
        "images": {
            "main_image": "media/experiences/162499173904613351821899414062.jpg",
            "main_image_alt_text": null,
          },
          "payment_info": 
            {
              "per_person_total_cost": 800000,
              "currency": "USD",
              "total_cost": 185000,
              "service_fee": 15000,
              "duration": "4 weeks"
            }
          ,
      },  
        {  
            "id":"ac14fffd-9115-4dec-a3ad-08239b831c74",
            "name": "Workcation at Manali",
            "slug": "workcation-at-manali",
            'budget': 'Affordable',
            'group_type': 'Solo',
            'number_of_adults': 1,
            "experience_filters": [    "Nature and Retreat",       ],
            "experience_region": "Manali",
            "rating": 4.8,
            "duration": "1 week",
            "starting_cost" : "7500",
            "short_text": "Enjoy weekends full of activities and weekdays at this beautiful mountainous workation in Manali. Rejuvenate away from the city, while keeping up with your work.",            
            "images": {
                "main_image": "media/experiences/162270407079772591590881347656.jpeg",
                "main_image_alt_text": null,
              },
              "payment_info": 
                {
                  "per_person_total_cost": 750000,
                  "currency": "USD",
                  "total_cost": 185000,
                  "service_fee": 15000,
                  "duration": "4 weeks"
                }
              ,

        },
        {  
          "id":"b7afefa3-928b-44e2-a00e-0968fb3db817",
          "slug": "workcation-in-kasol",
          "experience_filters": [    "Nature and Retreat",       ],
          'budget': 'Affordable',
          'group_type': 'Solo',
          'number_of_adults': 1,
          "name": "Workcation at Kasol",
          "experience_region": "Kasol",
          "starting_cost" : "6000",
          "rating": 4.9,
          "duration": "1 week",
          "short_text": "Spend beautiful time as you work and enjoy the vacation. Trek up to some of the most beautiful places, explore some hidden gems and come back with a lot of memories and souvenirs.",            
          "images": {
              "main_image": "media/experiences/162488183213306903839111328125.jpeg",
              "main_image_alt_text": null,
            },
            "payment_info": 
              {
                "per_person_total_cost": 600000,
                "currency": "USD",
                "total_cost": 185000,
                "service_fee": 15000,
                "duration": "4 weeks"
              }
            ,
      },
      {  
        "id":"091a8312-5578-471b-8bca-57110fd13483",
        "slug": "workcation-in-rishikesh",
        "name": "Workcation in Rishikesh",
        "experience_filters": [    "Adventure and Outdoors",          ],
        'budget': 'Affordable',
        'group_type': 'Solo',
        'number_of_adults': 1,
        "experience_region": "Rishikesh",
        "rating": 4.7,
        "duration": "1 week",
        "starting_cost" : "6500",
        "short_text": "Rishikesh is a small town in the state of Uttarakhand. Located on the foothills of the mighty Himalayan range, it is commonly known as the 'Gateway to the Garhwal'. The town has emerged as a perfect blend of spirituality and adventurous experiences for travelers from across the world. It has come to be popularly called 'Yoga Capital of the World', believed to be the favorite meditation retreat among sages from ancient times.",            
        "images": {
            "main_image": "media/experiences/162149091225943279266357421875.jpg",
            "main_image_alt_text": null,
          },
          "payment_info": 
            {
              "per_person_total_cost": 650000,
              "currency": "USD",
              "total_cost": 185000,
              "service_fee": 15000,
              "duration": "4 weeks"
            }
          ,
    },
    ],
    //Blog
    "An Introduction to Workcation": {
      "heading": "An Introduction to Workcation",
      "text": "“Workcation” (noun) - The act of working while on a vacation to feed your wanderlust and enjoy your work life.",
      "image": "media/website/laptop-1.jpeg",
      "link": "https://www.thetarzanway.com/post/introduction-workation-uttarakhand"
    },
    //3rd experiences grid
    "Travel with a purpose": [
        {  
          'budget': 'Affordable',
          'group_type': 'Solo',
          'number_of_adults': 1,
            "id":"5138a1cc-c3e8-4aa1-96ad-47d599702447",
            "slug": "social-travel-north-india",
            "name": "Social Travel: North India",
            "experience_filters": [    "Art and Culture",          ],

            "experience_region": "North India",
            "rating": 4.8,
            "duration": "4 weeks",
            "starting_cost" : "20500",
            "short_text": "A 4+ weeks, immersive travel experience covering 16+ locations all across North India while participating in volunteer work along with a lot of adventurous activities. With meaningful insight into the Indian culture and traditions and celebration of the cultural diversity and vibrancy of this land this experience is a must for every traveler.",
            "images": {
                "main_image": "media/experiences/Main-julian-yu-unsplash.jpg",
                "main_image_alt_text": null,
              },
              "payment_info": 
                {
                  "per_person_total_cost": 2050000,
                  "currency": "USD",
                  "total_cost": 185000,
                  "service_fee": 15000,
                  "duration": "4 weeks"
                }
              ,
        },
        {  
          'budget': 'Affordable',
          'group_type': 'Solo',
          'number_of_adults': 1,
          "id":"40b075cc-3a2c-4643-aae4-687bbd7b2004",
          "name": "Matt's volunteering in India",
          "experience_filters": [    "Social",          ],
          "slug": "volunteer-with-woman-community",

          "experience_region": "India",
          "rating": 4.8,
          "duration": "5 days",
          "starting_cost" : "5500",
          "short_text": "The visitors will gain on-field experience about the social work aimed at upliftment of socially backward groups particularly women and girls.",
          "images": {
              "main_image": "media/experiences/162029797381059408187866210938.jpg",
              "main_image_alt_text": null,
            },
            "payment_info": 
              {
                "per_person_total_cost": 1550000,
                "currency": "USD",
                "total_cost": 185000,
                "service_fee": 15000,
                "duration": "4 weeks"
              }
            ,
      },
        {  
          'budget': 'Affordable',
          'group_type': 'Solo',
          'number_of_adults': 1,
            "id":"27abbde4-932a-4076-85ea-103f9ba34b4e",
            "name": "Volunteer in Delhi",
            "experience_region": "Delhi",
            "slug": "volunteer-in-delhi",
            "experience_filters": [    "Heritage",          ],

            "rating": 4.8,
            "duration": "2 weeks",
            "starting_cost" : "5500",
            "short_text": "In this 2-week experiential and volunteering program explore the monuments, heritage sites of Delhi and Agra, and, witness the diversified culture of Delhi.",            
            "images": {
                "main_image": "media/experiences/Main-maahid-mohamed-JsQ_buQ5fUg-unsplash.jpg",
                 "main_image_alt_text": null,
            },"payment_info": 
                {
                  "per_person_total_cost": 550000,
                  "currency": "USD",
                  "total_cost": 185000,
                  "service_fee": 15000,
                  "duration": "4 weeks"
                }
              ,

        },
        {  
          'budget': 'Affordable',
          'group_type': 'Friends',
          'number_of_adults': 2,
            "id":"772e2aab-16f0-48d1-a485-23ca05c09a07",
            "name": "An offbeat vacation at Bishnoi Village",
            "experience_region": "Rajasthan",
            "rating": 4.8,
            "experience_filters": [    "Art and Culture",          ],

            "slug": "an-offbeat-vacation-at-bishnoi-village",

            "duration": "4 days",
            "starting_cost" : "4500",
            "short_text": "Indulge yourself in a once-in-a-lifetime experience of tribal life at the Bishnoi Village. This mesmerizing desert oasis experience is a lot more than a natural retreat. Losing yourself in the safari, making a lot of new friends in the villagers, understanding village life. Best of all, you can try your artistry in pot-making, carpet-weaving, and other fascinating activities.",
            "images": {
                "main_image": "media/experiences/162393124563373136520385742188.jpg",
                "main_image_alt_text": null,
            },
            "payment_info": 
                {
                  "per_person_total_cost": 450000,
                  "currency": "USD",
                  "total_cost": 185000,
                  "service_fee": 15000,
                  "duration": "4 weeks"
                }
              ,

        },
    ],
    "Inidan Review" : {
      
        name: "Aziza",
        image: "media/website/Aziza.png",
        location: "indonesia",
        review: "The Tarzan Way isn’t your typical travel agent, they will create a personalized travel itinerary which will escalate your journey in India. The team work with passion and professionalism. They are super communicative and responsive too. Trust me, you’ll be in a good hand. I’ll definitely recommend it!",
        summary: "The Tarzan Way isn’t your typical travel agent, they will create a personalized travel itinerary which will escalate your journey in India...."
    
    },
    //4th expeirneces grid
    "Live a different lifestyle": [
        {  
            "id":"61928a60-59d3-479b-b561-559a435c1a2c",
            "name": "Life of a Nomad",
            'budget': 'Affordable',
            'group_type': 'Friends',
            'number_of_adults': 4,
            "slug": "life-of-a-nomad",
            "experience_filters": [ "Adventure and Outdoors",],
            "experience_region": "Ladakh",
            "rating": 4.7,
            "duration": "5 days",
            "starting_cost" : "14500",
            "short_text": "In this week-long experiential travel program, take a break from the rapacious world and uplift your spirits by living in the remotest corner of Ladakh with the Changpa Tribe.",            "images": {
                "main_image": "media/experiences/Main_3AGXPc6.jpg",
                "main_image_alt_text": null,
            },
            "payment_info": 
                {
                  "per_person_total_cost": 1450000,
                  "currency": "USD",
                  "total_cost": 185000,
                  "service_fee": 15000,
                  "duration": "4 weeks"
                }
              ,

        },
        {  
            "id":"772e2aab-16f0-48d1-a485-23ca05c09a07",
            "name": "An offbeat vacation at Bishnoi Village",
            "experience_region": "Rajasthan",
            "experience_filters": [    "Art and Culture",          ],
            'budget': 'Affordable',
            'group_type': 'Friends',
            'number_of_adults': 4,
            "slug": "an-offbeat-vacation-at-bishnoi-village",
            "rating": 4.8,
            "duration": "4 days",
            "starting_cost" : "4500",
            "short_text": "Indulge yourself in a once-in-a-lifetime experience of tribal life at the Bishnoi Village. This mesmerizing desert oasis experience is a lot more than a natural retreat. Losing yourself in the safari, making a lot of new friends in the villagers, understanding village life. Best of all, you can try your artistry in pot-making, carpet-weaving, and other fascinating activities.",
            "images": {
                "main_image": "media/experiences/162393124563373136520385742188.jpg",
                "main_image_alt_text": null,
            },
            "payment_info": 
                {
                  "per_person_total_cost": 450000,
                  "currency": "USD",
                  "total_cost": 185000,
                  "service_fee": 15000,
                  "duration": "4 weeks"
                }
              

        },
        {  
            "id":"95b726fa-e00c-4cd2-b77c-ac47316ba414",
            "name": "Off the grid Goa",
            "slug": "off-the-grid-goa",
            'budget': 'Affordable',
            'group_type': 'Couple',
            'number_of_adults': 2,
            "experience_filters": ["Nature and Retreat",],
            "experience_region": "Goa",
            "starting_cost" : "5500",
            "rating": 4.8,
            "duration": "4 days",
            "short_text": "With the help of these four days, the program relieves all your stress, spend some time separated from busy city life.",            "images": {
                "main_image": "media/experiences/162330867965037083625793457031.jpg",
                "main_image_alt_text": null,
            },
            "payment_info": 
                {
                  "per_person_total_cost": 550000,
                  "currency": "USD",
                  "total_cost": 185000,
                  "service_fee": 15000,
                  "duration": "4 weeks"
                }
              ,

        },
        {  
          "id": "1895df40-80bf-457e-a8fd-6460d96de284",
          "slug": "manali-trance",
          "name": "Manali Trance",
          "starting_cost": "6000",
          'budget': 'Affordable',
          'group_type': 'Friends',
          'number_of_adults': 4,
            "experience_filters": ["Adventure and Outdoors"],
          "experience_region": "Manali",
          "rating": 4.8,
          "duration": "3 nights",
          "short_text": "Renounce yourself in the abyss and experience trance. Manali will either give you existential crises or put a rest on them!",
          "images": {
              "main_image": "media/experiences/162339664600439214706420898438.jpg",
              "main_image_alt_text": null,
          },
          "payment_info": 
              {
                "per_person_total_cost": 600000,
                "currency": "USD",
                "total_cost": 185000,
                "service_fee": 15000,
                "duration": "4 weeks"
              }
            ,
    
      },
    ],
    "Women's Day Specials": [
      {  
        "id": "f65b8d06-f497-4313-9f06-42933ebb009d",
        "slug": "manali-trance",
        'budget': 'Luxury',
        'group_type': 'Solo',
        'number_of_adults': 1,
        "name": "Neha's solo workation",
        "starting_cost": "6000",
        "experience_filters": ["Adventure"],
        "experience_region": "Uttarakhand",
        "rating": 4.8,
        "duration": "4 weeks",
        "short_text": "A month long workcation in Uttarakhand to work away from home and go on adventures. Location: Uttarakhand, 1 week, Adventure",
        "images": {
            "main_image": "media/website/Neha.jpeg",
            "main_image_alt_text": null,
        },
        "payment_info": [
            {
              "cost": 4366600,
              "currency": "USD",
              "total_cost": 185000,
              "service_fee": 15000,
              "duration": "4 weeks"
            }
          ],
  
    },
    {  
      "id": "04fa8a36-64a8-4f61-a4db-4759df73c4c8",
      "slug": "manali-trance",
      'budget': 'Luxury',
      'group_type': 'Solo',
      'number_of_adults': 1,
      "name": "Harshitha's solo cultural",
      "starting_cost": "6000",
      "experience_filters": ["Heritage"],
      "experience_region": "Rajasthan",
      "rating": 4.8,
      "duration": "8 nights",
      "short_text": "A week in Rajasthan to understand a new culture and have some amazing new cuisine.",
      "images": {
          "main_image": "media/website/Harshitha.jpeg",
          "main_image_alt_text": null,
      },
      "payment_info": [
          {
            "cost": 8374300,
            "currency": "USD",
            "total_cost": 185000,
            "service_fee": 15000,
            "duration": "4 weeks"
          }
        ],

  },
  {  
    "id": "cb24dd9e-2529-4717-9f1f-ee80930aacce",
    "slug": "manali-trance",
    "name": "Monsterrat's solo volunteering",
    "starting_cost": "6000",
    'budget': 'Affordable',
    'group_type': 'Solo',
    'number_of_adults': 1,
    "experience_filters": ["Culture"],
    "experience_region": "North India",
    "rating": 4.8,
    "duration": "4 weeks+",
    "short_text": "A 3-month India exploration of a 17-year old all over India. North India, 4 weeks+, Art & culture",
    "images": {
        "main_image": "media/website/Monsterrat.jpeg",
        "main_image_alt_text": null,
    },
    "payment_info": [
        {
          "cost": 7750500,
          "currency": "USD",
          "total_cost": 185000,
          "service_fee": 15000,
          "duration": "4 weeks"
        }
      ],

}, {  
  "id": "bdb09db1-3c34-4a69-a3e0-98cfbda0c49e",
  "slug": "manali-trance",
  'budget': 'Luxury',
  'group_type': 'Friends',
  'number_of_adults':5,
  "name": "Gorika's women trip",
  "starting_cost": "6000",
  "experience_filters": ["Nature & retreat"],
  "experience_region": "Sikkim",
  "rating": 4.8,
  "duration": "5 days",
  "short_text": "A recreational trip to Sikkim with friends for some chill time. Sikkim, 5 days, Nature & retreat",
  "images": {
      "main_image": "media/website/Gorika.jpeg",
      "main_image_alt_text": null,
  },
  "payment_info": [
      {
        "cost": 18832000,
        "currency": "USD",
        "total_cost": 185000,
        "service_fee": 15000,
        "duration": "4 weeks"
      }
    ],

},
    ],
    "14 MUST-DO Tips for every Solo Woman Traveler in India": {
      "heading": "14 MUST-DO Tips for every Solo Woman Traveler in India",
      "text": "To travel across the country solo with nothing but a backpack is on a lot of bucket lists, men and women alike, however, it won’t be an exaggeration for us to say that it is especially difficult for women to take on such an adventure.",
      "image": "media/website/e126f9_04c0da01afdf4888b52d6c210bcb2532_mv2.webp",
      "link": "https://www.thetarzanway.com/post/14-must-do-tips-for-every-solo-woman-traveler-in-india"
    },
"Holi": [
  {  
    "id": "ysoaNsCEXo2huFKq",
	"slug": "rishikesh-holi-adventure",
  "name": "Adventurous Holi in Rishikesh",

    "experience_region": "Rishikesh",
    "rating": 4.9,
    "experience_filters": [    "Adventure",          ],


    "duration": "2 days",
    "starting_cost" : "4500",
    "short_text": "Rishikesh is an amazing location to visit with your friends to have some adventurous experiences and just relax by the riverside while enjoying the view of the mountains.",
    "images": {
        "main_image": "media/experiences/164700256084951996803283691406.jpeg",
        "main_image_alt_text": null,
    },
    "payment_info": 
        {
          "per_person_total_cost": 350900,
          "currency": "USD",
          "total_cost": 185000,
          "service_fee": 15000,
          "duration": "4 weeks"
        }
      ,

},
{  
  "id": "Jdx704kVkhGo00eC",
	"name": "Holi in the Land of Maharajas",
	"experience_region": "Rajasthan",
  "rating": 4.8,
  "experience_filters": [    "Art and Culture",          ],

	"slug": "jodhpur-pushkar-holi-",

	"duration": "2 days",
   "short_text": "A heritage and culture lover's paradise, Rajasthan is famous for its forts and lakes but Rajasthan is a state built with utmost historical significance and very relevant for the festival of colors, Holi.",
  "images": {
      "main_image": "media/experiences/164699452462671470642089843750.jpeg",
      "main_image_alt_text": null,
  },
  "payment_info": 
      {
        "per_person_total_cost": 1040000,
        "currency": "USD",
        "total_cost": 185000,
        "service_fee": 15000,
        "duration": "4 weeks"
      }
    ,

},
{  
  "id":"oLbmmI8iye1VNblc",
  "name": "Celebrate Holi in the mountains",
  "experience_region": "Manali",
  "rating": 4.6,
  "experience_filters": [    "Adventure",          ],

	"slug": "manali-holi",

  "duration": "2 days",
  "starting_cost" : "4500",
  "short_text": "Manali is famous for its scenic beauty and amazing weather all year long. One of the most loved locations for tourists, Manali",
  "images": {
      "main_image": "media/experiences/164685659738783478736877441406.jpeg",
      "main_image_alt_text": null,
  },
  "payment_info": 
      {
        "per_person_total_cost": 360000,
        "currency": "USD",
        "total_cost": 185000,
        "service_fee": 15000,
        "duration": "4 weeks"
      }
    ,

},

{  
	"id": "I6IkfdUxv98lBwLL",
  "name": "Family Holi weekend in Rishikesh",
  "experience_region": "Rishikesh",
  "rating": 4.7,
  "experience_filters": [    "Nature & Retreat",          ],

	"slug": "rishikesh-holi",

  "duration": "2 days",
  "starting_cost" : "4500",
  "short_text": "Rishikesh is an amazing location to visit with your family to experience some of the best temples in India as the holy river Ganges",
  "images": {
      "main_image": "media/experiences/164685316741237425804138183594.jpeg",
      "main_image_alt_text": null,
  },
  "payment_info": 
      {
        "per_person_total_cost": 350900,
        "currency": "USD",
        "total_cost": 185000,
        "service_fee": 15000,
        "duration": "4 weeks"
      }
    ,
},
{  
	"id": "I6IkfdUxv98lBwLL",
  "name": "Udaipur- Holi at the lakes",
  "experience_region": "Udaipur",
  "rating": 4.9,
  "experience_filters": [    "Heritage",          ],

	"slug": "udaipur-holi",

  "duration": "2 days",
  "starting_cost" : "4500",
  "short_text": "The heritage-rich city is perfect to spend your weekend and celebrate Holi with your friends",
  "images": {
      "main_image": "media/experiences/164685096918450093269348144531.jpeg",
      "main_image_alt_text": null,
  },
  "payment_info": 
      {
        "per_person_total_cost": 600000,
        "currency": "USD",
        "total_cost": 185000,
        "service_fee": 15000,
        "duration": "4 weeks"
      }
    ,

},
{  
	"id": "ptx2VZx5k2DPdofc",
	"name": "Holi weekend at Jim Corbett",
  "experience_region": "Udaipur",
  "rating": 4.7,
  "experience_filters": [    "Nature & Retreat",          ],

	"slug": "jim-corbett-holi",

  "duration": "2 days",
  "starting_cost" : "4500",
  "short_text": "A perfect way to spend your Holi weekend in the wilderness and party",
  "images": {
      "main_image": "media/experiences/164682686492217326164245605469.jpeg",
      "main_image_alt_text": null,
  },
  "payment_info": 
      {
        "per_person_total_cost": 958400,
        "currency": "USD",
        "total_cost": 185000,
        "service_fee": 15000,
        "duration": "4 weeks"
      }
    ,

},
]
}

export default experiences;