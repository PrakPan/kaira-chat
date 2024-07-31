import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const CountryCodeDropdown = ({
  onClose,
  CountryCodes,
  handleExtensionChangeOption,
  setOpenCountryCodeOption,
}) => {
  const ref = useRef();
  const [options, setOptions] = useState([]);
  const [topOptions, setTopOptions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);

  useEffect(() => {
    const top = ["India", "United Kingdom", "United States"];
    let options = [];

    for (const country of top) {
      options.push(
        <div
          className="flex flex-row gap-3 items-center p-2 cursor-pointer"
          key={country}
          value={country}
          onClick={() => {
            handleExtensionChangeOption(country),
              setOpenCountryCodeOption(false);
          }}
        >
          <Image
            height="30"
            width="30"
            objectFit="cover"
            src={CountryCodes[country].img}
            onClick={() => handleExtensionChangeOption(country)}
          ></Image>
          <p className="m-0">{CountryCodes[country].value}</p>
          <p className="m-0 text-gray-600">{CountryCodes[country].label}</p>
        </div>
      );
    }

    setTopOptions(options);
  }, [CountryCodes]);

  useEffect(() => {
    let ExtensionOptions = [];
    if (search) {
      const countries = searchCountries(search);
      for (const country of countries) {
        ExtensionOptions.push(
          <div
            className="flex flex-row gap-3 items-center p-2 cursor-pointer"
            key={country.value}
            value={country.value}
            onClick={() => {
              handleExtensionChangeOption(country.value),
                setOpenCountryCodeOption(false);
            }}
          >
            <Image
              height="30"
              width="30"
              objectFit="cover"
              src={country.img}
              onClick={() => handleExtensionChangeOption(country.value)}
            ></Image>
            <p className="m-0">{country.value}</p>
            <p className="m-0 text-gray-600">{country.label}</p>
          </div>
        );
      }
    } else {
      for (const country in CountryCodes) {
        ExtensionOptions.push(
          <div
            className="flex flex-row gap-3 items-center p-2 cursor-pointer"
            key={country}
            value={country}
            onClick={() => {
              handleExtensionChangeOption(country),
                setOpenCountryCodeOption(false);
            }}
          >
            <Image
              height="30"
              width="30"
              objectFit="cover"
              src={CountryCodes[country].img}
              onClick={() => handleExtensionChangeOption(country)}
            ></Image>
            <p className="m-0">{CountryCodes[country].value}</p>
            <p className="m-0 text-gray-600">{CountryCodes[country].label}</p>
          </div>
        );
      }
    }

    setOptions(ExtensionOptions);
  }, [CountryCodes, search]);

  function searchCountries(query) {
    const searchResults = [];

    Object.keys(CountryCodes).forEach((key) => {
      const country = CountryCodes[key];
      if (
        key.includes(query) ||
        key.toLowerCase().includes(query.toLowerCase())
      ) {
        searchResults.push(country);
      }
    });

    return searchResults;
  }

  return (
    <div
      ref={ref}
      className="fixed z-[1900] w-[90%] md:w-[40%] h-[80%] bg-white border-2 rounded-md overflow-auto drop-shadow-2xl shadow-2xl"
    >
      <div className="sticky top-0 w-full bg-white p-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="w-full p-2 border-2 rounded-lg focus:outline-none"
          placeholder="Search"
        ></input>
      </div>
      <div className="border-b-2">{topOptions}</div>
      {options}
    </div>
  );
};

export default CountryCodeDropdown;
