import TextField from "@mui/material/TextField";

const Person = (props) => {
  return (
    <div className="bordr">
      <TextField
        disabled={props.verified}
        autoFocus
        value={props.email}
        onFocus={null}
        onChange={(event) => props.setEmail(event.target.value)}
        onBlur={null}
        error={props.verificationfailed ? true : false}
        helperText={
          props.verificationfailed
            ? `This email is not authorised to register.`
            : null
        }
        type="text"
        placeholder="employee@pw.live"
        key="email"
        variant="outlined"
        required
        fullWidth
        name="email"
        label="Work Email"
        id="email"
      />
    </div>
  );
};

export default Person;
