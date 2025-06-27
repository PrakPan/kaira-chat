import styled from "styled-components";

export const BookingContainer = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  margin-top: 40px;
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 1.75rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

export const Section = styled.div`
  margin-bottom: 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 1rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
`;

export const Count = styled.span`
  color: #6b7280;
`;

export const Divider = styled.div`
  border-top: 1px solid #d1d5db;
  margin: 0.5rem 0;
`;

export const AddButton = styled.button`
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #3b82f6;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
  }
`;

export const Container = styled.div`
  width: 100%;
  display: grid;
  text-align: center;
  @media screen and (min-width: 768px) {
    padding: 0;
    width: 85%;
    text-align: left;
    margin: auto;
    margin-top: 2vh;
  }
`;

export const PriceCard = styled.div`
  width:320px !important;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  margin-top: 40px;
  height: max-content;
   flex-shrink: 0; 
  align-self: flex-start;  
`;

export const Input = styled.input`
  border: 1px solid #ccc;
  border-radius: 2px;
  padding: 8px;
  width: 100%;
  max-width: 250px;
`;

export  const PassengerForm = styled.form`
display: flex;
flex-wrap: wrap;
gap: 12px;
padding: 8px;
`;

export const PassengerContainer = styled.div`
width: 100%;
border-radius: 8px;
padding: 0.5rem;
`;

export const PassengerHeader = styled.label`
display: flex;
align-items: center;
gap: 8px;
font-weight: bold;
color: #2d3748;
`;

export const Checkbox = styled.input`
width: 10px;
height: 10px;
accent-color: #3b82f6;
`;

export const PassengerTitle = styled.span`
    color: #2563eb;
  `;
  
export  const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 250px;
  `;
  
export  const Select = styled.select`
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    width: 100%;
    background: white;
  `;
  
export  const LeadCheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: flex-end;
  `;
  
export const Label = styled.label`
font-size: 14px;
font-weight: 500;
color: #374151;
margin-bottom: 4px;
display: flex;
align-items: center;
`;