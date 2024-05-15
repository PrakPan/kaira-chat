import { connect } from "react-redux";
import * as authaction from "../../store/actions/auth";
import * as otpaction from "../../store/actions/getOtp";

const UpdatePhone = (props) => {
  return <div>1</div>;
};

const mapStateToPros = (state) => {
  return {
    otpFail: state.auth.otpFail,
    mobileFail: state.auth.mobileFail,
    otpSent: state.auth.otpSent,
    loading: state.auth.loading,
    newUser: state.auth.newUser,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (mobile, password, name, email) =>
      dispatch(authaction.auth(mobile, password, name, email)),
    onOtp: (mobile, setNewUser) =>
      dispatch(otpaction.getotp(mobile, setNewUser)),
    onResetLogin: () => dispatch(authaction.authResetLogin()),
    onGoogleAuth: (response) => dispatch(authaction.googleAuth(response)),
    onFbAuth: (response) => dispatch(authaction.fbAuth(response)),
  };
};
export default connect(mapStateToPros, mapDispatchToProps)(UpdatePhone);
