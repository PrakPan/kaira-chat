export default function H8(props) {
  return (
    <h2
      style={{
        ...props.style,
      }}
      className="text-[18px] font-semibold"
    >
      {props.children}
    </h2>
  );
}
