import styled from "styled-components";
import {Label} from "../modals/flights/new-flight-searched/FlightStyles"

const RequiredAsterisk = styled.span`
  color: red;
  margin-left: 4px;
`;

const RequiredLabel = ({ text, required = false }) => (
  <Label>
    {text} {required && <RequiredAsterisk>*</RequiredAsterisk>}
  </Label>
);

export default RequiredLabel;
