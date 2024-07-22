import Image from "next/image";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { MdDone } from "react-icons/md";
import styled from "styled-components";
import OTPInput from "react-otp-input";
import { BiError } from "react-icons/bi";
import { FiChevronDown } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";
import CountryCodeDropdown from "../../components/userauth/CountryDropdown";
import axiosuserinstance, {
  userEmailEditInstance,
  userImageUploadInstance,
} from "../../services/user/edit";
import * as authaction from "../../store/actions/auth";
import extensions from "../../public/content/extensionsdata";
import { useRef } from "react";

const CountryCodeContainer = styled.div`
  position: relative;
  width: 90px;
  height: 3.1rem;
  .CountryInput {
    display: grid;
    border: 2px solid #d0d5dd;
    border-radius: 0.5rem;
    grid-template-columns: 1fr 1fr 1fr;
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

const CountryCodeOption = styled.div`
  display: grid;
  grid-template-columns: 0.7fr max-content;
  padding-inline: 0.2rem;
  gap: 0.6rem;
  &:hover {
    cursor: pointer;
  }
  text-align: center;
  height: 2rem !important;
  margin-block: 0.5rem;

  p {
    margin: auto;
  }
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserDetails: (payload) => dispatch(authaction.setUserDetails(payload)),
  };
};

export const EditInput = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ token, type, name, text, closeEdit, setUserDetails }) => {
  const [value, setValue] = useState(text);
  const [loading, setLoading] = useState(false);
  const [optSent, setOptSent] = useState(false);
  const [extension, setExtension] = useState("India");
  const [openCountryCodeOption, setOpenCountryCodeOption] = useState(false);
  const [ExtensionOptions, setExtensionOptions] = useState([]);

  useEffect(() => {
    let Options = [];
    for (const country in extensions) {
      Options.push(
        <CountryCodeOption
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
            src={extensions[country].img}
            onClick={() => handleExtensionChangeOption(country)}
          ></CountryImg>
          <p>{extensions[country].label}</p>
        </CountryCodeOption>,
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
    const pattern = /^(\+\d{1,3})(\d{10})$/;
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
    for (const country in extensions) {
      if (extensions[country].label === code) {
        return extensions[country].value;
      }
    }
    return null;
  };

  const handleSave = () => {
    if (token) {
      if (
        (name === "phone" && extensions[extension].label + value !== text) ||
        ((name === "email" || name === "name") && value != text)
      ) {
        setLoading(true);
        let data = {};
        data[name] = value;

        switch (name) {
          case "phone":
            handlePhone({
              data: { phone: extensions[extension].label + value },
            });
            break;
          case "email":
            handleEmail({ email: value });
            break;
          default:
            handleName({ data });
            break;
        }
      } else {
        closeEdit(false);
      }
    } else {
      closeEdit(false);
    }
  };

  const handleName = ({ data }) => {
    axiosuserinstance
      .patch("", data, {
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
        if (err.response.data.name) {
          console.log(err.response.data.name[0]);
        } else {
          console.log(err.response.data);
        }
      });
  };

  const handlePhone = ({ data }) => {
    setOptSent(false);
    axiosuserinstance
      .post("phone_change/initiate/", data, {
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
        closeEdit(false);
        if (err.response.data.phone) {
          console.log(err.response.data.phone[0]);
        } else {
          console.log(err.response.data);
        }
      });
  };

  const handleEmail = ({ email }) => {
    setOptSent(false);
    userEmailEditInstance
      .get(`initiate/?email=${email}`, {
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
        closeEdit(false);
        if (err.response.data.email) {
          console.log(err.response.data.email[0]);
        } else {
          console.log(err.response.data);
        }
      });
  };

  const handleExtensionChangeOption = (country) => {
    setExtension(country);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2">
      <div
        className={`w-full flex flex-row justify-center items-center gap-3 ${
          name === "name" ? "md:justify-center" : "md:justify-start"
        }`}
      >
        {name === "phone" && (
          <CountryCodeContainer>
            <div
              className="CountryInput"
              onClick={() => setOpenCountryCodeOption(true)}
            >
              <CountryImg
                height="29"
                width="29"
                objectFit="cover"
                src={extensions[extension].img}
              ></CountryImg>

              <p>{extensions[extension].label} </p>
              <FiChevronDown />
            </div>
            {openCountryCodeOption && (
              <CountryCodeDropdown
                onClose={() => setOpenCountryCodeOption(false)}
                ExtensionOptions={ExtensionOptions}
              />
            )}
          </CountryCodeContainer>
        )}

        <input
          autoFocus
          disabled={loading}
          name={name}
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`w-[60%] border-2 border-[#d0d5dd] rounded-md px-2 py-[0.64rem] focus:outline-none ${
            loading && "opacity-25"
          }`}
        ></input>

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
            phone={extensions[extension].label + value}
            email={value}
            setUserDetails={setUserDetails}
            closeEdit={closeEdit}
          />
        </div>
      )}
    </div>
  );
});

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
      .patch("phone_change/complete/", data, {
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
    userEmailEditInstance
      .get(`complete/?otp=${otp}`, {
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

export const ImageInput = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ children, setEditImage, setUserDetails, token }) => {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    userImageUploadInstance
      .patch("", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setUserDetails(response.data);
        setLoading(true);
        setEditImage(false);
      })
      .catch((err) => {
        setLoading(true);
        setEditImage(false);
        console.log("[ERROR][EditProfile:onFileUpload]: ", err.message);
      });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`relative w-[45%] flex flex-col gap-3 items-center ${loading && "opacity-50"}`}
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
