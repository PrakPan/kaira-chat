export default function SecondaryHeading(props) {
  return (
    <div
      style={{ ...props.style }}
      className={`w-fit text-[16px] font-[350] leading-[28px] ${props.className}`}
    >
      {props.children}
    </div>
  );
}
