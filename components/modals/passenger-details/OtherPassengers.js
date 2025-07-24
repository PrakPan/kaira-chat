import React from "react";
import { useSelector } from "react-redux";

const OtherPassengers = ({ input, setInput, index }) => {
    const handleChange = (e) => {
        const tempVal=[...input]
        const { name, value } = e.target;
        tempVal[index][name]=value;
        setInput(tempVal);
      };
  return (
    <>

      <div className="">
      <div id="basic-information" className="w-full space-y-2">
        <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[250px]">
              <div className="text-[12px] text-[#8E8E8E] mb-1">First Name</div>
              <div className="flex border h-[40px]">
                <select
                  className="bg-white border-r px-2"
                  name="title"
                  value={input[index].title}
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
                  value={input[index].first_name}
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
                value={input[index].last_name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-[#8E8E8E]">
          <div className="flex-1 min-w-[250px]">
            <div className="text-[12px] text-[#8E8E8E] mb-1">Gender</div>
            <select
              className="border bg-white w-full h-[40px] px-2 text-black"
              name="gender"
              value={input[index].gender}
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
              value={input[index].dob}
              onChange={handleChange}
            />
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default OtherPassengers;
