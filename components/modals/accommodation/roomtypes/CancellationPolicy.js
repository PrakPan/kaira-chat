import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const CancellationPolicy = ({ policies }) => {
  if (!policies?.length) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Cancellation Policy</h2>
      {policies}
    </div>
  );
};

export default CancellationPolicy;
