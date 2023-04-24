import React from "react";
import FloatingInput from "../../../../ui/input/FloatingInput";

const Person = (props) => {
  const _handleBlur = () => {
    if (!props.verificationFailed) {
      props.close();
    }
  };

  return (
      <FloatingInput
        error={props.verificationfailed === "employee_id" ? true : false}
        helperText={
          props.verificationfailed === "employee_id"
            ? props.verificationfailedmessage
            : null
        }
        disabled={props.verified}
        value={props.id}
        onChange={(event) => props.setId(event.target.value)}
        onBlur={null}
        type="text"
        placeholder="Employee ID"
        key="id"
        required
        fullWidth
        name="email"
        label="Employee ID"
        id="id"
      />
  );
};

export default Person;
