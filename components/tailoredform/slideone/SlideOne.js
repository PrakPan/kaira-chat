import { useState } from "react";
import styled from "styled-components";
import Destinations from "./destinations/Index";
import Preferences from "../slidetwo/preferences/Index";
import AirbnbCalendar from "../../calendar";
import { StyledFigmaBox } from "../utils/ui";
import ModalWithBackdrop from "../../ui/ModalWithBackdrop";
import { Body1M_16, Body2M_14, Body2R_14 } from "../../new-ui/Body";
import useMediaQuery from "../../media";
import BottomModal from "../../ui/LowerModal";
import AirbnbCalendarMobile from "../../calendar/MobileCalendar";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setAnytimeDate, setCalendarDates, setDateType, setFixedDate, setFlexibleDate } from "../../../store/actions/slideOneActions";

const Container = styled.div`
  color: black;
  width: 100%;
  @media screen and (min-width: 768px) {
  }
    display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Section = styled.div`
`;

const formatShortDate = (date) => {
  if (!date) return '';
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }).toLowerCase(); // "sep"
  return `${day} ${month}`;
};


const SlideOne = (props) => {
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [showCalendar, setShowCalendar] = useState(false);
  const date=useSelector((state)=>state.tailoredInfoReducer.slideOne.date);
  const valueStart = useSelector((state) => state.tailoredInfoReducer.slideOne.date.end_date)
  const valueEnd = useSelector((state) => state.tailoredInfoReducer.slideOne.date.start_date)
  const dispatch = useDispatch();
  const handleOnCalenderApplyDates = (values) => {
    console.log("date type is: ",date.type)
    if(date.type=="fixed"){
          dispatch(setFixedDate(values.start, values.end));
    }
    else if(date.type=="flexible"){
      dispatch(setFlexibleDate(values.month,'2025',values.duration));
    }
    else{
      dispatch(setAnytimeDate(values.duration))
    }
  }
  const CITIES = null;
  const SetDateType=(value)=>{
    dispatch(setDateType(value))
  }
  return (
    <Container>
      <Section>
        <Destinations
          startingLocation={props.startingLocation}
          tailoredFormModal={props.tailoredFormModal}
          initialInputId={props.initialInputId}
          setStartingLocation={props.setStartingLocation}
          showSearchStarting={props.showSearchStarting}
          setDestination={props.setDestination}
          setShowSearchStarting={props.setShowSearchStarting}
          showCities={props.showCities}
          setShowCities={props.setShowCities}
          destination={props.destination}
          CITIES={props.cities ? props.cities : CITIES}
          selectedCities={props.selectedCities}
          eventDates={props.eventDates}
        ></Destinations>
      </Section>

      <Section>
        {/* <AirbnbCalendar /> */}
        <div>
          <Body2R_14>When</Body2R_14>
          <div className="relative w-full">
            <StyledFigmaBox
              value={
                date.type==="fixed"?(valueStart && valueEnd
                  ? `${formatShortDate(valueStart)} - ${formatShortDate(valueEnd)}`
                  : ""):date.type==="flexible"?(new Date(date.month).toLocaleString("default", { month: "long" })+", "+date.duration+" days"):date.duration+" days"
              }
              placeholder="Select dates"
              className={`cursor-pointer w-full pr-10 ${!(valueStart && valueEnd) && "text-[#ACACAC] text-[14px]"
                }`}
              onClick={() => setShowCalendar(true)}
              readOnly
            />
            <Image
              src="/calendar.svg"
              width={20}
              height={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              alt="calendar"
            />
          </div>

        </div>
        <div
          className="hover-pointer"
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            marginLeft: "2px",
          }}
        >
          {props.eventDates && props.destination ? (
            <div className="font-lexend" style={{ fontSize: "0.8rem" }}>
              The dates for this event are fixed and cannot be changed!
            </div>
          ) : (
            <>

            </>
          )}
        </div>
      </Section>

      <Section>
        <Body1M_16>Choose your experience</Body1M_16>
        <div className="mt-[12px]">
          <Preferences
            tailoredFormModal={props.tailoredFormModal}
            selectedPreferences={props.selectedPreferences}
            setSelectedPreferences={props.setSelectedPreferences}
          ></Preferences>
        </div>
      </Section>
      {isDesktop ? <ModalWithBackdrop
        centered
        show={showCalendar}
        mobileWidth="100%"
        backdrop
        closeIcon={true}
        onHide={() => setShowCalendar(false)}
        borderRadius={"12px"}
        animation={false}
        backdropStyle={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(1px)" }} // <- add this
      >
        <AirbnbCalendar
          valueStart={valueStart}
          valueEnd={valueEnd}
          onChangeDate={handleOnCalenderApplyDates}
          setShowCalendar={setShowCalendar}
          setDateType={SetDateType}
          dateType={date.type}
          date={date}
        />
      </ModalWithBackdrop> : <>
        <BottomModal
          show={showCalendar}
          onHide={() => setShowCalendar(false)}
          width="100%"
          height="max-content"
        >
          <AirbnbCalendarMobile
            valueStart={valueStart}
            valueEnd={valueEnd}
            onChangeDate={handleOnCalenderApplyDates}
            setShowCalendar={setShowCalendar}
          />
        </BottomModal>
      </>}
    </Container>
  );
};

export default SlideOne;
