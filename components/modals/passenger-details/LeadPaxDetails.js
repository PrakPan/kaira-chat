import React, { useState } from "react";
import ButtonYellow from "../../ButtonYellow";
import CountryCodeDropdown from "../../userauth/CountryDropdown";
import { FiChevronDown } from "react-icons/fi";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Image from "next/image";

const MobileNumberContainer = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const CountryImg = styled(Image)`
  background-position: cover;
  alt: "";
`;

const LeadPaxDetails = ({ input, setInput }) => {
  const [openCountryCodeOption, setOpenCountryCodeOption] = useState(false);
  const CountryCodes = useSelector((state) => state.CountryCodes);
  const [extension, setExtension] = useState("India");

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
            <input
              type="date"
              className="border w-full h-[40px] px-2 text-black"
              name="dob"
              value={input.dob}
              onChange={handleChange}
            />
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
                Passport Expiry Date
              </div>
              <div className="flex border h-[40px]">
                <input
                  className="w-full px-2 text-black"
                  name="passport_expiry"
                  placeholder="Enter Passport Expiry Date"
                  type="date"
                  value={input.passport_expiry}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className=" min-w-[250px]">
              <div className="text-[12px] text-[#8E8E8E] mb-1">
                Passport Issue Date
              </div>
              <div className="flex border h-[40px]">
                <input
                  className="w-full px-2 text-black"
                  name="passport_issue_date"
                  type="date"
                  placeholder="Enter Passport Issue Date"
                  value={input.passport_issue_date}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadPaxDetails;
