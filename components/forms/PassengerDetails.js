import { useEffect, useState } from "react";
import RequiredLabel from "../ui/RequiredLabel";
import {
  PassengerContainer,
  PassengerHeader,
  Checkbox,
  PassengerTitle,
  Divider,
  PassengerForm,
  FormGroup,
  Input,
  Select,
  LeadCheckboxContainer,
  Label,
} from "../modals/flights/new-flight-searched/FlightStyles";

export default function PassengerDetails({ index, data, setData, name, ssr ,isDomestic,setPrice,price}) {
  const defaultFormData = {
    title: "",
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    contact_number: "",
    isLeadPax: false,
    ssr: { meal: [], baggage: [] },
  };
  const [prevPrice,setPrevPrice]=useState(0);

  const [formData, setFormData] = useState(data[index] || defaultFormData);
  const [isChecked, setIsChecked] = useState(true);

  useEffect(() => {
    const newFormData = data[index] || defaultFormData;
    setFormData(newFormData);
  }, [data, index]);
  

  const updateData = (updatedForm) => {
    setData((prev) => {
      const newData = [...prev];
      newData[index] = updatedForm;
      var pax_type=1;
      if(name==="Children"){
        pax_type=2;
      }
      if(name==="Infants"){
        pax_type=3;
      }
      if (index === 0) {
        newData[index].isLeadPax = true;
      } else {
        newData[index].isLeadPax = false;
      }
      newData[index].pax_type=pax_type
  
      return newData;
    });
  };
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedForm = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(updatedForm);
    updateData(updatedForm);
  };


  const handleSSRChange = (type, event) => {
    const value = event.target.value;
    setFormData((prev) => {
      const updatedSSR = {
        ...prev.ssr,
        [type]: value ? [{ ...JSON.parse(value) }] : [],
      };
      const updatedData = { ...prev, ssr: updatedSSR };
      updateData(updatedData);
      return updatedData;
    });
    setPrice((prev)=>{
      return{
      ...prev,
      addOns:price.addOns-prevPrice+JSON.parse(value).amt,
      totalAmount:price.totalAmount-prevPrice+JSON.parse(value).amt
    }})
    setPrevPrice(JSON.parse(value).amt)
  };

  return (
    <PassengerContainer>
      <PassengerHeader>
        <Checkbox
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked((prev) => !prev)}
        />
        <PassengerTitle>
          {name} {index + 1}
        </PassengerTitle>
      </PassengerHeader>
      <Divider />

      {isChecked && (
        <>
          <PassengerForm>
            {[
              {
                label: "Title",
                name: "title",
                type: "select",
                options: ["Mr", "Ms", "Mrs"],
              },
              { label: "First Name", name: "first_name", type: "text" },
              { label: "Last Name", name: "last_name", type: "text" },
              { label: "Contact Number", name: "contact_number", type: "text" },
              {
                label: "Gender",
                name: "gender",
                type: "select",
                options: ["male", "female"],
              },
              { label: "Date of Birth", name: "dob", type: "date" },
              ...(index === 0
                ? [{ label: "Email", name: "email", type: "email" }]
                : []),
            ].map(({ label, name, type, options }) => (
              <FormGroup key={name}>
                <RequiredLabel
                  text={label}
                  required={(name !== "contact_number" ||  index==0)}
                />
                {type === "select" ? (
                  <Select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                  >
                    <option value="">Select {label}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={name !== "contact_number"}
                  />
                )}
              </FormGroup>
            ))}
          </PassengerForm>
          <Divider />
          <PassengerForm>
            {[
              { label: "Meals", type: "meal" },
              { label: "Baggage", type: "baggage" },
            ].map(({ label, type }) => (
              <FormGroup key={type}>
                <Label>{label}</Label>
                <Select onChange={(e) => handleSSRChange(type, e)}>
                  <option value={JSON.stringify({amt:0})}>None</option>
                  {ssr?.[type]?.[0]?.options?.map((item) => (
                    <option key={item.code} value={JSON.stringify(item)}>
                      {item.dsc}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            ))}
          </PassengerForm>
          <Divider />
          {index == 0 && (
            <PassengerForm>
              {[
                {
                  label: "GST Company Address",
                  name: "gst_company_address",
                  type: "text",
                },
                {
                  label: "GST Company Email",
                  name: "gst_company_email",
                  type: "email",
                },
                {
                  label: "GST Company Name",
                  name: "gst_company_name",
                  type: "text",
                },
                { label: "GST Number", name: "gst_number", type: "text" },
              ].map(({ label, name, type }) => (
                <FormGroup key={name}>
                  <RequiredLabel text={label} required={false}/>
                  <Input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                </FormGroup>
              ))}
            </PassengerForm>
          )}

          {!isDomestic&&
          <>
          <Divider/>
          <PassengerForm>
              {[
                {
                  label: "Passport Number",
                  name: "passport_number",
                  type: "text",
                },
                {
                  label: "Passport Issue",
                  name: "passport_issue_date",
                  type: "date",
                },
                {
                  label: "Passport Expiry",
                  name: "passport_expiry",
                  type: "date",
                }
              ].map(({ label, name, type }) => (
                <FormGroup key={name}>
                  <RequiredLabel text={label} required={true}/>
                  <Input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                </FormGroup>
              ))}
            </PassengerForm>
            <Divider/>
          </>}
          {name === "Adult" && index==0 && (
            <LeadCheckboxContainer>
              <input
                type="checkbox"
                name="isLeadPax"
                checked={true}
              />
              <RequiredLabel text="Lead" />
            </LeadCheckboxContainer>
          )}

          <div>
            ₹{formData?.ssr?.meal?.[0]?.amt ?? 0} + ₹
            {formData?.ssr?.baggage?.[0]?.amt ?? 0}
          </div>
        </>
      )}
    </PassengerContainer>
  );
}