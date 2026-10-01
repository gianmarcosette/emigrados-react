export default function ProgressBar({ value, max, label }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div className="progress">
      <div className="progress__head">
        <span>{label}</span>
        <strong>
          {value}/{max}
        </strong>
      </div>
      <div className="progress__track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div className="progress__fill" style={{ width: `${pct}%` }}>
          <span className="progress__plane" aria-hidden="true">✈️</span>
        </div>
      </div>
    </div>
  )
}
