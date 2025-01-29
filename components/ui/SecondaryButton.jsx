export default function SecondaryButton(props) {
  return (
    <button
      onClick={props.onClick}
      style={props.style}
      className={
        "border-2 border-black rounded-lg px-5 py-2 mx-auto hover:text-white hover:bg-black transition-all " +
        props.className
      }
    >
      {props.children}
    </button>
  );
}
