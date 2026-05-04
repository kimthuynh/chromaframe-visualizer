import './PreviewPane.css'

export default function PreviewPane({ config, activeTab, onTabChange, children }) {
  return (
    <div className="preview-pane">
      <div className="preview-tab-bar">
        {config.tabs.map(tab => (
          <button
            key={tab.id}
            className={`preview-tab${activeTab === tab.id ? ' preview-tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="preview-chrome">
        <div className="preview-window">
          {children}
        </div>
      </div>
    </div>
  )
}
