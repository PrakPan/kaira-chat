import Head from "next/head";
import { useEffect } from "react";
import { connect } from "react-redux";

import StatePage from "../../containers/travelplanner/Index";
import Layout from "../../components/Layout";
import axiosTravelPlannerInstance from "../../services/pages/travel-planner";
import axiossearchallinstance from "../../services/search/all";
import axiospagelistinstance from "../../services/pages/list";
import axioslocationsinstance from "../../services/search/search";
import setHotLocationSearch from "../../store/actions/hotLocationSearch";

const TravelPlanner = (props) => {
    useEffect(() => {
        props.setHotLocationSearch(props.hotLocationSearch);
    }, []);

    return (
        <Layout
            page_id={props.Data.id}
            destination={props.Data.destination}
            page={"State Page"}
        >
            <Head>
                <title>
                    Plan Your Trip to {props.Data.destination} | Trip Planner & Itinerary
                    | The Tarzan Way
                </title>
                <meta
                    name="description"
                    content={`Plan your dream trip to ${props.Data.destination} with The Tarzan Way's AI itinerary. Explore top attractions, local cuisine, and book your flights, accommodations, and transfers all in one go ${props.Data.destination}.`}
                ></meta>
                <meta
                    property="og:title"
                    content={`Plan Your Trip to ${props.Data.destination} | Trip Planner & Itinerary | The Tarzan Way`}
                />
                <meta
                    property="og:description"
                    content={`Plan your dream trip to ${props.Data.destination} with The Tarzan Way's AI itinerary. Explore top attractions, local cuisine, and book your flights, accommodations, and transfers all in one go ${props.Data.destination}.`}
                />
                <meta property="og:image" content="/logoblack.svg" />
                <meta
                    property="keywords"
                    content={`${props.Data.destination} trip planner, ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, travel in ${props.Data.destination}, ${props.Data.destination} tour package, experience ${props.Data.destination} culture, ${props.Data.destination} holiday package, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, best places in ${props.Data.destination}, places to visit in ${props.Data.destination}, best activities in ${props.Data.destination}, things to do in ${props.Data.destination}, package for ${props.Data.destination}, top places in ${props.Data.destination}, wanderlog, inspirock, tripit, hotels, flights, activities, transfers, solo travel, family travel,`}
                ></meta>

                <link
                    rel="canonical"
                    href={`https://thetarzanway.com/${props.path}`}
                ></link>
            </Head>

            <StatePage
                experienceData={props.Data}
                locations={props.locations}
            ></StatePage>
        </Layout>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
    };
};

export default connect(null, mapDispatchToProps)(TravelPlanner);

let PATHS_CACHE = null;

async function fetchAllSlugs() {
    const response = await axiospagelistinstance.get(
        "/?fields=path&page_type=Theme",
    );

    const paths = response.data.map((path) => {
        let [theme_type, slug] = path.split('/').filter(el => el != '');

        if (!slug) {
            slug = theme_type
            theme_type = 'theme'
        }

        return {
            theme_type: theme_type,
            slug: slug,
        };
    });

    return paths;
}

export async function getStaticPaths() {
    let paths = [];

    try {
        const response = await axiospagelistinstance.get(
            "/?fields=path&page_type=Theme",
        );

        paths = response.data.map((path) => ({
            params: {
                slug: path.path,
            },
        }));
    } catch (err) {
        console.log("[ERROR][themePage:getStaticPaths]: ", err.message);
    }

    return {
        paths: paths,
        fallback: false,
    };
}

export async function getStaticProps(context) {
    var locations = [];
    let data = null;
    let hotLocationSearch = [];
    const { continent, country, state } = context.params;
    const path = `${continent}/${country}/${state}`;

    try {
        const res = await axiosTravelPlannerInstance.get(
            `/?link=${context.params.slug}`,
        );
        data = res.data;
    } catch (err) {
        console.log(
            `[ERROR][themePage:axiosTravelPlannerInstance][${context.params.slug}]: `,
            err.message,
        );
    }

    if (!data) {
        return {
            notFound: true,
        };
    }

    try {
        const loc = await axiospagelistinstance.get(
            `/?page_type=Destination&fields=id,ancestors,path,destination,name,tagline,image,link,budget`,
        );
        locations = loc.data;
    } catch (err) {
        console.log(
            `[ERROR][themePage:axiospagelistinstance]: `,
            err.message,
        );
    }

    try {
        const response = await axioslocationsinstance.get(
            `hot_destinations/?state=${context.params.slug}/`,
        );
        if (response.data?.length) {
            hotLocationSearch = response.data;
        }
    } catch (err) {
        console.log(
            `[ERROR][ThemePage][axioslocationsinstance:/hot_destinations/?state=${context.params.slug}/]`,
            err.message,
        );
    }

    return {
        props: {
            Data: data,
            locations,
            path,
            hotLocationSearch,
        },
    };
}
