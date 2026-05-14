import React, { useState } from "react";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import {
  DatePickerContainer as Container,
  renderMonthYearSelect,
} from "./datePickerHelpers";

const fieldShellBase =
  "flex h-[44px] items-center border-sm border-text-disabled rounded-md-lg bg-white overflow-hidden focus-within:border-primary-indigo transition-colors";
const inputBase =
  "w-full h-full px-sm text-sm-md font-400 leading-md text-text-charcolblack outline-none placeholder:text-text-placeholder bg-transparent";
const selectBase =
  "h-full bg-white px-sm text-sm-md font-400 leading-md text-text-charcolblack outline-none cursor-pointer";
const labelBase =
  "text-sm font-400 leading-sm-md text-text-spacegrey mb-xxs block";

const OtherPassengers = ({ input, setInput, index }) => {
  const currentYear = new Date().getFullYear();
  const [dobFocused, setDobFocused] = useState(false);

  const handleChange = (e) => {
    const tempVal = [...input];
    const { name, value } = e.target;
    tempVal[index][name] = value;
    setInput(tempVal);
  };

  const handleDobChange = (newDate) => {
    const tempVal = [...input];
    tempVal[index].dob =
      newDate && moment.isMoment(newDate) ? newDate.format("YYYY-MM-DD") : "";
    setInput(tempVal);
  };

  const isInfant = input[index]?.type === "infant";
  const isChild = input[index]?.type === "child";
  const dobUpperYear = currentYear;
  const dobLowerYear = isInfant
    ? currentYear - 5
    : isChild
    ? currentYear - 12
    : currentYear - 100;

  return (
    <div className="font-lexend grid grid-cols-1 md:grid-cols-2 gap-md">
      <div>
        <label className={labelBase}>
          First Name <span className="text-text-error">*</span>
        </label>
        <div className={fieldShellBase}>
          <select
            className={`${selectBase} border-r-sm border-text-disabled`}
            name="title"
            value={input[index].title}
            onChange={handleChange}
          >
            <option value="Mr">Mr</option>
            <option value="Miss">Miss</option>
            <option value="Mrs">Mrs</option>
          </select>
          <input
            className={inputBase}
            name="first_name"
            placeholder="Enter First Name"
            value={input[index].first_name}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className={labelBase}>
          Last Name <span className="text-text-error">*</span>
        </label>
        <div className={fieldShellBase}>
          <input
            className={inputBase}
            name="last_name"
            placeholder="Enter Last Name"
            value={input[index].last_name}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className={labelBase}>
          Gender <span className="text-text-error">*</span>
        </label>
        <div className={fieldShellBase}>
          <select
            className={`${selectBase} w-full`}
            name="gender"
            value={input[index].gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelBase}>
          Date of Birth <span className="text-text-error">*</span>
        </label>
        <div className={fieldShellBase}>
          <Container className="px-sm">
            <SingleDatePicker
              date={input[index]?.dob ? moment(input[index].dob) : null}
              onDateChange={handleDobChange}
              focused={dobFocused}
              onFocusChange={({ focused }) => setDobFocused(focused)}
              id={`dob_picker_${index}_${input[index]?.type || "adult"}`}
              numberOfMonths={1}
              small
              displayFormat="DD/MM/YYYY"
              noBorder={true}
              placeholder="dd/mm/yyyy"
              isOutsideRange={(day) => day.isAfter(moment())}
              renderMonthElement={(args) =>
                renderMonthYearSelect(args, dobLowerYear, dobUpperYear)
              }
            />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default OtherPassengers;
