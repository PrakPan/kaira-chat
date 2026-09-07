// The "− value +" pill used for nights and traveller counts.
const Stepper = ({
  value,
  label,
  min = 0,
  max = Infinity,
  onChange,
  size,
  mono = false,
  className = "",
}) => {
  const cls = [
    "kform-stepper",
    size === "sm" ? "kform-stepper--sm" : "",
    mono ? "kform-stepper--mono" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls}>
      <button
        type="button"
        className="kform-stepper-btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="decrease"
      >
        −
      </button>
      <div className="kform-stepper-val">{label ?? value}</div>
      <button
        type="button"
        className="kform-stepper-btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="increase"
      >
        +
      </button>
    </div>
  );
};

export default Stepper;
