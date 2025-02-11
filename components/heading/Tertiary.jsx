export default function TertiaryHeading(props) {
    return (
      <div
        style={{ ...props.style }}
        className={`w-fit text-[14px] font-[350] leading-[28px] ${props.className}`}
      >
        {props.children}
      </div>
    );
  }
  