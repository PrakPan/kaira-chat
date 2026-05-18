import React, { useState } from "react";
import CountryCodeDropdown from "../../userauth/CountryDropdown";
import { FiChevronDown } from "react-icons/fi";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Image from "next/image";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import {
  DatePickerContainer as Container,
  renderMonthYearSelect,
} from "./datePickerHelpers";

const CountryImg = styled(Image)`
  background-position: cover;
  alt: "";
`;

const fieldShellBase =
  "flex h-[44px] items-center border-sm border-text-disabled rounded-md-lg bg-white overflow-hidden focus-within:border-primary-indigo transition-colors";
const inputBase =
  "w-full h-full px-sm text-sm-md font-400 leading-md text-text-charcolblack outline-none placeholder:text-text-placeholder bg-transparent";
const selectBase =
  "h-full bg-white px-sm text-sm-md font-400 leading-md text-text-charcolblack outline-none cursor-pointer";
const labelBase =
  "text-sm font-400 leading-sm-md text-text-spacegrey mb-xxs block";
const sectionTitleBase =
  "text-md font-500 leading-xl text-primary-indigo mb-sm";

const LeadPaxDetails = ({ input, setInput }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [openCountryCodeOption, setOpenCountryCodeOption] = useState(false);
  const CountryCodes = useSelector((state) => state.CountryCodes);
  const [extension, setExtension] = useState("India");
  const [focused, setFocused] = useState({
    dob: false,
    passport_expiry: false,
    passport_issue_date: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleExtensionChangeOption = (country) => {
    setExtension(country);
    setInput((prev) => ({ ...prev, isd_code: CountryCodes[country].label }));
  };

  return (
    <div className="font-lexend">
      <div className="text-md-lg font-500 leading-xl-md text-primary-indigo mb-md">
        Lead Traveller
      </div>

      <div className="space-y-lg">
        <div>
          <div className={sectionTitleBase}>Personal Information</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className={labelBase}>
                First Name <span className="text-text-error">*</span>
              </label>
              <div className={fieldShellBase}>
                <select
                  className={`${selectBase} border-r-sm border-text-disabled`}
                  name="title"
                  value={input.title}
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
                  value={input.first_name}
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
                  value={input.last_name}
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
                  value={input.gender}
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
                    date={input?.dob ? moment(input.dob) : null}
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
                    id="lead_dob_picker"
                    numberOfMonths={1}
                    small
                    displayFormat="DD/MM/YYYY"
                    noBorder={true}
                    placeholder="dd/mm/yyyy"
                    isOutsideRange={(day) => day.isAfter(moment())}
                    renderMonthElement={(args) =>
                      renderMonthYearSelect(args, currentYear - 100, currentYear)
                    }
                  />
                </Container>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className={sectionTitleBase}>Contact Information</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className={labelBase}>
                Email <span className="text-text-error">*</span>
              </label>
              <div className={fieldShellBase}>
                <input
                  className={inputBase}
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  value={input.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className={labelBase}>
                Contact Number <span className="text-text-error">*</span>
              </label>
              <div className={fieldShellBase}>
                <div
                  className="flex h-full items-center gap-xs px-sm border-r-sm border-text-disabled cursor-pointer shrink-0"
                  onClick={() => setOpenCountryCodeOption(true)}
                >
                  <CountryImg
                    height="20"
                    width="28"
                    objectFit="cover"
                    src={CountryCodes ? CountryCodes[extension].img : ""}
                  />
                  <FiChevronDown className="text-text-spacegrey" />
                </div>
                {openCountryCodeOption && (
                  <CountryCodeDropdown
                    onClose={() => setOpenCountryCodeOption(false)}
                    CountryCodes={CountryCodes}
                    handleExtensionChangeOption={handleExtensionChangeOption}
                    setOpenCountryCodeOption={setOpenCountryCodeOption}
                  />
                )}
                <input
                  className={inputBase}
                  name="contact_number"
                  type="tel"
                  placeholder="Enter Contact Number"
                  value={input.contact_number}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className={sectionTitleBase}>Passport Details</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div>
              <label className={labelBase}>Passport Number</label>
              <div className={fieldShellBase}>
                <input
                  className={inputBase}
                  name="passport_number"
                  placeholder="Enter Passport Number"
                  value={input.passport_number}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className={labelBase}>Passport Issue Date</label>
              <div className={fieldShellBase}>
                <Container className="px-sm">
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
                    id="lead_passport_issue_picker"
                    numberOfMonths={1}
                    small
                    placeholder="dd/mm/yyyy"
                    displayFormat="DD/MM/YYYY"
                    noBorder={true}
                    isOutsideRange={(day) => day.isAfter(moment())}
                    renderMonthElement={(args) =>
                      renderMonthYearSelect(args, currentYear - 30, currentYear)
                    }
                  />
                </Container>
              </div>
            </div>
            <div>
              <label className={labelBase}>Passport Expiry Date</label>
              <div className={fieldShellBase}>
                <Container className="px-sm">
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
                    id="lead_passport_expiry_picker"
                    numberOfMonths={1}
                    small
                    displayFormat="DD/MM/YYYY"
                    noBorder={true}
                    placeholder="dd/mm/yyyy"
                    renderMonthElement={(args) =>
                      renderMonthYearSelect(args, currentYear, currentYear + 30)
                    }
                  />
                </Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadPaxDetails;
