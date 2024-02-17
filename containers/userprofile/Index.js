import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axiomyplansinstance from "../../services/sales/MyPlans";
import styled from "styled-components";
import CheckAuthRedirect from "../../components/HOC/CheckAuthRedirect";
import Heading from "../../components/newheading/heading/Index";
import Profile from "./Profile";
import media from "../../components/media";
import ImageLoader from "../../components/ImageLoader";
import { useRouter } from "next/router";
import Spinner from "../../components/Spinner";
import openTailoredModal from "../../services/openTailoredModal";
import ExperienceCard from "../../components/cards/newitinerarycard-main/ExperienceCard";
import ExperienceCardSkeleton from "../../components/cards/newitinerarycard-main/ExperienceCardSkeleton";

const Container = styled.div`
  width: 100%;
  margin: 12vh auto;

  @media screen and (min-width: 768px) {
    width: 70%;
    padding-top: 10vh;
    margin: auto;
  }
`;

const ContentContainer = styled.div`
  border-radius: 5px;
  padding: 0rem;
  margin: 2rem 0;
  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;

const Illustration = styled.img`
  width: 40%;
  margin: 7.5vh auto;
  display: block;

  @media screen and (min-width: 768px) {
  }
`;

const NoPlans = styled.p`
  font-weight: 300;
  font-size: 1.25rem;
  letter-spacing: 1px;
  text-align: center;
  margin: 0 0.5rem;
  color: black;
  @media screen and (min-width: 768px) {
    margin: 0;
    text-align: left;
  }
`;

const UserDashboard = (props) => {
  const [myPlansArr, setMyPlansArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPlans, setTotalPlans] = useState(null);
  const [showMoreResults, setShowMoreResults] = useState(false);
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  const [offSet, setOffSet] = useState(0);
  let isPageWide = media("(min-width: 768px)");
  let router = useRouter();

  const fetchData = (showMore = false) => {
    if (showMore) setShowMoreLoading(true);
    axiomyplansinstance
      .get(`/?limit=9&offset=${offSet}`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        if (res.data.count) setTotalPlans(res.data.count);
        if (res.data.next) {
          setShowMoreResults(true);
          setOffSet((prev) => prev + 9);
        } else {
          setShowMoreResults(false);
          setShowMoreLoading(false);
          setOffSet(0);
        }
        const plansarr = res.data.results;

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

  useEffect(() => {
    window.scrollTo(0, 0);
    if (props.token) {
      fetchData();
    }
  }, [props.token]);

  const handleShowMore = () => {
    if (props.token) {
      fetchData(true);
    }
  };

  return (
    <CheckAuthRedirect
      authRedirectPath="/"
      redirectOnFail={() => router.push("/")}
    >
      <Container>
        <ContentContainer>
          <Profile></Profile>
        </ContentContainer>
        <ContentContainer className="border-thi mb-5">
          <div style={{ display: "flex" }}>
            {myPlansArr.length ? (
              <Heading align="left" margin="0 0 2rem 0" bold noline>
                My Plans {totalPlans && `(${totalPlans})`}
              </Heading>
            ) : (
              <Heading align="left" margin="0" bold noline>
                My Plans
              </Heading>
            )}
            {loading ? <Spinner></Spinner> : null}
          </div>

          {isPageWide && !myPlansArr.length && !loading ? (
            <NoPlans className="font-lexend">
              You don't have any plans yet.{" "}
              <a
                onClick={() => openTailoredModal(router)}
                style={{ color: "black", textDecoration: "none !important" }}
              >
                Start Planning
              </a>
            </NoPlans>
          ) : null}

          {loading ? (
            <div className="grid justify-items-center lg:grid-cols-3 md:grid-cols-3 gap-4 px-3 md:px-0 lg:px-0">
              <ExperienceCardSkeleton />
              <ExperienceCardSkeleton />
              <ExperienceCardSkeleton />
            </div>
          ) : myPlansArr.length ? (
            <div className="flex flex-col items-center gap-3 mb-5">
              <div className="grid lg:grid-cols-3 md:grid-cols-3 gap-4 px-3 md:px-0 lg:px-0">
                {myPlansArr.map((plan, i) => (
                  <ExperienceCard
                    key={plan?.short_text}
                    data={plan}
                    myplan={props?.myplan}
                    hardcoded={plan?.payment_info ? true : false}
                    filter={
                      plan?.experience_filters
                        ? plan?.experience_filters?.length
                          ? plan?.experience_filters[0]
                          : null
                        : null
                    }
                    rating={plan?.rating}
                    slug={plan?.slug}
                    id={plan?.id}
                    budget={plan?.budget}
                    group_type={plan?.group_type}
                    number_of_adults={plan?.number_of_adults}
                    text={plan?.short_text}
                    experience={plan?.name}
                    duration={
                      plan?.duration
                        ? plan.duration
                        : plan?.duration_number && plan?.duration_unit
                        ? plan.duration_number + " " + plan.duration_unit
                        : null
                    }
                    location={plan["experience_region"]}
                    starting_cost={
                      plan?.payment_info
                        ? plan?.payment_info?.per_person_total_cost
                          ? plan?.payment_info?.per_person_total_cost
                          : plan?.starting_price
                        : plan?.starting_price
                    }
                    images={plan?.images}
                    locations={plan?.itinerary_locations}
                  ></ExperienceCard>
                ))}
              </div>
              {showMoreResults && !showMoreLoading ? (
                <button
                  onClick={handleShowMore}
                  className="border-1 border-black rounded-lg py-2 px-5 text-sm hover:text-white hover:bg-black transition ease-in-out duration-500"
                >
                  Show More
                </button>
              ) : showMoreResults && showMoreLoading ? (
                <div className="w-full grid justify-items-center lg:grid-cols-3 md:grid-cols-3 gap-4 px-3 md:px-0 lg:px-0">
                  <ExperienceCardSkeleton />
                  <ExperienceCardSkeleton />
                  <ExperienceCardSkeleton />
                </div>
              ) : null}
            </div>
          ) : (
            <ImageLoader
              width="40%"
              widthmobile="40%"
              margin="7.5vh auto"
              url={"media/website/noplans.svg"}
            ></ImageLoader>
          )}

          {!isPageWide && !myPlansArr.length && !loading ? (
            <NoPlans className="font-lexend">
              You don't have any plans yet.{" "}
            </NoPlans>
          ) : null}

          {!isPageWide && !myPlansArr.length && !loading ? (
            <a
              onClick={() => openTailoredModal(router)}
              className="font-nunito"
              style={{
                color: "black",
                fontWeight: "300",
                display: "block",
                margin: "0.5rem auto",
                textDecoration: "none !important",
                textAlign: "center",
                fontSize: "1.25rem",
                letterSpacing: "1px",
              }}
            >
              Start Planning
            </a>
          ) : null}
        </ContentContainer>
      </Container>
    </CheckAuthRedirect>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
  };
};
export default connect(mapStateToPros)(UserDashboard);
