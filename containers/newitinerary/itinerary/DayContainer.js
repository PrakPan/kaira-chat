import styled from "styled-components";

const Date = styled.div`
  width: max-content;
  border-radius: 2rem;
  margin: 1rem auto;
  padding: 0.25rem 1rem;
  background-color: #f4f4f4;
  font-weight: 300;
`;

const DayContainer = (props) => {
  return (
    <div className="">
      <Date>Feb 3, 2023</Date>

      <div className="border-thin" style={{ borderRadius: "10px" }}></div>
    </div>
  );
};

export default DayContainer;
