export default function Toggle({ on, onChange, label, disabled = false }) {
  return (
    <button
      type="button"
      className={`mini-switch ${on ? 'on' : ''}`}
      disabled={disabled}
      onClick={onChange}
      aria-label={label}
      role="switch"
      aria-checked={on}
    >
      <span />
    </button>
  )
}
