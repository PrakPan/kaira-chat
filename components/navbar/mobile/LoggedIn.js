import styled from "styled-components";
import { getFirstName } from "../../../services/getfirstname";
import ImageLoader from "../../ImageLoader";

const ListItem = styled.div`
  text-align: left;
`;

const LoggedIn = (props) => {
  return (
    <>
      <ImageLoader
        borderRadius="50%"
        leftalign
        url={
          props.userImage && props.userImage !== "null"
            ? props.userImage
            : "media/icons/navigation/profile-user.png"
        }
        width="36px"
        height="36px"
        widthmobile="36px"
        dimensions={{ width: 300, height: 300 }}
      />

      {props.token ? (
        <ListItem>
          {!props.name || props.name === ""
            ? "Hi Traveler!"
            : "Hi " + getFirstName(props.name) + "!"}
        </ListItem>
      ) : (
        <ListItem onClick={props._handleLogin}>Login/Signup</ListItem>
      )}
    </>
  );
};

export default LoggedIn;
