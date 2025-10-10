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
  const startDateString = useSelector((state)=>state.Itinerary.start_date);
  const endDateString = useSelector((state)=>state.Itinerary.end_date);
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [date, setDate] = useState({
    type: "fixed",
    start_date: startDateString ? new Date(startDateString) : null,
    end_date: endDateString ? new Date(endDateString) : null,
    month: "",
    duration: ""
  });
  const handleOnCalenderApplyDates = (values) => {
    setDate({
      ...date,
      start_date: values.start,
      end_date: values.end
    });
  }
  const [showCalendar, setShowCalendar] = useState(false);
  const SetDateType = (value) => {
    setDate({
      ...date,
      type: value
    });
  }
  return (
    <div>
        <div>
        <div>
          <div className="Body2R_14 mb-[4px]">{props.settings ? 'Dates' : "When"}</div>
          <div className="relative w-full">
            <StyledFigmaBox
              value={
                date.type === "fixed" ? (date.start_date && date.end_date
                  ? `${getHumanDate(date.start_date.toLocaleDateString("en-CA").split("-").reverse().join("/"))} - ${getHumanDate(date.end_date.toLocaleDateString("en-CA").split("-").reverse().join("/"))}`
                  : "") : date.type === "flexible" ? (new Date(date.month).toLocaleString("default", { month: "long" }) + ", " + date.duration + " days") : date.duration + " days"
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
          valueStart={date.start_date}
          valueEnd={date.end_date}
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
            valueStart={date.start_date}
            valueEnd={date.end_date}
            onChangeDate={handleOnCalenderApplyDates}
            setShowCalendar={setShowCalendar}
            setDateType={SetDateType}
            dateType={date.type}
            date={date}
          />
        </BottomModal>
      </>}

    </div>
  )
}

export default DateComponent