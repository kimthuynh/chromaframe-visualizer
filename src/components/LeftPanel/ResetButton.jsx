import { useState } from 'react'

export default function ResetButton({ onConfirm }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div className="reset-confirm">
        <span className="reset-confirm-text">Reset to defaults?</span>
        <button
          className="reset-action-btn reset-action-btn--confirm"
          onClick={() => { onConfirm(); setConfirming(false) }}
        >
          Confirm
        </button>
        <button
          className="reset-action-btn reset-action-btn--cancel"
          onClick={() => setConfirming(false)}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button className="reset-btn" onClick={() => setConfirming(true)}>
      Reset
    </button>
  )
}
