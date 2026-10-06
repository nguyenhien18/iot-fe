import { DEFAULT_PATH, PAGE_META } from '../../config/navigation'
import PageIntro from '../common/PageIntro'

export default function Topbar({ pathname }) {
  const meta = PAGE_META[pathname] || PAGE_META[DEFAULT_PATH]

  return (
    <header className="page-header">
      <PageIntro title={meta.title} description={meta.description} />
    </header>
  )
}
