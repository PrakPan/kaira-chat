export default function H9(props) {
  return (
    <h2
      style={{
        ...props.style,
      }}
      className="text-[16px] font-light"
    >
      {props.children}
    </h2>
  );
}
