import CovidContainer from "../../containers/corporates[dev]/Index";
import Head from "next/head";
import Layout from "../../components/Layout";
import axiospagelistinstance from "../../services/pages/list";
import activityDetail from "../../services/poi/poiActivities";

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

        <link
          rel="canonical"
          href={`https://www.thetarzanway.com/corporates`}
        ></link>
      </Head>

      <CovidContainer {...props}></CovidContainer>
    </Layout>
  );
};

export async function getStaticProps() {
  const corporate_gateways = [
    "Ozm4gEXNEPRWpVqS",
    "5YoPLy1QGB0iurIb",
    "Acb2fFF4ONBZdHH8",
    "mP37ksLdAmAWhxA0",
    "ZwwoboSp6gQVt279",
    "HU68gVotMm5ITaY4",
  ];

  const in_office = [
    "oozEpnJxf8qLpuMu",
    "EPtUxvBVWbUrKJQj",
    "5wyhpQxyooqi8PTf",
    "uJNMWr2mwCnTe5Q8",
    "EAkSIqCPwciwxTJ8",
    "Pdze59WW7nEufbCZ",
    "YKcoGDmmN1CuSpyj",
    "M2BptKDkbjNmi5aO",
  ];

  const team_outing = [
    "ZXUfjRHEcnT4DF9n",
    "qXqoQAbtKDSCFrHt",
    "PM1DzVUJUye2jzoL",
    "2zjrgeMEe5BbB4dP",
    "Zy8FVvBXRRbqLoMm",
    "PC2rtR8Lpx0U4ql3",
    "LMLqTtTdZBNPmAsh",
  ];

  const conference = [
    "xfTmAutmruRWirxL",
    "pVAazCM6RBMrVbeB",
    "cs27nZbl5fzHVvov",
    "bgtPQPT8xYhYR532",
  ];

  const weekend_excursions = [
    "5EULhmJwouD5NN2A",
    "mB41NUAncHsprakh",
    "jaI9b4RopHpOvcoz",
    "2nVXqISpq9quVrdD",
  ];

  const add_on = ["M2BptKDkbjNmi5aO", "agNqMJktHadqViPS"];

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
      const res = await activityDetail.get(`/?id=${corporate_gateways[i]}`);
      if (res?.data?.name) {
        corporate_gateways_activities.push(res.data);
      }
    } catch (err) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
    }
  }

  for (let i = 0; i < in_office.length; i++) {
    try {
      const res = await activityDetail.get(`/?id=${in_office[i]}`);
      if (res?.data?.name) {
        in_office_activities.push(res.data);
      }
    } catch (err) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
    }
  }

  for (let i = 0; i < team_outing.length; i++) {
    try {
      const res = await activityDetail.get(`/?id=${team_outing[i]}`);
      if (res?.data?.name) {
        team_outing_activities.push(res.data);
      }
    } catch (err) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
    }
  }

  for (let i = 0; i < conference.length; i++) {
    try {
      const res = await activityDetail.get(`/?id=${conference[i]}`);
      if (res?.data?.name) {
        conference_activities.push(res.data);
      }
    } catch (err) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
    }
  }

  for (let i = 0; i < weekend_excursions.length; i++) {
    try {
      const res = await activityDetail.get(`/?id=${weekend_excursions[i]}`);
      if (res?.data?.name) {
        weekend_excursions_activities.push(res.data);
      }
    } catch (err) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
    }
  }

  for (let i = 0; i < add_on.length; i++) {
    try {
      const res = await activityDetail.get(`/?id=${add_on[i]}`);
      if (res?.data?.name) {
        add_on_activities.push(res.data);
      }
    } catch (err) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
    }
  }

  return {
    props: {
      corporate_gateways_activities,
      in_office_activities,
      team_outing_activities,
      conference_activities,
      weekend_excursions_activities,
      add_on_activities,
      locations,
    },
  };
}

export default Covid;
