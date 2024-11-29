import { useEffect } from "react";
import { connect } from "react-redux";
import Head from "next/head";
import NewYearConatiner from "../../containers/newYear/index"
import Layout from "../../components/Layout";
import * as authaction from "../../store/actions/auth";
import setHotLocationSearch from "../../store/actions/hotLocationSearch";
import axiospagelistinstance from "../../services/pages/list";
import axioscountrydetailsinstance from "../../services/pages/country";
import axiosCountInstance from "../../services/itinerary/count";
import axioslocationsinstance from "../../services/search/search";

export default function Page(params) {

    return (
        <Layout>
            <Head>
                <title>Travel Company | India | The Tarzan Way</title>
                <meta
                    name="description"
                    content="The Tarzan Way is the best trip-planning platform to craft your trips, your way using AI Trip Planner. Create, browse, customise travel itineraries, manage bookings - all in one place!"
                ></meta>
                <meta
                    property="og:title"
                    content="Travel Company | India | The Tarzan Way"
                />
                <meta
                    property="og:description"
                    content="The Tarzan Way is the best trip-planning platform to craft your trips, your way using AI Trip Planner. Create, browse, customise travel itineraries, manage bookings - all in one place!"
                />
                <meta property="og:image" content="/logoblack.svg" />
                <meta
                    property="keywords"
                    content="new year trips, ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, hotels, flights, activities, transfers,"
                ></meta>

                <link rel="canonical" href={`https://thetarzanway.com`}></link>
            </Head>

            <NewYearConatiner />
        </Layout>
    );
}
