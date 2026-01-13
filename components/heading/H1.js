export default function H1(props) {
  return (
    <h1
      style={{
        ...props.style,
      }}
      className={`text-[28px] font-extrabold md:text-[44px] md:font-bold lg:text-[44px] lg:font-bold ${props.className}`}
    >
      {props.children}
    </h1>
  );
}
