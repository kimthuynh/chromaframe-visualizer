import './InstructionBar.css'

export default function InstructionBar({ onDismiss }) {
  return (
    <div className="instruction-bar" role="note" aria-label="Getting started">
      <p className="instruction-text">
        Pick a template, choose your colors, and watch your theme come to life.
        Export CSS variables or share your palette with a link.
      </p>
      <button className="instruction-dismiss" onClick={onDismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  )
}
