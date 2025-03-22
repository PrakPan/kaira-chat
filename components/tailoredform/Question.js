import styled from "styled-components";

const Heading = styled.p`
  font-weight: 600;
  margin: ${(props) => (props.margin ? props.margin : "0 0 0.5rem 0")};
`;

const Question = (props) => {
  return (
    <Heading
      margin={props.margin}
      className={
        props.hover_pointer
          ? "text-centr font-lexend hover-pointer"
          : "text-centr font-lexend"
      }
    >
      {props.children}
    </Heading>
  );
};

export default Question;
