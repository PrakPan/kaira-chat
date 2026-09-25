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
import {
  getPhonePlaceholder,
  isValidNationalNumber,
  splitPhone,
  toNationalDigits,
} from "../../utils/phone";

// Country preselected in the phone picker when the stored number can't be
// parsed and the profile has no country.
const DEFAULT_COUNTRY = "India";

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

// The user endpoints answer with the user wrapped in an envelope
// (`{ data: { user } }`, same as changeUserDetails reads it). Passing the raw
// `res.data` to setUserDetails spread `data` into the auth store and left name /
// country / phone unchanged on screen, so always unwrap first.
const extractUser = (res) =>
  res?.data?.data?.user ?? res?.data?.user ?? res?.data?.data ?? {};

// First readable message from a DRF-style error body, for a given field.
const apiError = (err, field) => {
  const body = err?.response?.data;
  const pick = (v) => (Array.isArray(v) ? v[0] : v);
  return (
    pick(body?.[field]) ||
    pick(body?.errors?.[0]?.[field]) ||
    pick(body?.detail) ||
    pick(body?.message) ||
    (err?.response ? null : "Network error, please try again")
  );
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
    userData,
  }) => {
    const isPhone = name === "phone";
    // Phone is edited as dial code (flag picker) + local digits. Parse the
    // stored number once, preferring the user's own country for shared codes.
    const initialPhone = isPhone
      ? splitPhone(text, CountryCodes, userData?.country)
      : null;
    const [value, setValue] = useState(
      isPhone ? initialPhone?.number ?? (text || "").replace(/\D/g, "") : text
    );
    const [extension, setExtension] = useState(
      initialPhone?.country ||
        (userData?.country && CountryCodes?.[userData.country]
          ? userData.country
          : DEFAULT_COUNTRY)
    );
    const [loading, setLoading] = useState(false);
    const [optSent, setOptSent] = useState(false);
    // The exact number/email the OTP was sent to. The complete call must use
    // the same one even if the picker or input is touched afterwards.
    const [submitted, setSubmitted] = useState(null);
    const [error, setError] = useState(null);
    const [openCountryCodeOption, setOpenCountryCodeOption] = useState(false);
    const [openCountryMenu, setOpenCountryMenu] = useState(false);
    const ref = useRef();

    const dialCode = CountryCodes?.[extension]?.label ?? "";

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

    // Anything that changes what would be sent invalidates a pending OTP.
    const resetPendingOtp = () => {
      setOptSent(false);
      setSubmitted(null);
      setError(null);
    };

    const onChangeValue = (e) => {
      const raw = e.target.value;
      if (isPhone) {
        // A pasted/typed "+44…" carries its own code: switch the picker to it
        // so the flag and the number can never disagree.
        const parsed = raw.trim().startsWith("+")
          ? splitPhone(raw, CountryCodes, extension)
          : null;
        if (parsed?.country) {
          setExtension(parsed.country);
          setValue(parsed.number);
        } else {
          setValue(raw.replace(/[^\d\s()-]/g, ""));
        }
      } else {
        setValue(raw);
      }
      resetPendingOtp();
    };

    const handleEnterKey = (e) => {
      if (e.key === "Enter" && e.target.value) {
        e.preventDefault();
        handleSave();
      }
    };

    const handleSave = () => {
      if (!token) {
        closeEdit(false);
        return;
      }
      setError(null);

      switch (name) {
        case "phone": {
          const digits = toNationalDigits(value, extension);
          if (!dialCode || !isValidNationalNumber(digits, extension)) {
            setError("Enter a valid phone number");
            return;
          }
          handlePhone(dialCode + digits);
          break;
        }
        case "email":
          if (!value || !/^\S+@\S+\.\S+$/.test(value.trim())) {
            setError("Enter a valid email");
            return;
          }
          handleEmail(value.trim());
          break;
        case "country":
          if (!value || value === userData?.country) {
            closeEdit(false);
            return;
          }
          handleProfilePut({ country: value });
          break;
        default:
          if (!value || !value.trim()) {
            setError("Name can't be empty");
            return;
          }
          handleProfilePut({ name: value.trim() });
          break;
      }
    };

    // Name and country share the same PUT; send the current values for the
    // fields not being edited so the backend doesn't blank them.
    const handleProfilePut = (changes) => {
      setLoading(true);
      const RequestData = {
        name: userData.name,
        whatsapp_opt_in: userData.whatsapp_opt_in,
        country: userData.country,
        ...changes,
      };
      axiosuserinstance
        .put("/", RequestData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const user = extractUser(res);
          // Fall back to what we sent if the response omits the field.
          setUserDetails({ ...changes, ...pickProfileFields(user) });
          setLoading(false);
          closeEdit(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(
            apiError(err, Object.keys(changes)[0]) || "Couldn't save, try again"
          );
        });
    };

    const handlePhone = (phone) => {
      setOptSent(false);
      setLoading(true);
      axiosuserinstance
        .post("/update_phone/initiate/", { phone }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setLoading(false);
          setSubmitted(phone);
          setOptSent(true);
        })
        .catch((err) => {
          setLoading(false);
          setError(apiError(err, "phone") || "Couldn't send OTP, try again");
        });
    };

    const handleEmail = (email) => {
      setOptSent(false);
      setLoading(true);
      axiosuserinstance
        .post("/update_email/initiate/", { email }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setLoading(false);
          setSubmitted(email);
          setOptSent(true);
        })
        .catch((err) => {
          setLoading(false);
          setError(apiError(err, "email") || "Couldn't send OTP, try again");
        });
    };

    const handleExtensionChangeOption = (country) => {
      if (country !== extension) resetPendingOtp();
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
          {isPhone && (
            <div className="relative">
              <div
                className={`w-fit px-2 py-[0.64rem] flex flex-row gap-2 items-center border-2 border-[#d0d5dd] rounded-md cursor-pointer ${
                  loading && "opacity-25"
                }`}
                onClick={() => !loading && setOpenCountryCodeOption(true)}
              >
                {CountryCodes?.[extension]?.img && (
                  <CountryImg
                    height="29"
                    width="29"
                    objectFit="cover"
                    alt={extension}
                    src={CountryCodes[extension].img}
                  ></CountryImg>
                )}
                <span className="text-sm">{dialCode}</span>
                <FiChevronDown />
              </div>
              {openCountryCodeOption && (
                <div className="absolute top-[110%] left-0 z-[1999]">
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
              type={isPhone ? "tel" : type}
              inputMode={isPhone ? "tel" : undefined}
              placeholder={isPhone ? getPhonePlaceholder(extension) : undefined}
              value={value ?? ""}
              onChange={(e) => onChangeValue(e)}
              onKeyDown={(e) => handleEnterKey(e)}
              className={`w-full border-2 border-[#d0d5dd] rounded-md px-2 py-[0.64rem] focus:outline-none ${
                loading && "opacity-25"
              }`}
            ></input>
            {name === "country" && (
              // The input is disabled (pick-only), so let a click anywhere on
              // it open the list rather than only the small arrow.
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={() => !loading && setOpenCountryMenu(true)}
              />
            )}
            {name === "country" && (
              <div className="absolute right-4 top-[50%] translate-y-[-50%] pointer-events-none">
                <RiArrowDropDownLine className="text-[30px]"
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
                  setValue={(country) => {
                    // Picking a country is the save — no extra ✓ press.
                    setValue(country);
                    if (country && country !== userData?.country) {
                      handleProfilePut({ country });
                    } else {
                      closeEdit(false);
                    }
                  }}
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

        {optSent && submitted && (
          <div className="flex flex-col gap-2">
            <div className="text-gray-500">OTP has been sent to {submitted}</div>

            <OPTInput
              name={name}
              token={token}
              phone={submitted}
              email={submitted}
              setUserDetails={setUserDetails}
              closeEdit={closeEdit}
            />
          </div>
        )}
      </div>
    );
  }
);

// The subset of the user payload the profile renders. Only keys the server
// actually returned are kept, so a sparse response can't blank anything.
const PROFILE_FIELDS = [
  "name",
  "country",
  "phone",
  "email",
  "is_phone_verified",
  "is_email_verified",
  "whatsapp_opt_in",
  "email_last_verified_on",
];
const pickProfileFields = (user) =>
  PROFILE_FIELDS.reduce((acc, key) => {
    if (user && user[key] !== undefined) acc[key] = user[key];
    return acc;
  }, {});

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
    setError(null);
    axiosuserinstance
      .put("/update_phone/complete/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserDetails({
          phone,
          is_phone_verified: true,
          ...pickProfileFields(extractUser(res)),
        });
        setLoading(false);
        closeEdit(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(apiError(err, "otp") || "OTP is not valid");
      });
  };

  const handleEmailOPT = ({ otp }) => {
    setLoading(true);
    setError(null);
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
        setUserDetails({
          email,
          is_email_verified: true,
          ...pickProfileFields(extractUser(res)),
        });
        setLoading(false);
        closeEdit(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(apiError(err, "otp") || "OTP is not valid");
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
          <span style={{ marginLeft: "2px", marginTop: "2px" }}>{error}</span>
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
