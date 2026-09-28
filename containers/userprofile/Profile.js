import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import {
  LuBadgeCheck,
  LuCamera,
  LuCheck,
  LuMail,
  LuMessageCircle,
  LuPenSquare,
  LuPhone,
} from "react-icons/lu";
import ImageLoader from "../../components/ImageLoader";
import { EditInput } from "./EditProfile";
import * as authaction from "../../store/actions/auth";
import { userImageUploadInstance } from "../../services/user/edit";
import { getCountryCodes } from "../../store/actions/countryCodes";
import { useAnalytics } from "../../hooks/useAnalytics";
import {
  getUserAvatarColor,
  getUserInitial,
} from "../../components/bot-components/utils/avatarColor";
import styles from "./Profile.module.scss";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

// "+916388013634" → "+91 63880 13634"; anything else is shown as stored.
const formatPhone = (phone) => {
  const digits = (phone || "").replace(/\s/g, "");
  return /^\+91\d{10}$/.test(digits)
    ? `+91 ${digits.slice(3, 8)} ${digits.slice(8)}`
    : phone;
};

// Defined at module scope: created inside the component they would be new
// types on every render, so React would remount their subtree — including an
// open EditInput, which would lose the typed value and any pending OTP.
const EditButton = ({ title, onClick, small }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`${styles.editButton} ${small ? styles.editButtonSmall : ""}`}
  >
    <span className={styles.editCircle}>
      <LuPenSquare size={15} />
    </span>
  </button>
);

// Rendered twice per row: inline beside the value on wide desktop, and on its
// own line underneath below 1100px (CSS picks which one shows).
const UnverifiedCta = ({ onVerify, className }) => (
  <span className={`${styles.verifyGroup} ${className}`}>
    <span className={styles.unverified}>Not verified</span>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onVerify();
      }}
      className={styles.verifyButton}
    >
      Verify
    </button>
  </span>
);

const VerifiedBadge = ({ title }) => (
  <span className={styles.verified} title={title}>
    <LuBadgeCheck size={15} />
    Verified
  </span>
);

const Profile = (props) => {
  const [editImage, setEditImage] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editCounty, setEditCounry] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [whatsapp, setWhatsapp] = useState(props.whatsapp_opt_in);
  const [file, setFile] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState("");
  const fileInputRef = useRef();
  const imageEditRef = useRef();
  const flashTimer = useRef();
  const { trackUserAccountUpdate } = useAnalytics();

  const hasImage = !!props.image && props.image !== "null";

  // Logged in with no profile picture → colored letter avatar (matches the bot
  // Sidebar). The color is persisted per-user in localStorage so it never changes.
  const showColorAvatar = !!props.token && !hasImage;
  const [avatarColor, setAvatarColor] = useState(null);
  useEffect(() => {
    setAvatarColor(showColorAvatar ? getUserAvatarColor(props.name) : null);
  }, [showColorAvatar, props.name]);

  useEffect(() => {
    props.getCountryCodes();
    return () => clearTimeout(flashTimer.current);
  }, []);

  const showFlash = (message) => {
    setFlash(message);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(""), 2600);
  };

  // Mirror the stored value (auth hydrates after mount), but only PUT when the
  // user actually toggles. This used to fire on mount too, re-saving
  // name/country/whatsapp from a possibly not-yet-hydrated store.
  useEffect(() => {
    setWhatsapp(!!props.whatsapp_opt_in);
  }, [props.whatsapp_opt_in]);

  const toggleWhatsapp = () => {
    const next = !whatsapp;
    setWhatsapp(next);
    props.changeUserDetails(
      { name: props.name, country: props.country, whatsapp_opt_in: next },
      trackUserAccountUpdate
    );
    showFlash(next ? "WhatsApp on" : "WhatsApp off");
  };

  useEffect(() => {
    if (!file) return;
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("That photo is too big. Keep it under 5 megabytes.");
      return;
    }

    onFileUpload();
  }, [file]);

  useEffect(() => {
    const closeImageMenu = (e) => {
      if (imageEditRef.current && !imageEditRef.current.contains(e.target)) {
        setEditImage(false);
      }
    };
    document.addEventListener("click", closeImageMenu);
    return () => document.removeEventListener("click", closeImageMenu);
  }, []);

  const onFileChange = (e) => {
    const picked = e.target.files && e.target.files[0];
    // Reset so picking the same file again still fires onChange.
    e.target.value = "";
    if (!picked) return;
    setPhotoError(null);
    setFile(picked);
  };

  const onFileUpload = async (remove = false) => {
    setEditImage(false);
    setPhotoError(null);

    if (remove) {
      setLoading(true);

      userImageUploadInstance
        .delete("", {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        })
        .then((response) => {
          // Force the image keys to null so the cached picture is cleared from
          // localStorage and redux, regardless of the delete response shape.
          props.setUserDetails({
            ...response.data,
            profile_pic: null,
            user_image: null,
          });
          setLoading(false);
          showFlash("Photo removed");
        })
        .catch((err) => {
          setLoading(false);
          setPhotoError("Couldn't remove your photo. Try again.");
          console.log("[ERROR][EditProfile:onFileUpload]: ", err.message);
        });

      return;
    }

    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("profile_pic", file);

    userImageUploadInstance
      .put("", formData, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        props.setUserDetails(response.data);
        setLoading(false);
        showFlash("Photo updated");
      })
      .catch((err) => {
        setLoading(false);
        setPhotoError("Couldn't upload that photo. Try again.");
        console.log("[ERROR][EditProfile:onFileUpload]: ", err.message);
      });
  };

  const triggerFileInput = () => {
    setEditImage(false);
    fileInputRef.current.click();
  };

  // With a photo there's something to remove, so offer the menu; without one
  // the only action is uploading, so go straight to the file picker.
  const onPhotoButton = () => {
    if (loading) return;
    if (hasImage) setEditImage((prev) => !prev);
    else triggerFileInput();
  };

  const userData = {
    name: props.name,
    whatsapp_opt_in: props.whatsapp_opt_in,
    country: props.country,
  };

  const hasCountry =
    props.country && props.country !== "" && props.country !== "null";
  const countryFlag = hasCountry ? props.CountryCodes?.[props.country]?.img : null;

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <div className={styles.headText}>
          {/* <span className={styles.eyebrow}>Account</span> */}
          <h1 className={styles.title}>
            Your <span className={styles.serif}>profile</span>
          </h1>
        </div>
        {flash ? (
          <span className={styles.flash} role="status">
            ✓ {flash}
          </span>
        ) : null}
      </div>

      <div className={styles.identity}>
        <div ref={imageEditRef} className={styles.avatarWrap}>
          <div className={styles.avatarRing}>
            <div
              className={`${styles.avatar} ${loading ? "animate-pulse" : ""}`}
            >
              {showColorAvatar ? (
                <div
                  className={styles.avatarInitial}
                  style={{ background: avatarColor || "#2563EB" }}
                >
                  {getUserInitial(props.name)}
                </div>
              ) : (
                <ImageLoader
                  borderRadius="50%"
                  url={hasImage ? props.image : "media/icons/navigation/profile-user.png"}
                  width="100%"
                  height="100%"
                  widthmobile="100%"
                  heightmobile="100%"
                  dimesions={{ width: 1600, height: 1600 }}
                  dimensionsMobile={{ width: 1600, height: 1600 }}
                  noPlaceholder={true}
                />
              )}
              {loading ? <div className={styles.avatarBusy} /> : null}
            </div>
          </div>

          <button
            type="button"
            onClick={onPhotoButton}
            className={styles.photoButton}
            aria-haspopup={hasImage ? "menu" : undefined}
            aria-expanded={hasImage ? editImage : undefined}
          >
            <LuCamera size={14} />
            Edit
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          ></input>

          {editImage && (
            <div className={styles.photoMenu} role="menu">
              <button
                type="button"
                role="menuitem"
                onClick={triggerFileInput}
                className={styles.menuItem}
              >
                Upload new photo
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => onFileUpload(true)}
                className={`${styles.menuItem} ${styles.menuItemDanger}`}
              >
                Remove photo
              </button>
            </div>
          )}
        </div>

        {photoError ? (
          <div className={styles.photoError}>{photoError}</div>
        ) : null}

        {editName ? (
          <div className={styles.identityEditor}>
            <EditInput
              name="name"
              type="text"
              text={props.name}
              closeEdit={setEditName}
              onSaved={() => showFlash("Name saved")}
              userData={userData}
            />
          </div>
        ) : (
          <div className={styles.nameLine}>
            <p className={styles.name}>{props.name}</p>
            <EditButton title="Edit name" onClick={() => setEditName(true)} />
          </div>
        )}

        {editCounty ? (
          <div className={styles.identityEditor}>
            <EditInput
              name="country"
              type="text"
              text={props.country ? props.country : ""}
              closeEdit={setEditCounry}
              onSaved={() => showFlash("Country saved")}
              userData={userData}
            />
          </div>
        ) : hasCountry ? (
          <div className={styles.countryLine}>
            {countryFlag ? (
              <span className={styles.flag}>
                <img src={countryFlag} alt="" />
              </span>
            ) : null}
            <span className={styles.country}>{props.country}</span>
            <EditButton
              small
              title="Edit country"
              onClick={() => setEditCounry(true)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditCounry(true)}
            className={styles.addLink}
          >
            Add your country
          </button>
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.row}>
          <div className={styles.label}>
            <LuPhone size={13} />
            Contact number
          </div>
          <div className={styles.value}>
            {editPhone ? (
              <div className={styles.rowEditor}>
                <EditInput
                  name="phone"
                  type="text"
                  text={props.phone}
                  closeEdit={setEditPhone}
                  onSaved={() => showFlash("Number verified")}
                  userData={userData}
                />
              </div>
            ) : (
              <>
                <div className={styles.valueLine}>
                  <span
                    className={`${styles.valueText} ${
                      props.phone ? "" : styles.valueEmpty
                    }`}
                  >
                    {props.phone ? formatPhone(props.phone) : "Add your number"}
                  </span>
                  {props.is_phone_verified ? (
                    <VerifiedBadge title="Verified" />
                  ) : (
                    <UnverifiedCta
                      onVerify={() => setEditPhone(true)}
                      className={styles.verifyInline}
                    />
                  )}
                  <EditButton
                    title="Change number"
                    onClick={() => setEditPhone(true)}
                  />
                </div>
                {!props.is_phone_verified ? (
                  <UnverifiedCta
                    onVerify={() => setEditPhone(true)}
                    className={styles.verifyBelow}
                  />
                ) : null}
              </>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={`${styles.label} ${styles.labelDesktopOnly}`}>
            <LuMessageCircle size={13} />
            WhatsApp
          </div>
          <div className={styles.value}>
            <button
              type="button"
              role="checkbox"
              aria-checked={!!whatsapp}
              onClick={toggleWhatsapp}
              className={styles.checkbox}
            >
              <span
                className={`${styles.checkboxBox} ${
                  whatsapp ? styles.checkboxOn : ""
                }`}
              >
                <LuCheck size={13} strokeWidth={3} />
              </span>
              <span>Receive booking updates on WhatsApp</span>
            </button>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>
            <LuMail size={13} />
            Email
          </div>
          <div className={styles.value}>
            {editEmail ? (
              <div className={styles.rowEditor}>
                <EditInput
                  name="email"
                  type="email"
                  text={props.email}
                  closeEdit={setEditEmail}
                  onSaved={() => showFlash("Email verified")}
                  userData={userData}
                />
              </div>
            ) : (
              <>
                <div className={styles.valueLine}>
                  <span
                    className={`${styles.valueText} ${
                      props.email ? "" : styles.valueEmpty
                    }`}
                  >
                    {props.email || "Add your email"}
                  </span>
                  {props.is_email_verified ? (
                    <VerifiedBadge
                      title={
                        props.email_last_verified_on
                          ? `Last verified on ${new Date(
                              props.email_last_verified_on
                            ).toDateString()}`
                          : "Verified"
                      }
                    />
                  ) : (
                    <UnverifiedCta
                      onVerify={() => setEditEmail(true)}
                      className={styles.verifyInline}
                    />
                  )}
                  <EditButton
                    title="Change email"
                    onClick={() => setEditEmail(true)}
                  />
                </div>
                {!props.is_email_verified ? (
                  <UnverifiedCta
                    onVerify={() => setEditEmail(true)}
                    className={styles.verifyBelow}
                  />
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToPros = (state) => {
  return {
    otpFail: state.auth.otpFail,
    name: state.auth.name,
    country: state.auth.country,
    phone: state.auth.phone,
    is_phone_verified: state.auth.is_phone_verified,
    email: state.auth.email,
    is_email_verified: state.auth.is_email_verified,
    image: state.auth.image,
    token: state.auth.token,
    whatsapp_opt_in: state.auth.whatsapp_opt_in,
    email_last_verified_on: state.auth.email_last_verified_on,
    CountryCodes: state.CountryCodes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeUserDetails: (payload, trackUserAccountUpdate) =>
      dispatch(authaction.changeUserDetails(payload, trackUserAccountUpdate)),
    setUserDetails: (payload) => dispatch(authaction.setUserDetails(payload)),
    getCountryCodes: () => dispatch(getCountryCodes()),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Profile);
