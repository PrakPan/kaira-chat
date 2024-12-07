export default function SecondaryHeading(props) {
  return (
    <div className={`text-[16px] font-[350] leading-[28px] ${props.className}`}>
      {props.children}
    </div>
  );
}
