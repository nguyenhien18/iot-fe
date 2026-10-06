import Icon from '../../../components/common/Icon'

export default function MetricCard({ label, value, unit, note, icon }) {
  return (
    <div className="summary-item">
      <div className="summary-copy">
        <span>{label}</span>
        <strong>
          {value ?? '--'}
          {unit}
        </strong>
        <small>{note}</small>
      </div>
      <div className={`summary-icon ${icon}`}>
        <Icon name={icon} size={26} />
      </div>
    </div>
  )
}
