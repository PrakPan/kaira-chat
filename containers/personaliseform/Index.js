import React, { useState, useEffect } from "react";
import Options from "./Options";
import Questions from "./questions";
import { useRouter } from "next/router";
import styled from "styled-components";
import questions from "./questions";
import Locations from "./locations/Index";
import * as authaction from "../../store/actions/auth";
import { connect } from "react-redux";
import Progress from "./progress/Index";
import SelectedCitiesContainer from "./locations/search/SelectedCitiesContainer";
import Login from "../../components/userauth/LogInModal";
import LoadingPage from "../../components/LoadingPage";
import axiostailoredinstance from "../../services/leads/tailored";
import Dates from "./materialdates/Index";
import media from "../../components/media";
import Button from "../../components/ui/button/Index";
import * as ga from "../../services/ga/Index";
import questioncontansts from "./questioncontansts";
import { CONTENT_SERVER_HOST } from "../../services/constants";

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem 0 0 0;
  box-sizing: border-box;
`;

const LoginContainer = styled.div`
  margin: 0 0.5rem;

  padding: 1rem;
  border-radius: 5px;
  @media screen and (min-width: 768px) {
    width: 40%;
    margin: auto;
  }
`;

const Question = styled.p`
  font-size: 1.5rem;
  margin: 1rem 0 1.5rem 0;
  font-weight: 800;
  text-align: center;
  @media screen and (min-width: 768px) {
    position: relative;
    font-size: 2rem;
    margin: 1rem 0 2rem 0;
  }
`;

const ButtonContainer = styled.div`
  background-color: black;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.5rem;
  padding: 0.5rem;
  position: fixed;
  bottom: 0;
  width: 100%;
  @media screen and (min-width: 768px) {
    background-color: transparent;
    width: 30%;
    left: 35%;
  }
`;

const Personaliseform = (props) => {
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");
  const WORKCATION_MIN_DURATION = 13;
  const [showPax, setShowPax] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedCities, setSelectedCities] = useState([]);
  const [toggle, setToggle] = useState(false);
  // Store answers
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [newAnswers, setNewAnswers] = useState({
    "What activities would you like?": [],
    "How many people are we expecting?": null,
    "What is the budget per person?": [],
    "For how long?": [],
    "Is this a workcation?": [],
  });
  // Store subimtted state
  const [submitted, setSubmitted] = useState(false);
  // Loader when submit clicked
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  let data = {};

  useEffect(() => {
    if ("geolocation" in navigator)
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude.toString());
        setLong(position.coords.longitude.toString());
      });

    props.checkAuthState();
    props.authSetLoginMessage("Log In to Continue");

    let search_city_selected_id_cookie = localStorage.getItem(
      "search_city_selected_id"
    );

    if (router.query.city_id) {
      let city = {
        city_id: parseInt(router.query.city_id),
        name: router.query.city_name,
        parent: router.query.city_parent,
      };
      _addCityHandler(router.query.city, city);
      _nextQuestionHandler();
    } else if (search_city_selected_id_cookie) {
      let search_city_selected_name = localStorage.getItem(
        "search_city_selected_name"
      );
      let search_city_selected_parent = localStorage.getItem(
        "search_city_selected_parent"
      );
      localStorage.removeItem("search_city_selected_id");
      let city = {
        city_id: parseInt(search_city_selected_id_cookie),
        name: search_city_selected_name,
        parent: search_city_selected_parent,
      };
      _addCityHandler(search_city_selected_id_cookie, city);
      _nextQuestionHandler();
    }

    window.scrollTo(0, 0);
  }, []);

  const _checkCityPresent = (city) => {
    for (var i = 0; i < selectedCities.length; i++) {
      if (selectedCities[i].city_id === city.city_id) return true;
    }
    return false;
  };

  const _removeCityHandler = (city_id) => {
    if (selectedCities.length === 1) {
      setSelectedCities([]);
      setQuestionIndex(0);
    } else {
      let index = null;
      for (var i = 0; i < selectedCities.length; i++) {
        if (selectedCities[i].city_id == city_id) {
          index = i;
        }
      }
      setSelectedCities(
        selectedCities.filter((city) => city.city_id != city_id)
      );
    }
  };

  const _addCityHandler = (city_id, city) => {
    // check if city present
    if (_checkCityPresent(city)) {
    } else {
      {
        process.env.NODE_ENV === "production" &&
          !CONTENT_SERVER_HOST.includes("dev") &&
          ga.event({
            action: "tailored-form-locationsselected",
            params: {
              location: city.name,
            },
          });
      }
      setSelectedCities((prev) => [...prev, city]);
    }
  };

  const _nextQuestionHandler = (start_date, end_date) => {
    {
      process.env.NODE_ENV === "production" &&
        !CONTENT_SERVER_HOST.includes("dev") &&
        ga.event({
          action: "TTForm-next-" + Questions.questions[questionIndex],
          params: {
            question: "",
          },
        });
    }
    let duration;
    if (questionIndex === 4) {
      duration = endDate.diff(startDate, "days");
      if (duration > WORKCATION_MIN_DURATION)
        setQuestionIndex(questionIndex + 1);
      else setQuestionIndex(questionIndex + 2);
    } else {
      if (questionIndex === 2) setShowPax(false);
      setQuestionIndex(questionIndex + 1);
    }
    window.scrollTo(0, 0);
  };

  const _prevQuestionHandler = () => {
    let duration;
    if (questionIndex === 6) {
      duration = endDate.diff(startDate, "days");
      if (duration > WORKCATION_MIN_DURATION)
        setQuestionIndex(questionIndex - 1);
      else setQuestionIndex(questionIndex - 2);
    } else {
      setQuestionIndex(questionIndex - 1);
    }
    window.scrollTo(0, 0);
  };

  const _setDatesHandler = (start_date, end_date) => {
    setStartDate(start_date);
    setEndDate(end_date);
  };

  const _generateData = () => {
    {
      process.env.NODE_ENV === "production" &&
        !CONTENT_SERVER_HOST.includes("dev") &&
        ga.event({
          action: "TTForm-login-success",
          params: {
            question: "",
          },
        });
    }

    let budget_to_send = "";
    let extra_data = "";
    let filters = [];
    let grouptype = "";
    let number_of_adults;
    let number_of_children;
    let number_of_infants;
    let start_date;
    let end_date;
    let is_workcation = false;
    if (newAnswers[questioncontansts.WORKCATION])
      if (newAnswers[questioncontansts.WORKCATION][0]) is_workcation = true;
    if (
      !newAnswers[questioncontansts.PAX]["index"] &&
      newAnswers[questioncontansts.PAX]["index"] !== 0
    )
      grouptype = "";
    else {
      grouptype =
        questions.options[2][newAnswers[questioncontansts.PAX]["index"]]
          .heading;
      if (newAnswers[questioncontansts.PAX]["index"] === 0) {
        number_of_adults = 1;
        number_of_children = 0;
        number_of_infants = 0;
      } else if (newAnswers[questioncontansts.PAX]["index"] === 1) {
        number_of_adults = 2;
        number_of_children = 0;
        number_of_infants = 0;
      } else {
        number_of_adults =
          newAnswers[questioncontansts.PAX]["number_of_adults"];
        number_of_children =
          newAnswers[questioncontansts.PAX]["number_of_children"];
        number_of_infants =
          newAnswers[questioncontansts.PAX]["number_of_infants"];
      }
    }
    if (!startDate && !endDate) {
      start_date = null;
      end_date = null;
    } else {
      start_date = startDate.format("YYYY-MM-DD");
      end_date = endDate.format("YYYY-MM-DD");
    }
    if (!newAnswers[questioncontansts.BUDGET].length) budget = "";
    else {
      budget_to_send =
        questions.options[3][newAnswers[questioncontansts.BUDGET][0]].heading;
    }

    // Generate experience filters array
    for (let i = 0; i < newAnswers[questioncontansts.FILTERS].length; i++) {
      filters.push(
        questions.options[1][newAnswers[questioncontansts.FILTERS][i]].heading
      );
    }
    const cityids = [];
    const citynames = [];
    let state_ids = [];
    for (var i = 0; i < selectedCities.length; i++) {
      if (selectedCities[i].type === "State")
        state_ids.push(parseInt(selectedCities[i].city_id));
      else {
        cityids.push(parseInt(selectedCities[i].city_id));
        citynames.push(selectedCities[i].name);
      }
    }

    data = {
      locations: citynames,
      experience_filters_selected: filters,
      budget: budget_to_send,
      extra_data: extra_data,
      city_id: cityids,
      state_id: state_ids,
      group_type: grouptype,
      number_of_adults: number_of_adults,
      number_of_children: number_of_children,
      number_of_infants: number_of_infants,
      start_date: start_date,
      end_date: end_date,

      user_location: {
        lat: lat,
        long: long,
      },
    };
    if (is_workcation) data = { ...data, theme_category: "Workcation" };
    axiostailoredinstance
      .post("", data, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((response) => {
        setSubmitted(true);
        localStorage.removeItem("MyPlans");

        window.scrollTo(0, 0);
        if (!response.data.auto_itinerary_created) {
          router.push("/thank-you");
        } else {
          {
            process.env.NODE_ENV === "production" &&
              !CONTENT_SERVER_HOST.includes("dev") &&
              ga.event({ action: "TTForm-success", params: { key: "" } });
          }

          // setTimeout(function () {
            router.push("/itinerary/" + response.data.itinerary.itinerary_id);
          // }, 6000);
        }
      })
      .catch((err) => {
        router.push("/thank-you");
      });
  };

  let option = null;
  // Show location field for 1st question
  if (Questions.questions[questionIndex] === questioncontansts.LOCATIONS) {
    option = (
      <Locations
        questionIndex={questionIndex}
        selectedCities={selectedCities}
        _removeCityHandler={(city) => _removeCityHandler(city)}
        _addCityHandler={(city_id, city) => _addCityHandler(city_id, city)}
        setSelectedCities={setSelectedCities}
      ></Locations>
    );
  } else if (
    Questions.questions[questionIndex] === questioncontansts.DURATION
  ) {
    option = (
      <Dates
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        _setDatesHandler={_setDatesHandler}
        questionIndex={questionIndex}
      ></Dates>
    );
  }

  // Show contact form
  else if (questionIndex === 6) {
    if (
      !props.token ||
      (props.token && !props.phone) ||
      (props.token && props.phone === "null")
    )
      option = (
        <LoginContainer className="border-thin">
          <Login loginmessage="Log In to Continue" noclose></Login>
        </LoginContainer>
      );
    else option = <div></div>;
  } else
    option = (
      <Options
        setNewAnswers={setNewAnswers}
        newAnswers={newAnswers}
        showPax={showPax}
        setShowPax={setShowPax}
        toggle={toggle}
        setToggle={setToggle}
        questionIndex={questionIndex}
        nextQuestionHandler={_nextQuestionHandler}
      ></Options>
    );

  let NextArrowJSX = (
    <Button
      padding="0.2rem"
      width="100%"
      borderColor="#f7e700"
      bgColor="#f7e700"
      color="black"
      borderRadius="2rem"
      onclick={_nextQuestionHandler}
      style={{ margin: "0" }}
    >
      Next
    </Button>
  );

  if (
    questionIndex > 5 ||
    (Questions.questions[questionIndex] === questioncontansts.BUDGET &&
      !newAnswers[questioncontansts.BUDGET].length) ||
    (Questions.questions[questionIndex] === questioncontansts.DURATION &&
      endDate == null) ||
    (Questions.questions[questionIndex] === questioncontansts.PAX &&
      !newAnswers[questioncontansts.PAX])
  ) {
    NextArrowJSX = null;
  }

  useEffect(() => {
    if (
      questionIndex === 6 &&
      props.token &&
      !submitted &&
      props.phone &&
      props.phone !== "null"
    ) {
      _generateData();
    }
    if (props.questionIndex === 1)
      localStorage.removeItem("search_city_selected_id");
    if (
      (props.token && !props.phone) ||
      (props.token && props.phone === "null")
    )
      props.authSetLoginMessage("Confirm your phone number");
  }, [props.token, questionIndex, props.phone]);

  return (
    <Container>
      {isPageWide ? (
        <Progress questionIndex={questionIndex}></Progress>
      ) : questionIndex ? (
        <Progress questionIndex={questionIndex}></Progress>
      ) : null}

      {isPageWide ? (
        <div>
          <SelectedCitiesContainer
            questionIndex={questionIndex}
            goToStart={() => setQuestionIndex(0)}
            selectedCities={selectedCities}
            _removeCityHandler={_removeCityHandler}
          ></SelectedCitiesContainer>
        </div>
      ) : questionIndex ? (
        <SelectedCitiesContainer
          questionIndex={questionIndex}
          goToStart={() => setQuestionIndex(0)}
          selectedCities={selectedCities}
          _removeCityHandler={_removeCityHandler}
        ></SelectedCitiesContainer>
      ) : null}

      {questionIndex ? (
        <Question className="">
          {Questions.questions[questionIndex]}
        </Question>
      ) : isPageWide ? (
        <Question className="">
          {Questions.questions[questionIndex]}
        </Question>
      ) : null}

      <div style={{ minHeight: "24vw", paddingBottom: "0rem" }}>{option}</div>

      <div style={{ display: questionIndex === 0 ? "initial" : "none" }}></div>

      {questionIndex || selectedCities.length ? (
        <ButtonContainer>
          {questionIndex <= 5 && questionIndex != 0 && questionIndex != 7 ? (
            <Button
              padding="0.2rem"
              borderColor="#f7e700"
              borderRadius="2rem"
              onclick={_prevQuestionHandler}
              bgColor="#f7e700"
              color="black"
              width="100%"
            >
              Previous
            </Button>
          ) : (
            <div></div>
          )}
          {NextArrowJSX}
        </ButtonContainer>
      ) : null}

      {!questionIndex && !selectedCities.length ? (
        <ButtonContainer style={{ gridTemplateColumns: "1fr" }}>
          <Button
            padding="0.2rem"
            borderColor="#f7e700"
            borderRadius="2rem"
            onclick={_nextQuestionHandler}
            bgColor="#f7e700"
            fontWeight="500"
            color="black"
            width="100%"
            bold
          >
            Don't know where to go
          </Button>
        </ButtonContainer>
      ) : null}

      {questionIndex === 6 &&
      props.token &&
      props.phone &&
      props.phone !== "null" ? (
        <LoadingPage></LoadingPage>
      ) : null}
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    showLogin: state.auth.showLogin,
    token: state.auth.token,
    phone: state.auth.phone,
    loadingsocial: state.auth.loadingsocial,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authShowLogin: () => dispatch(authaction.authShowLogin()),
    authCloseLogin: () => dispatch(authaction.authCloseLogin()),
    checkAuthState: () => dispatch(authaction.checkAuthState()),
    authSetLoginMessage: (message) =>
      dispatch(authaction.authSetLoginMessage(message)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Personaliseform);
