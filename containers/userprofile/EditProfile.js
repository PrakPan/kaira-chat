import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { LuChevronDown, LuImagePlus } from "react-icons/lu";
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
import styles from "./Profile.module.scss";

// Country preselected in the phone picker when the stored number can't be
// parsed and the profile has no country.
const DEFAULT_COUNTRY = "India";

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
// Known backend messages, reworded for people (and so "OTP" never shows up
// in all caps on screen).
const FRIENDLY_ERRORS = {
  "This phone number is associated with another account!":
    "That number's already on another account. Try a different one.",
  "Invalid otp provided.": "That code doesn't match. Check your messages and try again.",
  "This email is associated with another account!":
    "That email's already on another account. Try a different one.",
  "Invalid OTP!": "That code doesn't match. Check your inbox and try again.",
  "OTP not found!": "That code has expired. Send a new one.",
};

const apiError = (err, field) => {
  const body = err?.response?.data;
  const pick = (v) => (Array.isArray(v) ? v[0] : v);
  const message =
    pick(body?.[field]) ||
    pick(body?.errors?.[0]?.[field]) ||
    pick(body?.detail) ||
    pick(body?.message) ||
    (err?.response ? null : "Network error, please try again");
  return FRIENDLY_ERRORS[message] || message;
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
    onSaved,
    setUserDetails,
    userData,
  }) => {
    const isPhone = name === "phone";
    const isContact = isPhone || name === "email";
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
          onSaved?.();
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
          setError(apiError(err, "phone") || "Couldn't send the code. Try again.");
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
          setError(apiError(err, "email") || "Couldn't send the code. Try again.");
        });
    };

    const handleExtensionChangeOption = (country) => {
      if (country !== extension) resetPendingOtp();
      setExtension(country);
    };

    const primaryLabel = loading
      ? isContact
        ? "Sending…"
        : "Saving…"
      : isContact
      ? "Send code"
      : "Save";

    // Keep the code step up while a resend is in flight (handlePhone/Email
    // clear optSent first), so the row doesn't flash back to the input.
    const showOtp = isContact && !!submitted && (optSent || loading);

    return (
      <div ref={ref} className={styles.editor}>
        {showOtp ? (
          <OPTInput
            name={name}
            token={token}
            phone={submitted}
            email={submitted}
            setUserDetails={setUserDetails}
            closeEdit={closeEdit}
            onSaved={onSaved}
            onResend={handleSave}
            onBack={resetPendingOtp}
            resending={loading}
          />
        ) : (
          <>
            <div className={styles.editorRow}>
              {isPhone && (
                <div className="relative">
                  <button
                    type="button"
                    disabled={loading}
                    className={styles.dialCode}
                    onClick={() => setOpenCountryCodeOption(true)}
                  >
                    {CountryCodes?.[extension]?.img && (
                      <img alt={extension} src={CountryCodes[extension].img} />
                    )}
                    <span>{dialCode}</span>
                    <LuChevronDown size={16} />
                  </button>
                  {openCountryCodeOption && (
                    <div className={styles.popover}>
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

              <div className={styles.editorField}>
                {name === "country" ? (
                  // Pick-only: the whole field opens the list, and picking a
                  // country is the save.
                  <button
                    type="button"
                    autoFocus
                    disabled={loading}
                    className={`${styles.input} ${styles.selectTrigger}`}
                    onClick={() => setOpenCountryMenu(true)}
                  >
                    {CountryCodes?.[value]?.img && (
                      <img alt="" src={CountryCodes[value].img} />
                    )}
                    <span>{value || "Pick your country"}</span>
                  </button>
                ) : (
                  <input
                    autoFocus
                    disabled={loading}
                    name={name}
                    type={isPhone ? "tel" : type}
                    inputMode={isPhone ? "tel" : undefined}
                    placeholder={
                      isPhone
                        ? getPhonePlaceholder(extension)
                        : name === "email"
                        ? "you@example.com"
                        : "Your full name"
                    }
                    value={value ?? ""}
                    onChange={(e) => onChangeValue(e)}
                    onKeyDown={(e) => handleEnterKey(e)}
                    className={styles.input}
                  ></input>
                )}
                {name === "country" && (
                  <LuChevronDown size={16} className={styles.selectChevron} />
                )}

                {name === "country" && openCountryMenu && (
                  <CountryMenu
                    setValue={(country) => {
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
                )}
              </div>

              <div className={styles.editorActions}>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSave}
                  className={styles.primaryButton}
                >
                  {primaryLabel}
                </button>
                <button
                  type="button"
                  onClick={() => closeEdit(false)}
                  className={styles.ghostButton}
                >
                  Cancel
                </button>
              </div>
            </div>

            {error && <div className={styles.editorError}>{error}</div>}
          </>
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

const OPTInput = ({
  name,
  token,
  phone,
  email,
  setUserDetails,
  closeEdit,
  onSaved,
  onResend,
  onBack,
  resending,
}) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // A full code submits on its own; the Verify button is there for anyone who
  // expects to press something.
  useEffect(() => {
    if (value.length === 4) submit();
  }, [value]);

  const submit = () => {
    if (loading) return;
    if (value.length < 4) {
      setError("Enter the 4-digit code.");
      return;
    }
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
  };

  const onFail = (err) => {
    setLoading(false);
    setValue("");
    setError(
      apiError(err, "otp") || "That code doesn't match. Check it and try again."
    );
  };

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
        onSaved?.();
        closeEdit(false);
      })
      .catch(onFail);
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
        onSaved?.();
        closeEdit(false);
      })
      .catch(onFail);
  };

  return (
    <>
      <div className={styles.editorNote}>
        Code sent to <b>{name === "phone" ? phone : email}</b>
      </div>
      <div className={styles.editorRow}>
        <input
          autoFocus
          disabled={loading}
          value={value}
          onChange={(e) => {
            setValue(e.target.value.replace(/\D/g, "").slice(0, 4));
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="0000"
          aria-label="Verification code"
          className={styles.otpInput}
        />
        <div className={styles.editorActions}>
          <button
            type="button"
            disabled={loading}
            onClick={submit}
            className={styles.primaryButton}
          >
            {loading ? "Checking…" : "Verify"}
          </button>
          <button
            type="button"
            onClick={() => closeEdit(false)}
            className={styles.ghostButton}
          >
            Cancel
          </button>
        </div>
      </div>
      {error && <div className={styles.editorError}>{error}</div>}
      <div className={styles.editorLinks}>
        <button
          type="button"
          disabled={resending || loading}
          onClick={onResend}
          className={styles.textLink}
        >
          {resending ? "Sending…" : "Resend"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className={`${styles.textLink} ${styles.textLinkMuted}`}
        >
          {name === "phone" ? "Different number" : "Different email"}
        </button>
      </div>
    </>
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

    const option = (key, country) => (
      <button
        type="button"
        className={styles.countryOption}
        key={key}
        onClick={() => {
          setValue(country.value), setOpenCountryMenu(false);
        }}
      >
        <img alt="" loading="lazy" src={country.img} />
        <span>{country.value}</span>
      </button>
    );

    if (search) {
      for (const country of searchCountries(search)) {
        Options.push(option(country.value, country));
      }
    } else {
      for (const country in CountryCodes) {
        Options.push(option(country, CountryCodes[country]));
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
    <div ref={ref} className={styles.countryMenu}>
      <div className={styles.countryMenuSearch}>
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className={styles.input}
          placeholder="Search countries"
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
