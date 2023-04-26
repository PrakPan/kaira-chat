import React from "react";
import FloatingInput from "../../../../ui/input/FloatingInput";

const Person = (props) => {
  // _checkValidation();
  return (
      <FloatingInput
        disabled={props.verified}
        autoFocus
        value={props.email}
        onFocus={null}
        onChange={(event) => props.setEmail(event.target.value)}
        onBlur={null}
        error={props.verificationfailed === "email" ? true : false}
        helperText={
          props.verificationfailed === "email"
            ? `This email is not authorised to register.`
            : null
        }
        type="text"
        placeholder="employee@pw.live"
        key="email"
        required
        name="email"
        label="Work Email"
        id="email"
      />
  );
};

export default Person;
