import type { CSSProperties } from 'react'

export const overlayBackdrop: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(8, 13, 24, 0.62)',
  backdropFilter: 'blur(14px)',
  zIndex: 1200,
}

export const panelShell: CSSProperties = {
  width: 'min(920px, calc(100vw - 32px))',
  maxHeight: 'min(82vh, 760px)',
  overflow: 'auto',
  borderRadius: 22,
  border: '1px solid rgba(255, 255, 255, 0.16)',
  background: 'linear-gradient(180deg, rgba(17, 25, 44, 0.98), rgba(11, 17, 31, 0.98))',
  boxShadow: '0 26px 80px rgba(0, 0, 0, 0.42)',
  color: '#f5f7ff',
}

export const panelHeader: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 16,
  padding: '24px 24px 18px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
}

export const closeButton: CSSProperties = {
  minWidth: 44,
  minHeight: 44,
  borderRadius: 14,
  border: '1px solid rgba(255, 255, 255, 0.16)',
  background: 'rgba(255, 255, 255, 0.06)',
  color: '#f5f7ff',
  cursor: 'pointer',
  fontSize: 16,
}

export const tabButton = (active: boolean): CSSProperties => ({
  padding: '10px 14px',
  borderRadius: 999,
  border: active ? '1px solid rgba(126, 219, 255, 0.55)' : '1px solid rgba(255, 255, 255, 0.12)',
  background: active ? 'rgba(92, 190, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)',
  color: active ? '#e8fbff' : 'rgba(245, 247, 255, 0.78)',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 700,
})

export const primaryButton = (enabled = true): CSSProperties => ({
  minHeight: 44,
  borderRadius: 14,
  border: enabled ? '1px solid rgba(126, 219, 255, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
  background: enabled ? 'linear-gradient(135deg, #5ec8ff, #9aee86)' : 'rgba(255, 255, 255, 0.08)',
  color: enabled ? '#08111e' : 'rgba(245, 247, 255, 0.48)',
  fontWeight: 800,
  padding: '0 16px',
  cursor: enabled ? 'pointer' : 'default',
})

export const secondaryButton: CSSProperties = {
  minHeight: 44,
  borderRadius: 14,
  border: '1px solid rgba(255, 255, 255, 0.16)',
  background: 'rgba(255, 255, 255, 0.05)',
  color: '#f5f7ff',
  fontWeight: 700,
  padding: '0 16px',
  cursor: 'pointer',
}

export const cardSurface: CSSProperties = {
  borderRadius: 18,
  border: '1px solid rgba(255, 255, 255, 0.08)',
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03))',
  padding: 16,
}
