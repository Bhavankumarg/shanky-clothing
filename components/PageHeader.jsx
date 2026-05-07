import SafeImg from './SafeImg'

export default function PageHeader({ kicker, title, subtitle, accent, image }) {
  return (
    <header className={`page-header ${image ? 'page-header-with-image' : ''}`}>
      {image && (
        <div className="page-header-image-wrap">
          <SafeImg src={image} alt="" fallbackKey={kicker || title} className="page-header-image" />
          <div className="page-header-image-overlay" />
        </div>
      )}
      <div className="page-header-bg" />
      <div className="page-header-inner">
        {kicker && <p className="section-label">{kicker}</p>}
        <h1 className="italiana page-header-title">
          {title}
          {accent && <span style={{ color: '#c94f2a' }}>{accent}</span>}
        </h1>
        {subtitle && <p className="page-header-sub">{subtitle}</p>}
      </div>
      <div className="page-header-line" />
    </header>
  )
}
