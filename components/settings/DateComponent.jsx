import { useState } from "react";
import { StyledFigmaBox } from "../tailoredform/utils/ui";
import { getHumanDate } from "../../services/getHumanDate";
import Image from "next/image";
import { useSelector } from "react-redux";
import ModalWithBackdrop from "../ui/ModalWithBackdrop";
import AirbnbCalendar from "../calendar";
import BottomModal from "../ui/LowerModal";
import AirbnbCalendarMobile from "../calendar/MobileCalendar";
import useMediaQuery from "../../hooks/useMedia";
const DateComponent = (props) => {
  const isDesktop = useMediaQuery("(min-width:767px)");
  const handleOnCalenderApplyDates = (values) => {
    props.handleApplyDates(values);
  }
  const [showCalendar, setShowCalendar] = useState(false);
  const SetDateType = (value) => {
    props.setDate({
      ...props.date,
      type: value
    });
  }
  return (
    <div>
        <div>
        <div>
          <div className="Body1M_16  mb-[4px]">{props.settings ? 'Dates' : "When"}</div>
          <div className="relative w-full">
            <StyledFigmaBox
              value={
                props.date.type === "fixed" ? (props.date.start_date && props.date.end_date
                  ? `${getHumanDate(props.date.start_date.toLocaleDateString("en-CA").split("-").reverse().join("/"))} - ${getHumanDate(props.date.end_date.toLocaleDateString("en-CA").split("-").reverse().join("/"))}`
                  : "") : props.date.type === "flexible" ? (new Date(props.date.month).toLocaleString("default", { month: "long" }) + ", " + props.date.duration + " days") : props.date.duration + " days"
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
        </div>
      </div>

      {isDesktop ? <ModalWithBackdrop
        centered
        show={showCalendar}
        mobileWidth="100%"
        backdrop
        closeIcon={true}
        onHide={() => setShowCalendar(false)}
        borderRadius={"12px"}
        animation={false}
        paddingX="20px"
        paddingY="20px"
        backdropStyle={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(1px)" }} // <- add this
      >
        <AirbnbCalendar
          valueStart={props.date.start_date}
          valueEnd={props.date.end_date}
          onChangeDate={handleOnCalenderApplyDates}
          setShowCalendar={setShowCalendar}
          setDateType={SetDateType}
          dateType={props.date.type}
          date={props.date}
          isNotForm={true}
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
            valueStart={props.date.start_date}
            valueEnd={props.date.end_date}
            onChangeDate={handleOnCalenderApplyDates}
            setShowCalendar={setShowCalendar}
            setDateType={SetDateType}
            dateType={props.date.type}
            date={props.date}
            isNotForm={true}
          />
        </BottomModal>
      </>}

    </div>
  )
}

export default DateComponent