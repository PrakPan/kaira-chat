import styled from "styled-components";

const Heading = styled.p`
  font-weight: 600;
`;

const Question = (props) => {
  return (
    <Heading
      margin={props.margin}
      className={
        props.hover_pointer
          ? "text-centr font-lexend hover-pointer " + props.className
          : "text-centr font-lexend flex justify-between " + props.className
      }
    >
      {props.children}
    </Heading>
  );
};

export default Question;
