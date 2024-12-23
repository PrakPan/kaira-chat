import { format } from "date-fns";
import { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

import axiosbdinstance from "../../../services/leads/bd";
import { useRouter } from "next/router";

const TIMES = [
  {
    label: "09:00AM",
    value: "09:00",
  },
  {
    label: "09:30AM",
    value: "09:30",
  },
  {
    label: "10:00AM",
    value: "10:00",
  },
  {
    label: "10:30AM",
    value: "10:30",
  },
  {
    label: "11:00AM",
    value: "10:00",
  },
  {
    label: "11:30AM",
    value: "11:30",
  },
  {
    label: "12:00PM",
    value: "12:00",
  },
  {
    label: "12:30PM",
    value: "12:30",
  },
  {
    label: "01:00PM",
    value: "13:00",
  },
  {
    label: "01:30PM",
    value: "13:30",
  },
  {
    label: "02:00PM",
    value: "14:00",
  },
  {
    label: "02:30PM",
    value: "14:30",
  },
  {
    label: "03:00PM",
    value: "15:00",
  },
  {
    label: "03:30PM",
    value: "15:30",
  },
  {
    label: "04:00PM",
    value: "16:00",
  },
  {
    label: "04:30PM",
    value: "16:30",
  },
  {
    label: "05:00PM",
    value: "17:00",
  },
  {
    label: "05:30PM",
    value: "17:30",
  },
  {
    label: "06:00PM",
    value: "18:00",
  },
];

export default function ScheduleCall(props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [query, setQuery] = useState("Others");
  const [date, setDate] = useState(getMinDate());
  const [time, setTime] = useState("10:00");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [personError, setPersonError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [companyError, setCompanyError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleContinue = () => {
    resetErrors();
    setSubmitted(false);
    setLoading(true);
    axiosbdinstance
      .post("/", {
        organization_name: companyName,
        phone: phone,
        person_name: name,
        email: email,
        service: "wiejdn",
        datetime: `${date}T${time}`,
        type: query || "",
      })
      .then((res) => {
        setLoading(false);
        setSubmitted(true);
        resetForm();
        router.push("/corporates/thank-you");
      })
      .catch((err) => {
        setLoading(false);

        if (err?.response?.data?.email) {
          setEmailError(err.response.data.email[0]);
        }

        if (err?.response?.data?.phone) {
          setPhoneError(err.response.data.phone[0]);
        }

        if (err?.response?.data?.person_name) {
          setPersonError(err.response.data.person_name[0]);
        }

        if (err?.response?.data?.organization_name) {
          setCompanyError(err.response.data.organization_name[0]);
        }
      });
  };

  function resetErrors() {
    setPersonError(false);
    setPhoneError(false);
    setCompanyError(false);
    setEmailError(false);
  }

  function resetForm() {
    setName("");
    setPhone("");
    setEmail("");
    setCompanyName("");
    setQuery("Others");
    setDate(getMinDate());
    setTime("10:00");
  }

  function getMinDate() {
    const today = new Date();

    const date = format(today, "yyyy-MM-dd");

    return date;
  }

  return (
    <div
      ref={props.modalRef}
      className={`${props.banner ? 'bg-gray-100/60' : 'bg-gray-100'}  space-y-4 w-[90%] mx-auto text-sm text-black rounded-lg p-3`}
    >
      <div>
        <h1 className="text-lg font-bold border-b-2">Schedule a callback now!</h1>
      </div>

      <div className="">
        <h1 className="text-sm">
          Your Details<span className="text-red-500">*</span>
        </h1>
        <div className="flex flex-col gap-3">
          <div className="space-y-1">
            <input
              className="w-full p-2 rounded-md focus:outline-none"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
            {personError && (
              <div className="text-red-500 text-sm">This feild is required</div>
            )}
          </div>

          <div>
            <input
              className="w-full p-2 rounded-md focus:outline-none"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            {emailError && (
              <div className="text-red-500 text-sm">This feild is required</div>
            )}
          </div>

          <div>
            <input
              className="w-full p-2 rounded-md focus:outline-none"
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            ></input>
            {phoneError && (
              <div className="text-red-500 text-sm">This feild is required</div>
            )}
          </div>

          <div className="space-y-1">
            <input
              className="w-full p-2 rounded-md focus:outline-none"
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            ></input>
            {companyError && (
              <div className="text-red-500 text-sm">This feild is required</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <h1 className="text-sm">What are you looking for?</h1>

        <select
          name="query"
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 rounded-md focus:outline-none"
        >
          <option
            value="Conferences or offsites"
            className="text-sm text-gray-500 font-semibold"
          >
            Conferences or offsites
          </option>
          <option
            value="Workcations or retreats"
            className="text-sm text-gray-500 font-semibold"
          >
            Workcations or retreats
          </option>
          <option
            value="Central Booking platform"
            className="text-sm text-gray-500 font-semibold"
          >
            Central Booking platform
          </option>
          <option
            value="Partnerships"
            className="text-sm text-gray-500 font-semibold"
          >
            Partnerships
          </option>
          <option
            value="Others"
            className="text-sm text-gray-500 font-semibold"
          >
            Others
          </option>
        </select>
      </div>

      <div className="flex flex-col">
        <h1 className="text-sm">When should we call you?</h1>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            className="p-2 focus:outline-none rounded-md"
            type="date"
            name="date"
            placeholder="dd-mm-yyyy"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={getMinDate()}
          ></input>

          <select
            name="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-2 rounded-md focus:outline-none "
          >
            {TIMES.map((item, i) => (
              <option
                key={i}
                value={item.value}
                className="text-sm text-gray-500 font-semibold"
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        style={{ background: loading ? "black" : "" }}
        className="relative h-10 text-normal w-full rounded-lg font-medium px-auto py-1 border-1 border-black bg-[#f7e700] hover:bg-black hover:text-white transition-all"
      >
        {loading ? (
          <PulseLoader
            style={{
              position: "absolute",
              top: "55%",
              left: "50%",
              transform: "translate(-50% , -50%)",
            }}
            size={12}
            speedMultiplier={0.6}
            color="#ffffff"
          />
        ) : (
          "Schedule a Callback"
        )}
      </button>
    </div>
  );
}
