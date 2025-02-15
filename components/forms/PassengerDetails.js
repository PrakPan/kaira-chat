import { useEffect, useState } from "react";
import styled from "styled-components";
import RequiredLabel from "../ui/RequiredLabel";
import {PassengerContainer,PassengerHeader,Checkbox,PassengerTitle,Divider,PassengerForm,FormGroup,Input,Select,LeadCheckboxContainer} from "../modals/flights/new-flight-searched/FlightStyles"

export default function PassengerDetails({ index, data, setData, name }) {
  const [formData, setFormData] = useState(
    data[index] || {
      title: "",
      first_name: "",
      last_name: "",
      gender: "",
      dob: "",
      contact_number: "",
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
        <PassengerTitle>
          {name} {index + 1}
        </PassengerTitle>
      </PassengerHeader>
      <Divider />
  
      {isChecked && (
        <>
          <PassengerForm>
            <FormGroup>
              <RequiredLabel htmlFor={`title-${index}`} text={'Title'} required={true}/>
              <Select id={`title-${index}`} name="title" value={formData.title} onChange={handleChange}>
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
              </Select>
            </FormGroup>
  
            <FormGroup>
              <RequiredLabel text={'First Name'} required={true}/>
              <Input
                type="text"
                id={`first_name-${index}`}
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </FormGroup>
  
            <FormGroup>
              <RequiredLabel text={'Last Name'} required={true}/>
              <Input
                type="text"
                id={`last_name-${index}`}
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </FormGroup>
  
            <FormGroup>
              <RequiredLabel text={'COntact Number'}/>
              <Input
                type="text"
                id={`contact_number-${index}`}
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
              />
            </FormGroup>
  
            <FormGroup>
              <RequiredLabel text={'Gender'} required={true}/>
              <Select id={`gender-${index}`} name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </FormGroup>
  
            <FormGroup>
              <RequiredLabel  text={'Date of Birth'} required={true}/>
              <Input
                type="date"
                id={`dob-${index}`}
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
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
              <RequiredLabel text={'Lead'}/>
            </LeadCheckboxContainer>
          )}
        </>
      )}
    </PassengerContainer>
  );}