export default function H7(props) {
  return (
    <h2
      style={{
        ...props.style,
      }}
      className={"text-[22px] font-light " + props.className}
    >
      {props.children}
    </h2>
  );
}
