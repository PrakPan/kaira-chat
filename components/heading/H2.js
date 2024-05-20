export default function H2(props) {
  return (
    <h2
      style={{
        ...props.style,
      }}
      className="text-[24px] font-semibold md:text[36px] md:font-bold lg:text-[36px] lg:font-bold"
    >
      {props.children}
    </h2>
  );
}
