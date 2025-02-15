import { useEffect, useState } from "react";
import styled from "styled-components";
import RequiredLabel from "../ui/RequiredLabel";
import {PassengerContainer,PassengerHeader,Checkbox,PassengerTitle,Divider,PassengerForm,FormGroup,Input,Select,LeadCheckboxContainer} from "../modals/flights/new-flight-searched/FlightStyles"
export default function PassengerDetailsInternational({ index, data, setData, name }) {
  const [formData, setFormData] = useState(
    data[index] || {
      title: "",
      first_name: "",
      last_name: "",
      gender: "",
      dob: "",
      contact_number: "",
      cell_country_code: "",
      passport_number: "",
      passport_issue_date: "",
      passport_expiry: "",
      isLeadPax: false,
    }
  );

  const [isChecked, setIsChecked] = useState(true);

  useEffect(() => {
    setFormData(data[index]);
  }, [data, index]);

  const updateData = (updatedForm) => {
    setData((prev) => {
      const newData = [...prev];
      newData[index] = updatedForm;
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

  const handleLeadPaxChange = (e) => {
    if (e.target.checked) {
      const updatedData = data.map((item, i) => ({
        ...item,
        isLeadPax: i === index,
      }));
      setData(updatedData);
    }
  };

  return (
    <PassengerContainer>
      <PassengerHeader>
        <Checkbox
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked((prev) => !prev)}
          name="isChecked"
        />
        <PassengerTitle>{name} {index + 1}</PassengerTitle>
      </PassengerHeader>
      <Divider />

      {isChecked && (
        <>
          <PassengerForm>
            <FormGroup>
              <RequiredLabel htmlFor={`title-${index}`} text="Title" required />
              <Select id={`title-${index}`} name="title" value={formData.title} onChange={handleChange}>
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <RequiredLabel text="First Name" required />
              <Input type="text" id={`first_name-${index}`} name="first_name" value={formData.first_name} onChange={handleChange} required />
            </FormGroup>

            <FormGroup>
              <RequiredLabel text="Last Name" required />
              <Input type="text" id={`last_name-${index}`} name="last_name" value={formData.last_name} onChange={handleChange} required />
            </FormGroup>

            <FormGroup>
              <RequiredLabel text="Gender" required />
              <Select id={`gender-${index}`} name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <RequiredLabel text="Date of Birth" required />
              <Input type="date" id={`dob-${index}`} name="dob" value={formData.dob} onChange={handleChange} required />
            </FormGroup>
          </PassengerForm>

          <Divider />

          <PassengerForm>
            <FormGroup>
              <RequiredLabel text="Contact Number" required />
              <Input type="text" id={`contact_number-${index}`} name="contact_number" value={formData.contact_number} onChange={handleChange} required />
            </FormGroup>

            <FormGroup>
              <RequiredLabel text="Country Code" required />
              <Input type="text" id={`cell_country_code-${index}`} name="cell_country_code" value={formData.cell_country_code} onChange={handleChange} required />
            </FormGroup>

            <FormGroup>
              <RequiredLabel text="Passport Number" required />
              <Input type="text" id={`passport_number-${index}`} name="passport_number" value={formData.passport_number} onChange={handleChange} required />
            </FormGroup>

            <FormGroup>
              <RequiredLabel text="Passport Issue" required />
              <Input type="date" id={`passport_issue-${index}`} name="passport_issue_date" value={formData.passport_issue_date} onChange={handleChange} required />
            </FormGroup>

            <FormGroup>
              <RequiredLabel text="Passport Expiry" required />
              <Input type="date" id={`passport_expiry-${index}`} name="passport_expiry" value={formData.passport_expiry} onChange={handleChange} required />
            </FormGroup>
          </PassengerForm>

          {name === "Adult" && (
            <LeadCheckboxContainer>
              <input
                type="checkbox"
                id={`isLeadPax-${index}`}
                name="isLeadPax"
                checked={formData.isLeadPax}
                onChange={handleLeadPaxChange}
              />
              <RequiredLabel text="Lead" />
            </LeadCheckboxContainer>
          )}
        </>
      )}
    </PassengerContainer>
  );
}