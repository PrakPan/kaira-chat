export default function PrimaryButton(props) {
  return (
    <button
      onClick={props.onClick}
      style={props.style}
      className={
        "bg-[#F7E700] w-fit px-[1rem] py-[0.75rem] rounded-lg no-underline text-[15px] font-[600] text-black border-1 border-black focus:outline-none " +
        props.className
      }
    >
      {props.children}
    </button>
  );
}
