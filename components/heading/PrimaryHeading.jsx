export default function PrimaryHeading(props) {
    return (
      <div
        style={{ ...props.style }}
        className={`w-fit text-[25px] md:text-[40px] leading-[36px] font-[700] md:leading-[56px] ${props.className}`}
      >
        {props.children}
      </div>
    );
  }
  