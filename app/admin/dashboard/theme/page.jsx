import { getTheme, DEFAULT_THEME } from '@/lib/themeStore'
import AdminThemeForm from '@/components/AdminThemeForm'

export const dynamic = 'force-dynamic'

export default async function AdminThemePage() {
  const theme = await getTheme()
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <p className="admin-kicker">Appearance</p>
          <h1 className="italiana admin-h1">Theme</h1>
          <p className="admin-sub">
            Pick the palette the entire storefront uses — backgrounds, accents, text.
            Changes are live everywhere on save.
          </p>
        </div>
      </div>
      <AdminThemeForm initial={theme} defaults={DEFAULT_THEME} />
    </div>
  )
}
