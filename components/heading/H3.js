export default function H3(props) {
  return (
    <h2
      style={{
        ...props.style,
      }}
      className="text-[24px] font-bold md:text[32px] md:font-bold lg:text-[32px] lg:font-bold"
    >
      {props.children}
    </h2>
  );
}
