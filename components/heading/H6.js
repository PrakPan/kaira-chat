export default function H6(props) {
  return (
    <h2
      style={{
        ...props.style,
      }}
      className="text-[1.25rem] font-bold"
    >
      {props.children}
    </h2>
  );
}
