import Head from "next/head";
import Layout from "../../components/Layout";
import axiospagelistinstance from "../../services/pages/list";

import AffiliatePage from "../../containers/corporates[dev]/Index";
import { activityDetail } from "../../services/poi/poiActivities";

const Covid = (props) => {
  return (
    <Layout>
      <Head>
        <title>
          Corporate Travel Support | Business Travel India | The Tarzan Way
        </title>
        <meta
          name="description"
          content="Streamline corporate travel with our AI-powered planning and support. Enjoy personalized itineraries, cost savings, and 24/7 assistance for a hassle-free business travel experience."
        ></meta>
        <meta
          property="og:title"
          content="Corporate Travel Support | Business Travel India | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Streamline corporate travel with our AI-powered planning and support. Enjoy personalized itineraries, cost savings, and 24/7 assistance for a hassle-free business travel experience."
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          name="keyword"
          content="ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, corporate trip, business trip, business travel,  large group, group trips, group travel package, travel allowance, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, hotels, flights, activities, transfers, solo travel, family travel"
        />

        <script
          type="module"
          crossorigin
          src="/vendor/panorama-slider.js"
        ></script>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/corporates`}
        ></link>
      </Head>

      <AffiliatePage {...props}></AffiliatePage>
    </Layout>
  );
};

export async function getStaticProps() {
  const corporate_gateways = [
    "836805a2-d11f-4ebf-b4d6-b635e830f115",
    "4d6423c9-eb84-43a5-ad49-36982ff65870",
    "25d98826-ab2a-4ca9-a05b-2caa2dee0c7b",
    "878b97fc-281d-4a8b-91e7-a5ff1875c2ca",
    "e9830e9b-9040-4a5e-acc6-bf3bdd910a28",
    "1e340946-89b5-4750-b00e-1af45afad44e",
    "0a62245b-7990-4f8d-897e-0df487939b6a",
  ];

  const in_office = [
    "9f9e7f6f-c5ca-4869-856b-57dd466171e0",
    "58c21c3a-c131-4bdb-9b78-86ba9568342e",
    "1c89b7b0-bc83-4996-8a01-d88ef7f54599",
    "e872d67e-f377-4815-b3e4-bfef28a27a0b",
    "925c70fc-afd3-45da-a48b-8f65015e5bdd",
  ];

  const team_outing = [
    "7818f979-e141-426c-9906-84a75cf62812",
    "9f1485a1-2fef-4bbb-877e-c04374e15a56",
    "ec2dc300-4d5b-4c15-b672-85d7da798b8f",
    "801d8409-e819-4e15-b8ac-6dcbf49e81f1",
    "5f367711-8be6-48da-99b1-43ac83b81e51",
  ];

  const conference = [
    "9e5382a7-c1fb-4f50-8819-bd75c04eb565",
    "f91eb521-2ea0-4995-8870-6bd15ab9d805",
    "19ba7109-59bb-48c2-bd36-c7db80d989d4",
    "6b518483-67a9-4d88-bbbf-2783aff3d691",
  ];

  // const weekend_excursions = [
  //   "91cec15d-2499-4080-86f5-1e13a1fca14d",
  //   "2ad32b42-f487-40b2-bd8c-8b048a133d98",
  //   "f2fbbbea-3bc5-4b5c-abd6-9149fba8f368",
  //   "3b59a1ca-c167-43e1-a1d7-e950563f8c9e",
  // ];

  // const add_on = ["0a62245b-7990-4f8d-897e-0df487939b6a", "f5471651-43d4-4d35-b7ff-359499420ba9"];

  var locations = [];

  var corporate_gateways_activities = [];

  var in_office_activities = [];

  var team_outing_activities = [];

  var conference_activities = [];

  var weekend_excursions_activities = [];

  var add_on_activities = [];

  try {
    const pageListResponse = await axiospagelistinstance.get(
      `/?country=india&page_type=Destination&fields=id,destination,tagline,image,link,path,banner_heading,page_type,budget`
    );

    locations = pageListResponse.data;
  } catch (err) {
    console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
  }

  for (let i = 0; i < corporate_gateways.length; i++) {
    try {
      const res = await activityDetail.get(`${corporate_gateways[i]}`);
      if (res?.data?.data?.activity) {
        corporate_gateways_activities.push(res?.data?.data?.activity);
      }
    } catch (err) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
    }
  }

  for (let i = 0; i < in_office.length; i++) {
    try {
      const res = await activityDetail.get(`${in_office[i]}`);
      if (res?.data?.data?.activity) {
        in_office_activities.push(res?.data?.data?.activity);
      }
    } catch (err) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
    }
  }

  for (let i = 0; i < team_outing.length; i++) {
    try {
      const res = await activityDetail.get(`${team_outing[i]}`);
      if (res?.data?.data?.activity) {
        team_outing_activities.push(res?.data?.data?.activity);
      }
    } catch (err) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
    }
  }

  for (let i = 0; i < conference.length; i++) {
    try {
      const res = await activityDetail.get(`${conference[i]}`);
      if (res?.data?.data?.activity) {
        conference_activities.push(res?.data?.data?.activity);
      }
    } catch (err) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
    }
  }

  // for (let i = 0; i < weekend_excursions.length; i++) {
  //   try {
  //     const res = await activityDetail.get(`${weekend_excursions[i]}`);
  //     if (res?.data?.data?.activity) {
  //       weekend_excursions_activities.push(res?.data?.data?.activity);
  //     }
  //   } catch (err) {
  //     console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
  //   }
  // }

  // for (let i = 0; i < add_on.length; i++) {
  //   try {
  //     const res = await activityDetail.get(`${add_on[i]}`);
  //     if (res?.data?.data?.activity) {
  //       add_on_activities.push(res?.data?.data?.activity);
  //     }
  //   } catch (err) {
  //     console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
  //   }
  // }

  return {
    props: {
      corporate_gateways_activities,
      in_office_activities,
      team_outing_activities,
      conference_activities,
      // weekend_excursions_activities,
      // add_on_activities,
      locations,
    },
  };
}

export default Covid;


// import { useState, useEffect } from "react";
// import Head from "next/head";
// import Layout from "../../components/Layout";
// import axiospagelistinstance from "../../services/pages/list";
// import {activityDetail}from "../../services/poi/poiActivities";
// import AffiliatePage from "../../containers/corporates[dev]/Index";

// const Covid = () => {
//   const [data, setData] = useState({
//     corporate_gateways_activities: [],
//     in_office_activities: [],
//     team_outing_activities: [],
//     conference_activities: [],
//     weekend_excursions_activities: [],
//     add_on_activities: [],
//     locations: [],
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//      const corporate_gateways = [
//     "9f9e7f6f-c5ca-4869-856b-57dd466171e0",
//     "58c21c3a-c131-4bdb-9b78-86ba9568342e",
//     "1c89b7b0-bc83-4996-8a01-d88ef7f54599",
//     "e872d67e-f377-4815-b3e4-bfef28a27a0b",
//     "925c70fc-afd3-45da-a48b-8f65015e5bdd",
    
//   ];

//   const in_office = [
//     "836805a2-d11f-4ebf-b4d6-b635e830f115",
//     "4d6423c9-eb84-43a5-ad49-36982ff65870",
//     "25d98826-ab2a-4ca9-a05b-2caa2dee0c7b",
//     "878b97fc-281d-4a8b-91e7-a5ff1875c2ca",
//     "e9830e9b-9040-4a5e-acc6-bf3bdd910a28",
//     "1e340946-89b5-4750-b00e-1af45afad44e",
//     "0a62245b-7990-4f8d-897e-0df487939b6a",
//   ];

//   const team_outing = [
//     "9e5382a7-c1fb-4f50-8819-bd75c04eb565",
//     "f91eb521-2ea0-4995-8870-6bd15ab9d805",
//     "19ba7109-59bb-48c2-bd36-c7db80d989d4",
//     "6b518483-67a9-4d88-bbbf-2783aff3d691",
//   ];

//   const conference = [
//      "7818f979-e141-426c-9906-84a75cf62812",
//     "9f1485a1-2fef-4bbb-877e-c04374e15a56",
//     "ec2dc300-4d5b-4c15-b672-85d7da798b8f",
//     "801d8409-e819-4e15-b8ac-6dcbf49e81f1",
//     "5f367711-8be6-48da-99b1-43ac83b81e51",
    
//   ];

//   const weekend_excursions = [
//     "91cec15d-2499-4080-86f5-1e13a1fca14d",
//     "2ad32b42-f487-40b2-bd8c-8b048a133d98",
//     "f2fbbbea-3bc5-4b5c-abd6-9149fba8f368",
//     "3b59a1ca-c167-43e1-a1d7-e950563f8c9e",
//   ];

//   const add_on = ["0a62245b-7990-4f8d-897e-0df487939b6a", "f5471651-43d4-4d35-b7ff-359499420ba9"];

//       const fetchActivities = async (ids) => {
//         const activities = [];
//         for (let i = 0; i < ids.length; i++) {
//           try {
//             const res = await activityDetail.get(`${ids[i]}`);
//             if (res?.data?.data?.activity) {
//               activities.push(res?.data?.data?.activity);
//             }
//           } catch (err) {
//             console.log("[ERROR][corporatespage:fetchActivities]: ", err.message);
//           }
//         }
//         return activities;
//       };

//       try {
//         // Fetch locations
//         let locations = [];
//         try {
//           const pageListResponse = await axiospagelistinstance.get(
//             `/?country=india&page_type=Destination&fields=id,destination,tagline,image,link,path,banner_heading,page_type,budget`
//           );
//           locations = pageListResponse.data;
//         } catch (err) {
//           console.log("[ERROR][corporatespage:fetchData]: ", err.message);
//         }

//         // Fetch all activities in parallel for better performance
//         const [
//           corporate_gateways_activities,
//           in_office_activities,
//           team_outing_activities,
//           conference_activities,
//           weekend_excursions_activities,
//           add_on_activities,
//         ] = await Promise.all([
//           fetchActivities(corporate_gateways),
//           fetchActivities(in_office),
//           fetchActivities(team_outing),
//           fetchActivities(conference),
//           fetchActivities(weekend_excursions),
//           fetchActivities(add_on),
//         ]);

//         setData({
//           corporate_gateways_activities,
//           in_office_activities,
//           team_outing_activities,
//           conference_activities,
//           weekend_excursions_activities,
//           add_on_activities,
//           locations,
//         });
//       } catch (err) {
//         console.log("[ERROR][corporatespage:fetchData]: ", err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   console.log("DDDDDD",data)

//   return (
//     <Layout>
//       <Head>
//         <title>
//           Corporate Travel Support | Business Travel India | The Tarzan Way
//         </title>
//         <meta
//           name="description"
//           content="Streamline corporate travel with our AI-powered planning and support. Enjoy personalized itineraries, cost savings, and 24/7 assistance for a hassle-free business travel experience."
//         ></meta>
//         <meta
//           property="og:title"
//           content="Corporate Travel Support | Business Travel India | The Tarzan Way"
//         />
//         <meta
//           property="og:description"
//           content="Streamline corporate travel with our AI-powered planning and support. Enjoy personalized itineraries, cost savings, and 24/7 assistance for a hassle-free business travel experience."
//         />
//         <meta property="og:image" content="/logoblack.svg" />
//         <meta
//           name="keyword"
//           content="ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, corporate trip, business trip, business travel,  large group, group trips, group travel package, travel allowance, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, hotels, flights, activities, transfers, solo travel, family travel"
//         />

//         <link
//           rel="canonical"
//           href={`https://thetarzanway.com/corporates`}
//         ></link>
//       </Head>

//       {loading ? (
//         <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
//       ) : (
//         <AffiliatePage {...data}></AffiliatePage>
//       )}
//     </Layout>
//   );
// };

// export default Covid;
