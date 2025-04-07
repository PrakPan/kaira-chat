import React, { useState } from "react";
import ButtonYellow from "../../ButtonYellow";

const LeadPaxDetails = ({input,setInput}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
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
                  name="firstName"
                  placeholder="Enter First Name"
                  value={input.firstName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex-1 min-w-[250px] text-[#8E8E8E]">
              <div className="text-[12px] text-[#8E8E8E] mb-1">Last Name</div>
              <input
                className="border w-full h-[40px] px-2 text-black"
                name="lastName"
                placeholder="Enter Last Name"
                value={input.lastName}
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
              <div className="text-[12px] text-[#8E8E8E] mb-1">Phone</div>
              <div className="flex border h-[40px]">
                <input
                  className="w-full px-2 text-black"
                  name="phone"
                  placeholder="Enter Phone"
                  value={input.phone}
                  onChange={handleChange}
                />
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
                  name="passportNumber"
                  placeholder="Enter Passport Number"
                  value={input.passportNumber}
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
                  name="passportExpiryDate"
                  placeholder="Enter Passport Expiry Date"
                  value={input.passportExpiryDate}
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
