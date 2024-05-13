import TextField from "@mui/material/TextField";

const Person = (props) => {
  return (
    <div className="bordr">
      <TextField
        disabled={props.otpSent}
        autoFocus
        value={props.email}
        onFocus={null}
        onChange={(event) => props.setEmail(event.target.value)}
        onBlur={() => console.log(props.email)}
        error={props.emailError ? true : false}
        helperText={
          props.emailError ? `This doesn't seem right ` : "Enter work email"
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
