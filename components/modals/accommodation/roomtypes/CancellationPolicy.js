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
      {policies.map((policy, i) => (
        <div key={i} className="mb-4">
          {policy.rules.map((rule, j) => {
            const start = dayjs(rule.start).format("MMM D, YYYY");
            const end = dayjs(rule.end).format("MMM D, YYYY, hh:mm A [UTC]");
            return (
              <div key={j} className="text-sm text-gray-700">
                <p>
                  If cancelled between <strong>{start}</strong> to <strong>{end}</strong>:
                </p>
                <p>
                  - <strong>{rule.value}%</strong> refundable
                </p>
                <p>
                  - Estimated refundable amount: <strong>₹{rule.estimatedValue}</strong>
                </p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CancellationPolicy;
