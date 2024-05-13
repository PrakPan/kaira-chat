import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media screen and (min-width: 768px) {
    width: 75%;
    margin: auto;
  }
`;

const Text = styled.div`
  font-weight: 300;
  margin-bottom: 1rem;
  background-color: hsl(0, 0%, 96%);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-color: hsl(0, 0%, 90%);
`;

const Enquiry = (props) => {
  let emails = [];
  let status = [];

  try {
    for (var i = 0; i < props.registered_users.length; i++) {
      emails.push(
        <Text
          className="text-center borde"
          style={{
            borderStyle: i
              ? "solid none solid solid"
              : "solid none solid solid",
            borderWidth: "1px",
            padding: "1rem",
            borderRadius: "10px 0 0 10px",
          }}
        >
          {props.registered_users[i].name}
        </Text>
      );
      status.push(
        <Text
          className="text-center bordr"
          style={{
            borderStyle: i
              ? "solid solid solid none"
              : "solid solid solid none",
            borderWidth: "1px",
            padding: "1rem",
            color: props.registered_users[i].payment_status
              ? "green"
              : "orange",
            borderRadius: "0 10px 10px 0",
          }}
        >
          {!props.registered_users[i].payment_status ? "Invited" : "Paid"}
        </Text>
      );
    }
  } catch {}

  return (
    <Container className="borer ">
      <div>{emails}</div>
      <div>{status}</div>
    </Container>
  );
};

export default Enquiry;
