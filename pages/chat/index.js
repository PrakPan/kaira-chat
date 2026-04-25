import { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import setHotLocationSearch from "../../store/actions/hotLocationSearch";
import * as authaction from "../../store/actions/auth";

const ChatPage = ({ checkAuthState }) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return <BotApp />;
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
    showLogin: state.auth.showLogin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState: () => dispatch(authaction.checkAuthState()),
    authCloseLogin: () => dispatch(authaction.authCloseLogin()),
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(ChatPage);