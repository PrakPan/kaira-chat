import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import axiomyplansinstance from "../../services/sales/MyPlans";
import CheckAuthRedirect from "../../components/HOC/CheckAuthRedirect";
import Profile from "./Profile";
import media from "../../components/media";
import { useRouter } from "next/router";
import ItineraryCardV2 from "../../components/revamp/destination/ItineraryCardV2";
import ExperienceCardSkeleton from "../../components/cards/newitinerarycard-main/ExperienceCardSkeleton";
import { logEvent } from "../../services/ga/Index";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile";
import styles from "../../styles/pages/revamp/destination.module.scss";

const UserDashboard = (props) => {
  const [myPlansArr, setMyPlansArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPlans, setTotalPlans] = useState(null);
  const [showMoreResults, setShowMoreResults] = useState(false);
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const [offSet, setOffSet] = useState(0);
  let isPageWide = media("(min-width: 768px)");
  let router = useRouter();
  const currency = useSelector((state) => state.UserLocation)?.location;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (props.token) {
      fetchData();
    }
  }, [props.token]);

  const fetchData = (showMore = false) => {
    if (showMore) setShowMoreLoading(true);
    axiomyplansinstance
      .get(`/?currency=${"INR"}&limit=9&offset=${offSet}`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        if (res.data?.results) {
          setTotalPlans(res.data?.results);
        }
        if (res.data.next) {
          setShowMoreResults(true);
          setOffSet((prev) => prev + 9);
        } else {
          setShowMoreResults(false);
          setOffSet(0);
        }
        const plansarr = res.data?.data?.plans;

        if (showMore) setMyPlansArr((prev) => [...prev, ...plansarr]);
        else setMyPlansArr(plansarr);
        setLoading(false);
        setShowMoreLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setShowMoreLoading(false);
      });
  };

  const handleShowMore = () => {
    if (props.token) {
      fetchData(true);
    }
  };

  const handleButtonClick = () => {
    setShowTailoredModal(true);
    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: "Dashboard Page",
        event_category: "Button Click",
        event_label: "Create your new travel plan now!",
        event_action: "My Trips",
      },
    });
  };

  // Single empty-state block — used for both desktop and mobile. The previous
  // implementation duplicated the markup; consolidating it keeps copy &
  // styling in sync and reduces drift.
  const renderEmptyState = () => (
    <div className={styles.dashboardEmpty}>
      <img
        src="/images/website/noplans.svg"
        alt="No trips yet"
        className={styles.dashboardEmptyImg}
        onError={(e) => {
          // Fallback to legacy CDN path if the local asset isn't present.
          e.currentTarget.src =
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/noplans.svg";
        }}
      />
      <h3 className={styles.dashboardEmptyTitle}>No trips planned yet</h3>
      <p className={styles.dashboardEmptySubtitle}>
        Tell us where you'd like to go and we'll craft a personalized itinerary
        in minutes.
      </p>
      <button
        type="button"
        onClick={() => setShowTailoredModal(true)}
        className={styles.dashboardPrimaryCta}
      >
        Start planning
      </button>
    </div>
  );

  return (
    <CheckAuthRedirect
      authRedirectPath="/"
      redirectOnFail={() => router.push("/")}
    >
      {/* `destinationPage` scope brings in the --ttw-* design tokens that the
          dashboard classes reference (ink, line, etc.). */}
      <div className={`${styles.destinationPage} ${styles.dashboardPage}`}>
        <Profile />

        <section className={styles.dashboardSection}>
          <header className={styles.dashboardHeader}>
            <h2 className={styles.dashboardTitle}>
              My Trips
              {totalPlans ? (
                <span className={styles.dashboardCount}>({totalPlans})</span>
              ) : null}
            </h2>
          </header>

          {loading ? (
            <div className={styles.dashboardGrid}>
              <ExperienceCardSkeleton />
              <ExperienceCardSkeleton />
              <ExperienceCardSkeleton />
              <ExperienceCardSkeleton />
            </div>
          ) : myPlansArr.length ? (
            <div className={styles.dashboardContent}>
              <div className={styles.dashboardGrid}>
                {myPlansArr.map((plan, i) => (
                  <ItineraryCardV2
                    key={plan?.id ?? i}
                    itinerary={plan}
                  />
                ))}
              </div>

              {showMoreResults && !showMoreLoading ? (
                <button
                  type="button"
                  onClick={handleShowMore}
                  className={styles.dashboardShowMore}
                >
                  Show more
                </button>
              ) : showMoreResults && showMoreLoading ? (
                <div className={styles.dashboardGrid}>
                  <ExperienceCardSkeleton />
                  <ExperienceCardSkeleton />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className={styles.dashboardPrimaryCta}
                >
                  Create your new travel plan now
                </button>
              )}
            </div>
          ) : (
            renderEmptyState()
          )}
        </section>
      </div>

      <TailoredFormMobileModal
        destinationType={"city-planner"}
        page_id={props.page_id}
        children_cities={props.children_cities}
        destination={props.destination}
        cities={props.cities}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
        eventDates={props.eventDates}
      />
    </CheckAuthRedirect>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToPros)(UserDashboard);
