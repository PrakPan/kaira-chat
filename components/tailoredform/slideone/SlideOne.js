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
import { getHumanDate } from "../../../services/getHumanDate";
import { togglePreference } from "../../../store/actions/slideOneActions";
import { months } from "../../calendar/utils";

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
  const date = useSelector((state) => state.tailoredInfoReducer.slideOne.date);
  const valueStart = useSelector((state) => state.tailoredInfoReducer.slideOne.date.start_date)
  const valueEnd = useSelector((state) => state.tailoredInfoReducer.slideOne.date.end_date)
  const dispatch = useDispatch();
  const handleOnCalenderApplyDates = (values) => {
  if (values.dateType == "fixed") {
    const formatDateForAPI = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    dispatch(setFixedDate(
      formatDateForAPI(values.start), 
      formatDateForAPI(values.end)
    ));
  }
  else if (values.dateType == "flexible") {
    dispatch(setFlexibleDate(values.month.getMonth()+1, values.month.getFullYear(), values.duration));
  }
  else {
    dispatch(setAnytimeDate(values.duration))
  }
};
  const selectedPreferences = useSelector((state) => state.tailoredInfoReducer.slideOne.selectedPreferences)||[];
  const setSelectedPrefrences=(value)=>{
    dispatch(togglePreference(value));
  }
  const CITIES = null;
  const SetDateType = (value) => {
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
          errors={props.errors}
        ></Destinations>
      </Section>

      <Section>
        <div>
          <Body2R_14 className="mb-[4px]">When</Body2R_14>
          <div className="relative w-full">
            <StyledFigmaBox
              value={
  date.type === "fixed" ? (valueStart && valueEnd
    ? `${getHumanDate(
        typeof valueStart === 'string' 
          ? valueStart.split("-").reverse().join("/")
          : valueStart.toLocaleDateString("en-CA").split("-").reverse().join("/")
      )} - ${getHumanDate(
        typeof valueEnd === 'string'
          ? valueEnd.split("-").reverse().join("/")
          : valueEnd.toLocaleDateString("en-CA").split("-").reverse().join("/")
      )}`
    : "") 
    : date.type === "flexible" 
      ? `${months[date.month - 1]} ${date.year}, ${date.duration} days` 
      : date.duration + " days"
}
              placeholder="Select dates"
              className={`cursor-pointer w-full pr-10  Body2M_14`}
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
          {props.errors.when !== null && <p className="mt-1 text-sm text-red-600 font-medium">
            {props.errors.when}
          </p>}
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
            <div className="" style={{ fontSize: "0.8rem" }}>
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
            selectedPreferences={selectedPreferences}
            setSelectedPreferences={setSelectedPrefrences}
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
        paddingX="20px"
        paddingY="20px"
        parentClasses={'border-md border-solid border-primary-yellow'}
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
          paddingX="20px"
          paddingY="20px"
        >
          <AirbnbCalendarMobile
            valueStart={valueStart}
            valueEnd={valueEnd}
            onChangeDate={handleOnCalenderApplyDates}
            setShowCalendar={setShowCalendar}
            setDateType={SetDateType}
            dateType={date.type}
            date={date}
          />
        </BottomModal>
      </>}
    </Container>
  );
};

export default SlideOne;
