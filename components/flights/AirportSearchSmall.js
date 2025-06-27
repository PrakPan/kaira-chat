import React, { useState, useEffect, useRef } from "react";
import { popularCities } from "../../public/content/flights";
import { FaPlaneDeparture } from "react-icons/fa"; // Flight icon
import { MdLocationOn } from "react-icons/md"; // Location pin icon
import { MERCURY_HOST } from "../../services/constants";
import axios from "axios";

const SelectWithSearch = ({ setOpen, options, setInput, name }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const getResponse=async()=>{
      const res=await axios.get(`${MERCURY_HOST}/api/v1/geos/search/hubs/airport?q=${searchTerm}`)
      setFilteredOptions(res?.data?.results);
    }
    getResponse();
  setSelectedIndex(-1);
}, [searchTerm, options]);

  const handleSelect = (option) => {
    setInput((prev) => ({
      ...prev,
      [name]: option.code,
    }));
    setOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (filteredOptions.length === 0) return;

      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        handleSelect(filteredOptions[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredOptions, selectedIndex]);

  return (
    <div className="relative w-[250px]" ref={dropdownRef}>
      <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center px-1 py-2 border-b bg-gray-100">
          <MdLocationOn className="text-gray-500 text-lg mr-2" />
          <input
            type="text"
            placeholder="Search city or airport..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-gray-700"
          />
        </div>

        <ul className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelect(option)}
                className={`flex items-center px-1 py-1 cursor-pointer transition-all ${
                  index === selectedIndex ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
              >
                <FaPlaneDeparture className="text-blue-500 text-lg mr-3" />
                <div>
                  <span className="font-semibold">{option.city_name}</span>
                  <p className="text-gray-500 text-sm">({option.code})</p>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-500 text-center">No results found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

const AirportSearchSmall = ({ input, setInput, name }) => {
  const [isOpen, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [filteredResults,setFilteredResults]=useState([]);
  useEffect(()=>{
    const getResponse=async()=>{
      const res=await axios.get(`${MERCURY_HOST}/api/v1/geos/search/hubs/airport?q=`)
      setFilteredResults(res?.data?.results);
      console.log(res?.data?.results)
    }
    getResponse();
  },[])
  useEffect(()=>{
    console.log(`input for ${name} is`,input)
  },[input])

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="w-[120px] h-[65px] block text-gray-600 px-2 py-2 text-xs mb-1 border border-gray-300 rounded-md hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 outline-none">
      <div className="text-xs">{name[0].toUpperCase() + name.slice(1)}</div>
      <div className="mt-2">
      {isOpen ? (
        <SelectWithSearch
          options={filteredResults}
          setInput={setInput}
          name={name}
          setOpen={setOpen}
        />
      ) : (
        <div
          type="text"
          name={name}
          onClick={() => setOpen((prev) => !prev)}
          value={input[name]}
          className="flex flex-col gap-2"
        >
          <div className="text-bold text-xs !text-black">{input[name]}</div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AirportSearchSmall;
