import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Drawer from "../../ui/Drawer";
import POIDetailsSkeleton from "../poiDetails/POIDetailsSkeleton";
import ActivityDetails from "./ActivityDetails";
import { activityDetail, activityBooking } from "../../../services/poi/poiActivities";
import { getDate } from "../../../helper/DateUtils";
import { openNotification } from "../../../store/actions/notification";

const ActivityDetailsDrawer = (props) => {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [traceId, setTraceId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateAmenities, setUpdateAmenities] = useState(false);
    const [filterState, setFilterState] = useState({
        pax: {
            number_of_travelers: props.plan.number_of_adults,
            traveler_ages: Array(props.plan.number_of_adults).fill(null),
        }
    })

    useEffect(() => {
        if (props.show) fetchData();
    }, [props.show, filterState]);

    const fetchData = (data) => {
        if (!data?.amenities) {
            setLoading(true);
        }

        let requestData = {
            start_date: getDate(props.date),
            number_of_adults: filterState.pax.number_of_travelers,
            number_of_children: props.plan.number_of_children,
            number_of_travelers: filterState.pax.number_of_travelers,
            traveler_ages: filterState.pax.traveler_ages
        }

        if (data?.amenities) {
            requestData.amenities = data.amenities;
            setUpdateAmenities(true);
        }

        activityDetail
            .post(`/${props.activityId}/`, requestData)
            .then((res) => {
                setTraceId(res.data?.trace_id);
                if (res.data?.data?.activity.name) {
                    setData(res.data?.data?.activity);
                }
                else throw new Error(res.data?.message);
                setLoading(false);
                setUpdateAmenities(false);
            })
            .catch((err) => {
                setData({
                    name: props.name,
                    short_description: props.text,
                    image: props.image,
                });
                setLoading(false);
                setUpdateAmenities(false);
            });
    }

    const updatedActivityBooking = () => {
        const requestData = {
            itinerary_id: router.query?.id,
            trace_id: traceId,
        }

        activityBooking.post(`${router.query?.id}/bookings/activity/`, requestData).then(res => {
            props.getAccommodationAndActivitiesHandler();
            props.openNotification({
                type: "success",
                text: "Activity added successfully.",
                heading: "Sucess!",
            });
        }).catch(err => {
            if (err?.response?.status === 403) {
                props.openNotification({
                    text: "You are not allowed to make changes to this itinerary",
                    heading: "Error!",
                    type: "error",
                });
            } else {
                props.openNotification({
                    text: "There seems to be a problem, please try again!",
                    heading: "Error!",
                    type: "error",
                });
            }
        })
    }

    return (
        <Drawer
            show={props.show}
            anchor={"right"}
            backdrop
            width={"50%"}
            mobileWidth={"100%"}
            style={{ zIndex: props.itineraryDrawer ? 1503 : 1501 }}
            className="font-lexend"
            onHide={props.handleCloseDrawer}
        >
            {!loading ? (
                <ActivityDetails
                    itineraryDrawer={props.itineraryDrawer}
                    data={data}
                    date={props.date}
                    handleCloseDrawer={props.handleCloseDrawer}
                    fetchData={fetchData}
                    updatedActivityBooking={updatedActivityBooking}
                    updateAmenities={updateAmenities}
                    filterState={filterState}
                    setFilterState={setFilterState}
                />
            ) : (
                <POIDetailsSkeleton
                    itineraryDrawer={props.itineraryDrawer}
                    name={props.name}
                    handleCloseDrawer={props.handleCloseDrawer}
                />
            )}
        </Drawer>
    );
}

const mapStateToPros = (state) => {
    return {
        plan: state.Plan,
        itineraryId: state.itineraryId
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        openNotification: (payload) => dispatch(openNotification(payload)),
    };
};

export default connect(mapStateToPros, mapDispatchToProps)(ActivityDetailsDrawer);
