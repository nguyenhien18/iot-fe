import { useRef, useState } from 'react'

// Sửa thông tin và đường dẫn tại đây.
const PROFILE = {
  fullName: 'Nguyễn Văn Hiển',
  studentCode: 'B23DCCN290',
  className: 'D23CNPM05',
  email: 'hiennv.b23cn290@stu.ptit.edu.vn',
  avatarUrl: '',
}

const PROFILE_LINKS = [
  { label: 'GitHub', description: 'Mã nguồn dự án', href: 'https://github.com/' },
  { label: 'Figma', description: 'Thiết kế giao diện', href: 'https://www.figma.com/design/4nNJZAd7aQJlUF5nPH3ZJ9/IOT-Smart-Room?node-id=0-1&m=dev&t=OQ7D4Mf6K2aCT137-1' },
  { label: 'Postman', description: 'Tài liệu và kiểm thử API', href: 'https://www.postman.com/' },
  { label: 'PDF báo cáo', description: 'Báo cáo đồ án', href: 'https://drive.google.com/file/d/1Pa4hX6-lgj9BmI9jQQcDOjC509tLMcCM/view?usp=sharing' },
]

function InfoField({ label, value }) {
  return (
    <div className="profile-info-field">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function ProjectLink({ label, description, href }) {
  if (!href) {
    return (
      <div className="profile-project-link">
        <strong>{label}</strong>
        <span>Chưa có liên kết</span>
      </div>
    )
  }

  return (
    <a className="profile-project-link" href={href} target="_blank" rel="noreferrer">
      <strong>
        {label} <span aria-hidden="true">↗</span>
      </strong>
      <span>{description}</span>
    </a>
  )
}

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState(PROFILE.avatarUrl)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef(null)
  const initials = PROFILE.fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setMessage('')
    if (!file.type.startsWith('image/')) {
      setMessage('Vui lòng chọn một file ảnh.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => setAvatarUrl(String(reader.result || ''))
    reader.onerror = () => setMessage('Không thể đọc file ảnh. Vui lòng thử lại.')
    reader.readAsDataURL(file)
  }

  return (
    <div className="profile-page">
      <div className="profile-layout">
        <section className="profile-preview-card" aria-label="Ảnh đại diện sinh viên">
          <div className="profile-avatar">
            {avatarUrl ? <img src={avatarUrl} alt="Ảnh đại diện" /> : <span>{initials}</span>}
          </div>

          <input
            ref={fileInputRef}
            className="avatar-file-input"
            type="file"
            accept="image/*"
            aria-label="Chọn ảnh đại diện"
            onChange={handleAvatarChange}
          />
          <button
            className="avatar-upload-btn"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            Tải ảnh lên
          </button>
          {message && (
            <p className="profile-avatar-message" role="alert">
              {message}
            </p>
          )}

          <h2>{PROFILE.fullName}</h2>
          <p>{PROFILE.studentCode}</p>
          <span className="class-badge">{PROFILE.className}</span>
        </section>

        <section className="profile-details-card" aria-labelledby="profile-info-title">
          <div className="profile-section-heading">
            <h2 id="profile-info-title">Thông tin cá nhân</h2>
          </div>

          <dl className="profile-info-grid">
            <InfoField label="Họ và tên" value={PROFILE.fullName} />
            <InfoField label="Mã sinh viên" value={PROFILE.studentCode} />
            <InfoField label="Lớp" value={PROFILE.className} />
            <InfoField label="Email" value={PROFILE.email} />
          </dl>

          <div className="profile-divider" />

          <div className="profile-section-heading">
            <h2>Liên kết dự án</h2>
            <p>Mã nguồn, thiết kế và tài liệu của dự án.</p>
          </div>

          <div className="profile-links-grid">
            {PROFILE_LINKS.map((link) => (
              <ProjectLink key={link.label} {...link} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
