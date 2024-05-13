import { Children } from "react";

export const SplitScreen = ({
  isPageWide,
  leftWidth,
  rightWidth,
  classStyle,
  children,
}) => {
  const [left, right] = Children.toArray(children);
  return isPageWide ? (
    <div className={`flex w-full ${classStyle}`}>
      <div style={{ flex: `${leftWidth}` }}>{left}</div>
      <div style={{ flex: `${rightWidth}` }}>{right}</div>
    </div>
  ) : (
    { children }
  );
};

SplitScreen.defaultProps = {
  className: "",
  leftWidth: 6,
  rightWidth: 6,
};
