import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import LeadPaxDetails from "./LeadPaxDetails";
import OtherPassengers from "./OtherPassengers";
import { MERCURY_HOST } from "../../../services/constants";
import { openNotification } from "../../../store/actions/notification";

const buildAdult = (isLead = false) => ({
  title: "Mr",
  first_name: "",
  last_name: "",
  gender: "male",
  dob: "",
  email: "",
  contact_number: "",
  is_lead: isLead,
  type: "adult",
  passport_number: "",
  passport_expiry: "",
  passport_issue_date: "",
});

const buildChild = () => ({
  title: "Mr",
  first_name: "",
  last_name: "",
  gender: "Male",
  dob: "",
  type: "child",
  is_lead: false,
});

const buildInfant = () => ({
  title: "Mr",
  first_name: "",
  last_name: "",
  gender: "Male",
  dob: "",
  type: "infant",
  is_lead: false,
});

const GST_FIELDS = [
  "gst_number",
  "gst_company_name",
  "gst_company_email",
  "gst_company_contact_number",
  "gst_company_address",
];

const buildEmptyGst = () =>
  GST_FIELDS.reduce((acc, key) => ({ ...acc, [key]: "" }), {});

const normalizeGender = (g) => {
  if (!g) return "Male";
  const lower = g.toString().trim().toLowerCase();
  if (lower === "female") return "Female";
  if (lower === "male") return "Male";
  return g;
};

const hydrateFromApi = (apiTraveller, defaults) => {
  if (!apiTraveller) return { ...defaults };
  const merged = { ...defaults };
  Object.keys(defaults).forEach((key) => {
    if (key in apiTraveller) {
      const v = apiTraveller[key];
      merged[key] = v == null ? defaults[key] ?? "" : v;
    }
  });
  if ("gender" in defaults) {
    merged.gender = normalizeGender(merged.gender);
  }
  return merged;
};

const flattenToString = (val) => {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) {
    return val.map(flattenToString).filter(Boolean).join(", ");
  }
  if (typeof val === "object") {
    return Object.values(val).map(flattenToString).filter(Boolean).join(", ");
  }
  return "";
};

const extractErrorMessage = (error) => {
  const fallback = "Failed to save traveller details.";
  const errorData = error?.response?.data;
  if (!errorData) return fallback;

  if (typeof errorData === "string") return errorData;

  if (Array.isArray(errorData?.errors)) {
    const first = errorData.errors[0];
    if (first && typeof first === "object" && first.message != null) {
      const msg = flattenToString(first.message);
      if (msg) return msg;
    }
    const flat = flattenToString(errorData.errors);
    if (flat) return flat;
  }

  if (errorData?.errors && typeof errorData.errors === "object") {
    const firstKey = Object.keys(errorData.errors)[0];
    if (firstKey != null) {
      const msg = flattenToString(errorData.errors[firstKey]);
      if (msg) return `${firstKey}: ${msg}`;
    }
  }

  if (errorData?.detail) {
    const msg = flattenToString(errorData.detail);
    if (msg) return msg;
  }

  if (errorData?.message) {
    const msg = flattenToString(errorData.message);
    if (msg) return msg;
  }

  const flatRoot = flattenToString(errorData);
  return flatRoot || fallback;
};

const AddTravellerDetails = ({ itinerary, onSuccess }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const expectedAdults = itinerary?.number_of_adults || 1;
  const expectedChildren = itinerary?.number_of_children || 0;
  const expectedInfants = itinerary?.number_of_infants || 0;

  const existingTravellers = Array.isArray(itinerary?.travellers)
    ? itinerary.travellers
    : [];
  const existingLead = existingTravellers.find((t) => t?.is_lead);
  const existingNonLeadAdults = existingTravellers.filter(
    (t) => !t?.is_lead && (t?.type === "adult" || !t?.type)
  );
  const existingChildren = existingTravellers.filter(
    (t) => t?.type === "child"
  );
  const existingInfants = existingTravellers.filter(
    (t) => t?.type === "infant"
  );

  const fillSlots = (length, sourceList, defaultsBuilder) =>
    Array.from({ length }, (_, i) =>
      hydrateFromApi(sourceList[i], defaultsBuilder())
    );

  const [lead, setLead] = useState(() =>
    hydrateFromApi(existingLead, {
      ...buildAdult(true),
      ...buildEmptyGst(),
    })
  );
  const [adults, setAdults] = useState(() =>
    fillSlots(Math.max(expectedAdults - 1, 0), existingNonLeadAdults, () =>
      buildAdult(false)
    )
  );
  const [children, setChildren] = useState(() =>
    fillSlots(expectedChildren, existingChildren, buildChild)
  );
  const [infants, setInfants] = useState(() =>
    fillSlots(expectedInfants, existingInfants, buildInfant)
  );
  const [showGst, setShowGst] = useState(() => {
    if (!existingLead) return false;
    return GST_FIELDS.some((f) => {
      const v = existingLead[f];
      return v != null && v.toString().trim() !== "";
    });
  });
  const [submitting, setSubmitting] = useState(false);

  const handleGstChange = (e) => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!lead.first_name?.trim() || !lead.last_name?.trim()) {
      return "Lead traveller's first and last name are required.";
    }
    if (!lead.gender?.toString().trim()) {
      return "Lead traveller's gender is required.";
    }
    if (!lead.dob?.toString().trim()) {
      return "Lead traveller's date of birth is required.";
    }
    if (!lead.email?.trim()) {
      return "Lead traveller must provide an email.";
    }
    if (!lead.contact_number?.trim()) {
      return "Lead traveller must provide a contact number.";
    }

    if (showGst) {
      const missing = GST_FIELDS.filter((f) => !lead[f]?.toString().trim());
      if (missing.length && missing.length !== GST_FIELDS.length) {
        return "All GST details must be provided.";
      }
    }

    const labelFor = (g, i, kind) => `${kind} ${i + 1}`;
    const groups = [
      { list: adults, kind: "Adult", offset: 1 },
      { list: children, kind: "Child", offset: 0 },
      { list: infants, kind: "Infant", offset: 0 },
    ];
    for (const { list, kind, offset } of groups) {
      for (let i = 0; i < list.length; i++) {
        const g = list[i];
        const label = labelFor(g, i + offset, kind);
        if (!g.first_name?.trim() || !g.last_name?.trim()) {
          return `Please fill in name for ${label}.`;
        }
        if (!g.gender?.toString().trim()) {
          return `Please select gender for ${label}.`;
        }
        if (!g.dob?.toString().trim()) {
          return `Please select date of birth for ${label}.`;
        }
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      dispatch(
        openNotification({
          type: "error",
          text: error,
          heading: "Validation Error",
        })
      );
      return;
    }

    const leadPayload = { ...lead };
    if (!showGst) {
      GST_FIELDS.forEach((f) => delete leadPayload[f]);
    }

    const emptyToNull = (g) =>
      Object.fromEntries(
        Object.entries(g).map(([k, v]) => [
          k,
          typeof v === "string" && v.trim() === "" ? null : v,
        ])
      );

    const guests = [leadPayload, ...adults, ...children, ...infants].map(
      emptyToNull
    );

    try {
      setSubmitting(true);
      await axios.post(
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/guests/bookings/add/`,
        { guests },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      dispatch(
        openNotification({
          type: "success",
          text: "Traveller details saved successfully.",
          heading: "Success!",
        })
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      dispatch(
        openNotification({
          type: "error",
          text: extractErrorMessage(err),
          heading: "Error!",
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  const sectionDivider = "border-t-sm border-text-disabled pt-lg mt-lg";
  const subTitle =
    "text-md font-500 leading-xl text-primary-indigo mb-sm";
  const fieldShellBase =
    "flex h-[44px] items-center border-sm border-text-disabled rounded-md-lg bg-white overflow-hidden focus-within:border-primary-indigo transition-colors";
  const inputBase =
    "w-full h-full px-sm text-sm-md font-400 leading-md text-text-charcolblack outline-none placeholder:text-text-placeholder bg-transparent";
  const labelBase =
    "text-sm font-400 leading-sm-md text-text-spacegrey mb-xxs block";

  const otherTravellerCount =
    adults.length + children.length + infants.length;

  return (
    <div className="font-lexend bg-white">
      <LeadPaxDetails input={lead} setInput={setLead} />

      <div className={sectionDivider}>
        <label className="inline-flex items-center gap-xs cursor-pointer w-fit">
          <input
            type="checkbox"
            className="w-[16px] h-[16px] accent-primary-indigo cursor-pointer"
            checked={showGst}
            onChange={(e) => setShowGst(e.target.checked)}
          />
          <span className="text-sm-md font-500 leading-md text-text-charcolblack">
            Add GST Details{" "}
            <span className="text-text-spacegrey font-400">(optional)</span>
          </span>
        </label>

        {showGst && (
          <div className="mt-md grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className={labelBase}>GST Number</label>
              <div className={fieldShellBase}>
                <input
                  className={inputBase}
                  name="gst_number"
                  placeholder="Enter GST Number"
                  value={lead.gst_number}
                  onChange={handleGstChange}
                />
              </div>
            </div>
            <div>
              <label className={labelBase}>Company Name</label>
              <div className={fieldShellBase}>
                <input
                  className={inputBase}
                  name="gst_company_name"
                  placeholder="Enter Company Name"
                  value={lead.gst_company_name}
                  onChange={handleGstChange}
                />
              </div>
            </div>
            <div>
              <label className={labelBase}>Company Email</label>
              <div className={fieldShellBase}>
                <input
                  className={inputBase}
                  name="gst_company_email"
                  type="email"
                  placeholder="Enter Company Email"
                  value={lead.gst_company_email}
                  onChange={handleGstChange}
                />
              </div>
            </div>
            <div>
              <label className={labelBase}>Company Contact Number</label>
              <div className={fieldShellBase}>
                <input
                  className={inputBase}
                  name="gst_company_contact_number"
                  type="tel"
                  placeholder="Enter Company Contact Number"
                  value={lead.gst_company_contact_number}
                  onChange={handleGstChange}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className={labelBase}>Company Address</label>
              <div className={fieldShellBase}>
                <input
                  className={inputBase}
                  name="gst_company_address"
                  placeholder="Enter Company Address"
                  value={lead.gst_company_address}
                  onChange={handleGstChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {otherTravellerCount > 0 && (
        <div className={sectionDivider}>
          <div className="text-md-lg font-500 leading-xl-md text-primary-indigo mb-md">
            Other Travellers
          </div>

          <div className="space-y-lg">
            {adults.map((_, index) => (
              <div key={`adult-${index}`}>
                <div className={subTitle}>Adult {index + 2}</div>
                <OtherPassengers
                  input={adults}
                  setInput={setAdults}
                  index={index}
                />
              </div>
            ))}

            {children.map((_, index) => (
              <div key={`child-${index}`}>
                <div className={subTitle}>Child {index + 1}</div>
                <OtherPassengers
                  input={children}
                  setInput={setChildren}
                  index={index}
                />
              </div>
            ))}

            {infants.map((_, index) => (
              <div key={`infant-${index}`}>
                <div className={subTitle}>Infant {index + 1}</div>
                <OtherPassengers
                  input={infants}
                  setInput={setInfants}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-xl pt-lg border-t-sm border-text-disabled">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-primary-yellow text-primary-indigo font-500 leading-md text-sm-md px-xl py-sm rounded-md-lg border-sm border-primary-indigo hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
        >
          {submitting ? "Saving..." : "Save Traveller Details"}
        </button>
      </div>
    </div>
  );
};

export default AddTravellerDetails;
