export default function H5(props) {
  return (
    <h2
      style={{
        ...props.style,
      }}
      className="text-[16px] font-bold md:text[25px] md:font-bold lg:text-[25px] lg:font-bold"
    >
      {props.children}
    </h2>
  );
}
