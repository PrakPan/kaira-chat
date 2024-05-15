import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faSearch,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Filters from "./Filters";

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: max-content auto;
`;

const morepois = [
  {
    element: "AD",
    heading: "Half Day Cycle Tour",
    text: "Tour is a spirited and satiating plunge, straight into the deep-end of Old Delhi (Shahjahanabad). At the peak of Emperor Shah Jahan’s rule, his loyal noblemen (Emirs) controlled the social, cultural and economic affairs of the great metropolis of Shajahanabad .",
    image: "media/ruby/cycletour.jpg",
    notes: {
      Cost: "Rs 2000",
    },
  },
  {
    element: "AD",
    heading: "Old Delhi Walk",
    text: "Unlike the rest of Delhi, Old Delhi still mantains the charm of days past. You'll find street hawkers selling delicious snacks and small shops selling everything from masala (spices) to clothes and perfumes which they have been doing for generations now. The best way to explore Old Delhi is on foot and the following route is perhaps the best and easiest way to make sense of the chaotic streets of Old Delhi.",
    image: "media/ruby/annie-spratt-A9D4qiTJtoQ-unsplash.jpg",
    notes: {
      Cost: "Free",
    },
  },
  {
    element: "AD",
    heading: "Bollywood Dance Class",
    text: "There you'll learn some popular moves on Indian dance songs and they'll even make a dance video with you and the other participants in traditional Indian attires.",
    image: "media/ruby/pavan-gupta-_HzlOHmboSk-unsplash.jpg",
    notes: {
      Cost: "Rs 2000",
    },
  },

  {
    element: "AD",
    heading: "Museum of Modern Art",
    text: "This quiet museum houses an excellent collection of modern Indian art but is rarely crowded.",
    image: "media/ruby/modernart",
    notes: {
      Cost: "Free",
    },
  },
  {
    element: "AD",
    heading: "India Gate",
    text: "The All India War Memorial, also referred to as the India Gate is an aweinspiring monument often compared to Arch de Tromphe in France. Believe it or not, doing this is one of the most Delhi things to do and every one in Delhi has been on a picnic here (Including our team) at least once.",
    image: "media/ruby/indiagate.jpg",
    notes: {
      Cost: "Rs Free",
    },
  },
  {
    element: "AD",
    heading: "Bangla Sahib",
    text: "Gurudwara Bangla Sahib is one of the most prominent Sikh gurdwara, or Sikh house of worship, in Delhi, India, and known for its association with the eighth Sikh Guru, Guru Har Krishan, as well as the holy river inside its complex, known as the Sarovor",
    image: "media/ruby/Screen Shot 2020-09-22 at 2.15.57 AM.png",
    notes: {
      Cost: "Rs Free",
    },
  },
  {
    element: "AD",
    heading: "Sanjay Van",
    text: "Sanjay Van is a sprawling city forest area near Vasant Kunj and Mehrauli in Delhi, India. It is spread over an area of 443 acres. It is one of the most thickly wooded areas of the city’s green lungs.",
    image: "media/ruby/Screen Shot 2020-09-22 at 2.24.41 AM.png",
    notes: {
      Cost: "Rs 2000",
    },
  },
];

const VerticalElementContainer = styled.div`
  width: 100%;
  color: black !important;
  text-align: center;
`;

const VerticalPoiName = styled.p`
  font-size: ${(props) => props.theme.fontsizes.desktop.text.default};
  font-weight: 600;
  margin: 0.5rem 0;
  &:hover {
  }
`;

const VerticalImgContainer = styled.div`
  width: 7vw;
  margin: auto;
  height: 7vw;
  border-radius: 50%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  &:hover {
    cursor: pointer;
  }
`;

const Selected = styled.div`
  width: max-content;
`;

const Edit = (props) => {
  const [morePois, setMorePois] = useState(morepois);

  let MorePoisArr = [];

  for (var i = 0; i < morePois.length; i++) {
    if (morePois[i].heading === "Bollywood Dance Class") MorePoisArr.push();
    else {
      MorePoisArr.push();
    }
    if (i === morePois.length - 1)
      MorePoisArr.push(<div style={{ height: "20vh" }}></div>);
  }

  setMorePois([
    {
      element: "AB",
      heading: "Resort Whispering Pines, Agra",
      text: "Amenities: Breakfast included, Wifi, Personal washroom, Linen, Basic toiletries, Spa, Swimming Pool",
      image:
        "media/ruby/Accommodation images/alexander-kaunas-67-sOi7mVIk-unsplash.jpg",
      notes: {
        Cost: "Rs 2800",
      },
    },
    {
      element: "AB",
      heading: "Littl Kochi Beach Cottage, Kochi",
      text: "Amenities: Breakfast included, Wifi, Personal washroom, Linen, Basic toiletries.",
      image:
        "media/ruby/Accommodation images/chaitanya-maheshwari-NpjE6Q69RgI-unsplash.jpg",
      notes: {
        Cost: "Rs 1900",
      },
    },
    {
      element: "AB",
      heading: "Zostel, Jaipur",
      text: "Amenities: Breakfast included, Wifi, Personal washroom, Linen, Basic toiletries.",
      image:
        "media/ruby/Accommodation images/marcus-loke-WQJvWU_HZFo-unsplash.jpg",
      notes: {
        Cost: "Rs 800",
      },
    },
    {
      element: "AB",
      heading: "Lake View Camps, Udaipur",
      text: "Amenities: Breakfast included, Shared Washroom, Linen, Basic toiletries.",
      image: "media/ruby/Accommodation images/pexels-snapwire-699558.jpg",
      notes: {
        Cost: "Rs 1100",
      },
    },
  ]);

  return (
    <Modal
      show={true}
      size="xl"
      onHide={props.hideModalHandler}
      className="edit-modal"
      style={{ position: "absolute" }}
    >
      <Modal.Body>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "20% 70% 10%",
            gridGap: "1rem",
          }}
        >
          <div>
            <div
              className="font-nunito"
              style={{ fontWeight: "100", fontSize: "0.75rem" }}
            >
              CURRENTLY EXPLORING
            </div>
            <div
              className="font-opensan"
              style={{ fontWeight: "600", fontSize: "1.25rem" }}
            >
              Delhi
              <FontAwesomeIcon
                icon={faCaretDown}
                style={{ marginLeft: "0.5rem" }}
              ></FontAwesomeIcon>
            </div>
          </div>
          <InputContainer>
            <div
              style={{
                borderStyle: "solid none solid solid",
                borderColor: "#E4E4E4",
                borderRadius: "5px 0 0 5px ",
                padding: "0.5rem",
                borderWidth: "1px",
              }}
            >
              <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            </div>
            <input
              type="text"
              placeholder="Search POIs"
              style={{
                width: "100%",
                borderRadius: " 0 5px 5px 0",
                borderColor: "#E4E4E4",
                padding: "0.5rem",
                borderStyle: "solid solid solid none",
                borderWidth: "1px",
              }}
            ></input>
          </InputContainer>
          <div style={{ textAlign: "right", paddingRight: "2rem" }}>
            <FontAwesomeIcon
              style={{ fontSize: "1.5rem" }}
              icon={faTimes}
              onClick={props.hideModalHandler}
            ></FontAwesomeIcon>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "20% 70% 10%",
            gridGap: "1rem",
            marginTop: "1rem",
            maxHeight: "65vh",
            overflow: "scroll",
          }}
        >
          <div style={{ marginRight: "12px" }}>
            <Filters></Filters>
          </div>
          <div
            style={{
              padding: "0 1rem",
              borderStyle: "none solid none solid",
              borderWidth: "1px",
              borderColor: "#E4E4E4",
            }}
          >
            {MorePoisArr}
          </div>
        </div>
        <hr></hr>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            width: "80%",
            margin: "auto",
            gridGap: "3rem",
          }}
        >
          <VerticalElementContainer>
            <VerticalImgContainer
              className="center-div"
              onClick={() => _setSelectedStateHandler("one")}
              style={{ backgroundImage: "url(" + dayPois[0].image + ")" }}
              onMouseEnter={() => setHoverState({ ...hoverState, one: true })}
              onMouseLeave={() => setHoverState({ ...hoverState, one: false })}
            >
              {selectedState.one ? (
                <div
                  style={{
                    backgroundColor: "rgba(247, 231, 0, 0.6)",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                  }}
                  className="center-div"
                >
                  <Selected>
                    <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                  </Selected>
                </div>
              ) : null}
              {hoverState.one && !selectedState.one ? (
                <div
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                  }}
                ></div>
              ) : null}
            </VerticalImgContainer>
            <div style={{ padding: "0 1rem" }}>
              <VerticalPoiName className="">
                <b>{dayPois[0].heading}</b>
              </VerticalPoiName>
            </div>
          </VerticalElementContainer>
          <VerticalElementContainer>
            <VerticalImgContainer
              className="center-div"
              onClick={() => _setSelectedStateHandler("two")}
              style={{ backgroundImage: "url(" + dayPois[1].image + ")" }}
              onMouseEnter={() => setHoverState({ ...hoverState, two: true })}
              onMouseLeave={() => setHoverState({ ...hoverState, two: false })}
            >
              {selectedState.two ? (
                <div
                  style={{
                    backgroundColor: "rgba(247, 231, 0, 0.6)",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                  }}
                  className="center-div"
                >
                  <Selected>
                    <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                  </Selected>
                </div>
              ) : null}
              {hoverState.two && !selectedState.two ? (
                <div
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                  }}
                ></div>
              ) : null}
            </VerticalImgContainer>
            <div style={{ padding: "0 1rem" }}>
              <VerticalPoiName className="">
                <b>{dayPois[1].heading}</b>
              </VerticalPoiName>
            </div>
          </VerticalElementContainer>
          <VerticalElementContainer>
            <VerticalImgContainer
              className="center-div"
              onClick={() => _setSelectedStateHandler("three")}
              style={{ backgroundImage: "url(" + dayPois[2].image + ")" }}
              onMouseEnter={() => setHoverState({ ...hoverState, three: true })}
              onMouseLeave={() => setHoverState({ ...hoverState, one: false })}
            >
              {selectedState.three ? (
                <div
                  style={{
                    backgroundColor: "rgba(247, 231, 0, 0.6)",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                  }}
                  className="center-div"
                >
                  <Selected>
                    <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                  </Selected>
                </div>
              ) : null}
              {hoverState.three && !selectedState.three ? (
                <div
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                  }}
                ></div>
              ) : null}
            </VerticalImgContainer>
            <div style={{ padding: "0 1rem" }}>
              <VerticalPoiName className="">
                <b>{dayPois[2].heading}</b>
              </VerticalPoiName>
            </div>
          </VerticalElementContainer>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Edit;
