import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { MdDone } from "react-icons/md";
import OTPInput from "react-otp-input";
import { BiError } from "react-icons/bi";
import { FiChevronDown } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";
import { RiArrowDropDownLine } from "react-icons/ri";
import CountryCodeDropdown from "../../components/userauth/CountryDropdown";
import * as authaction from "../../store/actions/auth";
import axiosuserinstance, {
  userEmailEditInstance,
  userImageUploadInstance,
} from "../../services/user/edit";
import { useAnalytics } from "../../hooks/useAnalytics";

const CountryCodeContainer = styled.div`
  position: relative;
  width: 150px;
  height: 3.1rem;
  .CountryInput {
    display: grid;
    border: 2px solid #d0d5dd;
    border-radius: 0.5rem;
    grid-template-columns: 1fr 1fr 1fr 0.5fr;
    padding-inline: 0.2rem;
    gap: 0.4rem;
    height: 100%;
    paddding-left: 10%;
  }
  img {
    margin-block: auto;
  }
  p {
    margin: auto;
  }
  svg {
    margin-block: auto;
    font-size: 1.3rem;
    margin-left: -5px;
  }
`;

const CountryImg = styled(Image)`
  height: 1.5rem;
  alt: "";
`;

const OtpContainer = styled.div`
  div {
    width: 60%;
    display: grid !important;
    grid-template-columns: 1fr 1fr 1fr 1fr !important;
    gap: 0.8rem;
  }
  .otpBox {
    width: 100% !important;
    border: 1px solid #d0d5dd;
    border-radius: 8px;
    height: 3rem;
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  }
`;

const ErrorText = styled.div`
  color: red;
  font-size: 13px;
  margin-top: 5px;
  margin-left: 5px;
  height: 1rem;
  display: flex;
  align-items: center;
`;

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    CountryCodes: state.CountryCodes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserDetails: (payload) => dispatch(authaction.setUserDetails(payload)),
    changeUserDetails: (payload) =>
      dispatch(authaction.changeUserDetails(payload)),
  };
};

export const EditInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  ({
    token,
    CountryCodes,
    type,
    name,
    text,
    closeEdit,
    setUserDetails,
    changeUserDetails,
    userData,
  }) => {
    const [value, setValue] = useState(text);
    const [loading, setLoading] = useState(false);
    const [optSent, setOptSent] = useState(false);
    const [phone, setPhone] = useState(text);
    const [error, setError] = useState(null);
    const [extension, setExtension] = useState("India");
    const [openCountryCodeOption, setOpenCountryCodeOption] = useState(false);
    const [ExtensionOptions, setExtensionOptions] = useState([]);
    const [openCountryMenu, setOpenCountryMenu] = useState(false);
    const ref = useRef();
    const { trackUserLogin, trackUserAccountUpdate } = useAnalytics();

    useEffect(() => {
      const checkIfClickedOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          closeEdit(false);
        }
      };
      document.addEventListener("mousedown", checkIfClickedOutside);

      return () => {
        document.removeEventListener("mousedown", checkIfClickedOutside);
      };
    }, []);

    useEffect(() => {
      let Options = [];
      for (const country in CountryCodes) {
        Options.push(
          <div
            className="flex flex-row gap-3 items-center p-2 cursor-pointer"
            key={country}
            value={country}
            onClick={() => {
              handleExtensionChangeOption(country),
                setOpenCountryCodeOption(false);
            }}
          >
            <CountryImg
              height="29"
              width="29"
              objectFit="cover"
              src={CountryCodes[country].img}
              onClick={() => handleExtensionChangeOption(country)}
            ></CountryImg>
            <p className="m-0">{CountryCodes[country].value}</p>
            <p className="m-0 text-gray-600">{CountryCodes[country].label}</p>
          </div>
        );
      }

      setExtensionOptions(Options);
    }, []);

    useEffect(() => {
      if (name === "phone") {
        const { countryCode, number } = separateCountryCode(text);
        if (countryCode && number) {
          setValue(number);
          const country = getCountryName(countryCode);
          if (country) {
            setExtension(country);
          } else {
            setExtension("India");
          }
        }
      }
    }, []);

    const separateCountryCode = (phoneNumber) => {
      const pattern = /^(\+\d{1,4})(\d{10})$/;
      const match = phoneNumber.match(pattern);

      if (match) {
        const countryCode = match[1];
        const number = match[2];

        return {
          countryCode: countryCode,
          number: number,
        };
      } else {
        return null; // Invalid phone number format
      }
    };

    const getCountryName = (code) => {
      for (const country in CountryCodes) {
        if (CountryCodes[country].label === code) {
          return CountryCodes[country].value;
        }
      }
      return null;
    };

    const onChangeValue = (e) => {
      if (name === "phone") {
        const phone = e.target.value;
        setPhone(phone);
        const res = separateCountryCode(phone);
        if (res) {
          setValue(res.number);
        } else {
          setValue(phone);
        }
      } else {
        setValue(e.target.value);
      }
    };

    const handleEnterKey = (e) => {
      if (e.key === "Enter" && e.target.value) {
        e.preventDefault();
        handleSave();
      }
    };

    const handleSave = () => {
      if (token) {
        setLoading(true);
        let data = {};
        data[name] = value;

        switch (name) {
          case "phone":
            handlePhone({
              data: { phone: CountryCodes[extension].label + value },
            });
            break;
          case "email":
            handleEmail({ email: value });
            break;
          case "country":
            handleCountry({data: {country:value}})
            break;
          default:
            handleName({ data });
            break;
        }
      } else {
        closeEdit(false);
      }
    };


    const handleCountry = ({ data }) => {
      const RequestData = {
        name: userData.name,
        whatsapp_opt_in: userData.whatsapp_opt_in,
        country: data.country,
      };
      axiosuserinstance
        .put("/", RequestData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUserDetails(res.data);
          setLoading(false);
          setTimeout(() => {
            closeEdit(false);
          }, 500);        })
        .catch((err) => {
          setLoading(false);
          closeEdit(false);
        });
    };

    const handleName = ({ data }) => {
      const RequestData = {
        name: data.name,
        whatsapp_opt_in: userData.whatsapp_opt_in,
        country: userData.country,
      };
      axiosuserinstance
        .put("/", RequestData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUserDetails(res.data);
          setLoading(false);
          closeEdit(false);
        })
        .catch((err) => {
          setLoading(false);
          closeEdit(false);
          if (err?.response?.data?.name) {
            console.log(err.response.data.name[0]);
          } else {
            console.log(err?.response?.data);
          }
        });
    };

    const handlePhone = ({ data }) => {
      setOptSent(false);
      setError(null);
      axiosuserinstance
        .post("/update_phone/initiate/", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          setOptSent(true);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.data.phone) {
            setError(err?.response?.data?.phone[0]);
          } else {
            closeEdit(false);
          }
        });
    };

    const handleEmail = ({ email }) => {
      setOptSent(false);
      setError(null);
      axiosuserinstance
        .post("/update_email/initiate/", { email }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          setOptSent(true);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.data.email) {
            console.log(err?.response?.data?.email[0]);
            setError(err?.response?.data?.email[0]);
          } else {
            closeEdit(false);
            console.log(err?.response?.data);
          }
        });
    };
    

    const handleExtensionChangeOption = (country) => {
      const res = separateCountryCode(phone);
      if (res) {
        setPhone(CountryCodes[country].label + res.number);
      } else {
        if (phone.length === 10) {
          setPhone(CountryCodes[country].label + phone);
        } else {
          setPhone(CountryCodes[country].label);
        }
      }

      setExtension(country);
    };

    return (
      <div
        ref={ref}
        className="w-full flex flex-col items-center justify-center gap-2"
      >
        <div
          className={`w-full flex flex-row justify-start items-center gap-3 ${
            name === "name" || name === "country"
              ? "justify-center"
              : "justify-start"
          }`}
        >
          {name === "phone" && (
            <div className="">
              <div
                className={`w-fit px-2 py-[0.64rem] flex flex-row gap-3 items-center border-2 border-[#d0d5dd] rounded-md ${
                  loading && "opacity-25"
                }`}
                onClick={() => setOpenCountryCodeOption(true)}
              >
                <CountryImg
                  height="29"
                  width="29"
                  objectFit="cover"
                  src={CountryCodes ? CountryCodes[extension].img : ""}
                ></CountryImg>

                <FiChevronDown />
              </div>
              {openCountryCodeOption && (
                <div className="absolute top-[160px]">
                  <CountryCodeDropdown
                    onClose={() => setOpenCountryCodeOption(false)}
                    CountryCodes={CountryCodes}
                    handleExtensionChangeOption={handleExtensionChangeOption}
                    setOpenCountryCodeOption={setOpenCountryCodeOption}
                  />
                </div>
              )}
            </div>
          )}

          <div className="w-[60%] flex flex-col relative">
            <input
              autoFocus
              disabled={loading || name === "country"}
              name={name}
              type={type}
              value={name === "phone" ? phone : value}
              onChange={(e) => onChangeValue(e)}
              onKeyDown={(e) => handleEnterKey(e)}
              className={`w-full border-2 border-[#d0d5dd] rounded-md px-2 py-[0.64rem] focus:outline-none ${
                loading && "opacity-25"
              }`}
            ></input>
            {name === "country" && (
              <div className="absolute right-4 top-[50%] translate-y-[-50%]">
                <RiArrowDropDownLine
                  onClick={() => setOpenCountryMenu((prev) => !prev)}
                  className="text-[30px] cursor-pointer"
                />
              </div>
            )}

            {error && (
              <ErrorText className="absolute bottom-[-20px]">
                <BiError style={{ fontSize: "1rem" }} />
                <span style={{ marginLeft: "2px", marginTop: "2px" }}>
                  {error}
                </span>
              </ErrorText>
            )}

            {name === "country" && openCountryMenu && (
              <div className="absolute z-[1999] top-[110%] w-full h-[46vh]">
                <CountryMenu
                  setValue={setValue}
                  setOpenCountryMenu={setOpenCountryMenu}
                  CountryCodes={CountryCodes}
                />
              </div>
            )}
          </div>

          {loading ? (
            <div className="w-6 h-6 rounded-full animate-spin border-t-2 border-black"></div>
          ) : optSent ? (
            <button
              onClick={handleSave}
              className="text-sm text-blue cursor-pointer underline"
            >
              Resend OTP
            </button>
          ) : (
            <MdDone onClick={handleSave} className="text-2xl cursor-pointer" />
          )}
        </div>

        {optSent && (
          <div className="flex flex-col gap-2">
            <div className="text-gray-500">OTP has been sent</div>

            <OPTInput
              name={name}
              token={token}
              phone={CountryCodes[extension].label + value}
              email={value}
              setUserDetails={setUserDetails}
              closeEdit={closeEdit}
            />
          </div>
        )}
      </div>
    );
  }
);

const OPTInput = ({ name, token, phone, email, setUserDetails, closeEdit }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (value.length === 4) {
      switch (name) {
        case "phone":
          handlePhoneOPT({ data: { phone, otp: value } });
          break;
        case "email":
          handleEmailOPT({ otp: value });
          break;
        default:
          return;
      }
    }
  }, [value]);

  const handlePhoneOPT = ({ data }) => {
    setLoading(true);
    axiosuserinstance
      .put("/update_phone/complete/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserDetails(res.data);
        setLoading(false);
        closeEdit(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.otp) {
          console.log(err.response.data.otp[0]);
          setError(err.response.data.otp[0]);
        } else {
          console.log(err.response.data);
        }
      });
  };

  const handleEmailOPT = ({ otp }) => {
    setLoading(true);
    axiosuserinstance
      .put(
        "/update_email/complete/",
        { otp, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setUserDetails(res.data);
        setLoading(false);
        closeEdit(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.otp) {
          console.log(err.response.data.otp[0]);
          setError(err.response.data.otp[0]);
        } else {
          console.log(err.response.data);
        }
      });
  };
  

  return (
    <div className="flex flex-col gap-2">
      <OtpContainer className={`${loading && "opacity-25"}`}>
        <OTPInput
          value={value}
          onChange={(otp) => setValue(otp)}
          numInputs={4}
          inputType="tel"
          inputStyle="otpBox"
          renderInput={(props) => <input {...props} />}
        />
      </OtpContainer>
      {error && (
        <ErrorText>
          <BiError style={{ fontSize: "1rem" }} />
          <span style={{ marginLeft: "2px", marginTop: "2px" }}>
            OTP is not valid
          </span>
        </ErrorText>
      )}
    </div>
  );
};

const CountryMenu = ({ CountryCodes, setOpenCountryMenu, setValue }) => {
  const ref = useRef();
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenCountryMenu(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);

  useEffect(() => {
    let Options = [];

    if (search) {
      const results = searchCountries(search);

      for (const country of results) {
        Options.push(
          <div
            className="flex flex-row gap-3 items-center p-2 cursor-pointer"
            key={country.value}
            value={country.value}
            onClick={() => {
              setValue(country.value), setOpenCountryMenu(false);
            }}
          >
            <CountryImg
              height="29"
              width="29"
              objectFit="cover"
              src={country.img}
              onClick={() => setValue(country.value)}
            ></CountryImg>
            <p className="m-0">{country.value}</p>
          </div>
        );
      }
    } else {
      for (const country in CountryCodes) {
        Options.push(
          <div
            className="flex flex-row gap-3 items-center p-2 cursor-pointer"
            key={country}
            value={country}
            onClick={() => {
              setValue(country), setOpenCountryMenu(false);
            }}
          >
            <CountryImg
              height="29"
              width="29"
              objectFit="cover"
              src={CountryCodes[country].img}
              onClick={() => setValue(country)}
            ></CountryImg>
            <p className="m-0">{CountryCodes[country].value}</p>
          </div>
        );
      }
    }

    setCountries(Options);
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
      className="z-[2999] bg-white w-full h-full border-2 rounded-md p-2 pt-0 overflow-auto"
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
      {countries}
    </div>
  );
};

export const ImageInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ children, setEditImage, setUserDetails, token }) => {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!file) {
      setEditImage(false);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("profile_pic", file);

    userImageUploadInstance
      .patch("", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setUserDetails(response.data);
        setLoading(false);
        setEditImage(false);
      })
      .catch((err) => {
        setLoading(false);
        setEditImage(false);
        console.log("[ERROR][EditProfile:onFileUpload]: ", err.message);
      });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`relative w-[45%] flex flex-col gap-3 items-center ${
        loading && "opacity-50"
      }`}
    >
      <div className="w-full opacity-75">{children}</div>
      <LuImagePlus
        onClick={triggerFileInput}
        className="text-[60px] md:text-[100px] absolute top-[50%] translate-y-[-70%] md:translate-y-[-60%] text-white cursor-pointer"
      />
      <input
        ref={fileInputRef}
        type="file"
        onChange={onFileChange}
        className="hidden"
      ></input>
      <div className="flex flex-row gap-4 text-sm">
        <button
          onClick={() => setEditImage(false)}
          className="border-2 border-black px-3 py-1 rounded-md hover:bg-black hover:text-white transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onFileUpload}
          className="border-2 border-black px-3  py-1 rounded-md hover:bg-black hover:text-white transition-all"
        >
          Save
        </button>
      </div>
    </div>
  );
});
