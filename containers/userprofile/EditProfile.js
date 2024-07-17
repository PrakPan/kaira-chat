import { useState } from "react";
import { MdDone } from "react-icons/md";
import { connect } from "react-redux";
import * as authaction from "../../store/actions/auth";

const mapDispatchToProps = (dispatch) => {
  return {
    changeUserDetails: (payload) =>
      dispatch(authaction.changeUserDetails(payload)),
  };
};

const EditInput = connect(
  null,
  mapDispatchToProps
)(({ type, name, text, closeEdit, changeUserDetails }) => {
  const [value, setValue] = useState(text);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    let data = {};
    data[name] = value;
    changeUserDetails(data);
    setLoading(false);
    closeEdit(false);
  };

  return (
    <div
      className={`w-full flex flex-row items-center gap-3 ${
        name === "name" && "justify-center"
      }`}
    >
      <input
        autoFocus
        disabled={loading}
        name={name}
        type={type}
        value={value}
        // onBlur={() => closeEdit(false)}
        onChange={(e) => setValue(e.target.value)}
        className={`w-[60%] border-2 border-gray-200 rounded-md p-2 focus:outline-none ${
          loading && "opacity-25"
        }`}
      ></input>
      {loading ? (
        <div className="w-6 h-6 rounded-full animate-spin border-t-2 border-black"></div>
      ) : (
        <MdDone onClick={handleSave} className="text-2xl cursor-pointer" />
      )}
    </div>
  );
});

export { EditInput };
