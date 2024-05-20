export default function H4(props) {
  return (
    <h2
      style={{
        ...props.style,
      }}
      className="text-[28px] font-bold md:text[28px] md:font-bold lg:text-[28px] lg:font-bold"
    >
      {props.children}
    </h2>
  );
}
