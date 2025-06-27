import React, { useState } from "react";
import ButtonYellow from "../../ButtonYellow";
import CountryCodeDropdown from "../../userauth/CountryDropdown";
import { FiChevronDown } from "react-icons/fi";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Image from "next/image";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";

const Container = styled.div`
  position: relative;

  width: 100%;

  .SingleDatePicker {
    width: 100%;
  }

  .SingleDatePickerInput {
    width: 100%;
    display: flex;
    background-color: white;
    border: 1px solid #d0d5dd;
    border-radius: 4px;
    height: 40px;
    align-items: center;
  }

  .DateRangePicker {
    width: 100%;
  }
  .DateRangePickerInput_1 {
    border: none;
    display: flex;
    gap: 22px;
    background: initial;
  }
  .DateInput {
    width: 100%;
    border: none;
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
    border-radius: 2px;
    overflow: hidden;
  }
  .DateInput > input {
    font-family: lexend;
    font-weight: 700;
    background-color: transparent;
    font-size: 0.875rem;
  }
  .DayPicker__withBorder {
    @media screen and (max-width: 768px) {
      border: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      width: 320px;
      margin: auto;
    }
  }
  .DateRangePickerInput_arrow,
  .DayPickerKeyboardShortcuts_buttonReset {
    display: none !important;
  }

  .DateRangePicker_picker_1 {
    left: 0px;
    top: 48px !important;
    @media screen and (min-width: 768px) {
      left: -210px !important;
      right: 0px !important;
      top: 55px !important;
    }
  }
  .CalendarDay {
    border: 0px;
  }
  .CalendarDay__selected,
  .CalendarDay__selected:hover {
    background-color: #f7e700;
    border: 0px;
    color: black;
  }
  .CalendarDay__selected_span,
  .CalendarDay__hovered_span,
  .CalendarDay__hovered_span_3 {
    background-color: #f7e70033;
    color: black;
    &:active {
      background-color: #f7e700;
      opacity: 0.7;
      border: none;
    }
    &:hover {
      color: black;
      background-color: #f7e7004a;
      border: none;
    }
  }

  .DateInput_input__focused {
    border-bottom: 2px solid #f7e700;
  }
  .DayPickerKeyboardShortcuts_show__topRight {
    display: none;
  }
`;

const MobileNumberContainer = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const CountryImg = styled(Image)`
  background-position: cover;
  alt: "";
`;

const LeadPaxDetails = ({ input, setInput }) => {
  const today = new Date();
  const [openCountryCodeOption, setOpenCountryCodeOption] = useState(false);
  const CountryCodes = useSelector((state) => state.CountryCodes);
  const [extension, setExtension] = useState("India");
  const [focused, setFocused] = useState({
    dob: false,
    passport_expiry: false,
    passport_issue_date: false,
  });
  const [date, setDate] = useState(moment(today));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleExtensionChangeOption = (country) => {
    setExtension(country);
    setInput((prev) => ({ ...prev, isd_code: CountryCodes[country].label }));
  };

  return (
    <>
      {" "}
      <div className="text-[24px] font-bold border-b border-gray-200 mb-4">
        Add Lead Traveller
      </div>
      <div id="personal-information" className="w-full space-y-4">
        <div>
          <div className="text-[16px] text-[#8E8E8E] font-medium mb-2 text-black">
            Personal Information
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[250px]">
              <div className="text-[12px] text-[#8E8E8E] mb-1">First Name</div>
              <div className="flex border h-[40px]">
                <select
                  className="bg-white border-r px-2"
                  name="title"
                  value={input.title}
                  onChange={handleChange}
                >
                  <option value="Mr">Mr</option>
                  <option value="Miss">Miss</option>
                  <option value="Mrs">Mrs</option>
                </select>
                <input
                  className="w-full px-2 text-black"
                  name="first_name"
                  placeholder="Enter First Name"
                  value={input.first_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex-1 min-w-[250px] text-[#8E8E8E]">
              <div className="text-[12px] text-[#8E8E8E] mb-1">Last Name</div>
              <input
                className="border w-full h-[40px] px-2 text-black"
                name="last_name"
                placeholder="Enter Last Name"
                value={input.last_name}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[#8E8E8E]">
          <div className="flex-1 min-w-[250px]">
            <div className="text-[12px] text-[#8E8E8E] mb-1">Gender</div>
            <select
              className="border bg-white w-full h-[40px] px-2 text-black"
              name="gender"
              value={input.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="flex-1 min-w-[250px]">
            <div className="text-[12px] text-[#8E8E8E] mb-1">Date of Birth</div>
            <Container>
              <SingleDatePicker
                date={input?.dob ? moment(input.dob) : null} // Convert to moment or null if not available
                onDateChange={(newDate) => {
                  setInput((prev) => ({
                    ...prev,
                    dob:
                      newDate && moment.isMoment(newDate)
                        ? newDate.format("YYYY-MM-DD")
                        : "",
                  }));
                }}
                focused={focused.dob}
                onFocusChange={({ focused }) =>
                  setFocused((prev) => ({
                    ...prev,
                    dob: focused,
                  }))
                }
                id="single_date_picker"
                numberOfMonths={1}
                small
                displayFormat="DD/MM/YYYY"
                noBorder={true}
                placeholder="dd/mm/yyyy"
                isOutsideRange={(day) => day.isAfter(moment())}
              />
            </Container>

            {/* <input
              type="date"
              className="border w-full h-[40px] px-2 text-black"
              name="dob"
              value={input.dob}
              onChange={handleChange}
            /> */}
          </div>
        </div>
      </div>
      <div id="contact-information" className="mt-4">
        <div className="text-[16px] text-[#8E8E8E] font-medium mb-2 text-black">
          Contact Information
        </div>

        <div className="w-full space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[250px]">
              <div className="text-[12px] text-[#8E8E8E] mb-1">Email</div>
              <div className="flex border h-[40px]">
                <input
                  className="w-full px-2 text-black"
                  name="email"
                  placeholder="Enter Email"
                  value={input.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex-1 min-w-[250px]">
              <div className="text-[12px] text-[#8E8E8E] mb-1">
                contact_number
              </div>
              <div className="flex border">
                <MobileNumberContainer>
                  <div
                    className="w-fit px-2 flex flex-row gap-3 items-center border-[#d0d5dd] rounded-lg cursor-pointer"
                    onClick={() => setOpenCountryCodeOption(true)}
                  >
                    <CountryImg
                      height="30"
                      width="30"
                      objectFit="cover"
                      src={CountryCodes ? CountryCodes[extension].img : ""}
                    ></CountryImg>

                    <FiChevronDown />
                  </div>

                  {openCountryCodeOption && (
                    <CountryCodeDropdown
                      onClose={() => setOpenCountryCodeOption(false)}
                      CountryCodes={CountryCodes}
                      handleExtensionChangeOption={handleExtensionChangeOption}
                      setOpenCountryCodeOption={setOpenCountryCodeOption}
                    />
                  )}
                </MobileNumberContainer>
                <div className="flex h-[40px]">
                  <input
                    className="w-full px-2 text-black"
                    name="contact_number"
                    placeholder="Enter contact_number"
                    value={input.contact_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[250px]">
              <div className="text-[12px] text-[#8E8E8E] mb-1">
                Passport Number
              </div>
              <div className="flex border h-[40px]">
                <input
                  className="w-full px-2 text-black"
                  name="passport_number"
                  placeholder="Enter Passport Number"
                  value={input.passport_number}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex-1 min-w-[250px]">
              <div className="text-[12px] text-[#8E8E8E] mb-1">
                Passport Issue Date
              </div>
              <Container>
                <SingleDatePicker
                  date={
                    input?.passport_issue_date
                      ? moment(input.passport_issue_date)
                      : null
                  }
                  onDateChange={(newDate) => {
                    setInput((prev) => ({
                      ...prev,
                      passport_issue_date: moment.isMoment(newDate)
                        ? newDate.format("YYYY-MM-DD")
                        : "",
                    }));
                  }}
                  focused={focused.passport_issue_date}
                  onFocusChange={({ focused }) =>
                    setFocused((prev) => ({
                      ...prev,
                      passport_issue_date: focused,
                    }))
                  }
                  id="single_date_picker"
                  numberOfMonths={1}
                  small
                  placeholder="dd/mm/yyyy"
                  displayFormat="DD/MM/YYYY"
                  noBorder={true}
                  isOutsideRange={(day) => day.isAfter(moment())}
                />
              </Container>
            </div>
            <div className="flex-1 min-w-[250px]">
              <div className="text-[12px] text-[#8E8E8E] mb-1">
                Passport Expiry Date
              </div>
              <Container>
                <SingleDatePicker
                  date={
                    input?.passport_expiry
                      ? moment(input.passport_expiry)
                      : null
                  }
                  onDateChange={(newDate) => {
                    setInput((prev) => ({
                      ...prev,
                      passport_expiry:
                        newDate && moment.isMoment(newDate)
                          ? newDate.format("YYYY-MM-DD")
                          : "",
                    }));
                  }}
                  focused={focused.passport_expiry}
                  onFocusChange={({ focused }) =>
                    setFocused((prev) => ({
                      ...prev,
                      passport_expiry: focused,
                    }))
                  }
                  id="passport_expiry_picker"
                  numberOfMonths={1}
                  small
                  displayFormat="DD/MM/YYYY"
                  noBorder={true}
                />
              </Container>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadPaxDetails;
