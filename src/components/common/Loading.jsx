export default function Loading({ text = 'Đang tải...' }) {
  return (
    <div className="loading">
      <span className="spinner" />
      {text}
    </div>
  )
}
