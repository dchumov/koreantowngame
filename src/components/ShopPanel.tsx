import { useState } from 'react'
import { getShopEntries, kindLabelRu, shopMap } from '../content/shops'
import type { PurchaseResult } from '../store/gameStore'
import { cardSurface, closeButton, overlayBackdrop, panelHeader, panelShell, primaryButton } from './panelStyles'

interface Props {
  shopId: string
  coins: number
  unlockedItems: string[]
  outfits: string[]
  onClose: () => void
  onPurchase: (id: string) => PurchaseResult
}

export default function ShopPanel({ shopId, coins, unlockedItems, outfits, onClose, onPurchase }: Props) {
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)
  const [pending, setPending] = useState<string | null>(null)

  const shop = shopMap.get(shopId)
  const entries = getShopEntries(shopId)
  if (!shop) return null

  const isOwned = (id: string, kind: string) => (kind === 'outfit' ? outfits.includes(id) : unlockedItems.includes(id))

  const handleBuy = (id: string, label: string) => {
    // Guard against double clicks / repeated events before the state settles.
    if (pending) return
    setPending(id)
    const result: PurchaseResult = onPurchase(id)
    if (result === 'ok') setMessage({ tone: 'ok', text: `Куплено: ${label}` })
    else if (result === 'insufficient') setMessage({ tone: 'error', text: 'Недостаточно монет для этой покупки.' })
    else if (result === 'owned') setMessage({ tone: 'error', text: 'Этот предмет уже куплен.' })
    else setMessage({ tone: 'error', text: 'Предмет недоступен.' })
    setPending(null)
  }

  return (
    <div style={{ ...overlayBackdrop, display: 'grid', placeItems: 'center', padding: 16 }} onClick={onClose}>
      <div style={panelShell} onClick={(event) => event.stopPropagation()}>
        <div style={panelHeader}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.62 }}>{shop.titleKo}</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>{shop.titleRu}</div>
            <div style={{ fontSize: 14, opacity: 0.72 }}>{shop.subtitleRu}</div>
          </div>
          <button onClick={onClose} style={closeButton}>✕</button>
        </div>

        <div style={{ padding: '18px 20px 24px' }}>
          <div style={{ ...cardSurface, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, opacity: 0.66 }}>Ваш баланс</div>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{coins} coins</div>
            </div>
            {message && (
              <div style={{
                alignSelf: 'center',
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                background: message.tone === 'ok' ? 'rgba(154, 238, 134, 0.16)' : 'rgba(255, 124, 124, 0.16)',
                color: message.tone === 'ok' ? '#9aee86' : '#ff9d9d',
              }}>
                {message.text}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {entries.map((entry) => {
              const owned = isOwned(entry.id, entry.kind)
              const canAfford = coins >= entry.cost
              return (
                <div key={entry.id} style={{
                  ...cardSurface,
                  border: owned ? '1px solid rgba(154, 238, 134, 0.34)' : '1px solid rgba(255, 255, 255, 0.08)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>{kindLabelRu[entry.kind]}</div>
                    <div style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                      background: owned ? 'rgba(154, 238, 134, 0.16)' : 'rgba(255, 255, 255, 0.06)',
                      color: owned ? '#9aee86' : '#f5f7ff',
                    }}>
                      {owned ? 'Куплено' : `${entry.cost} coins`}
                    </div>
                  </div>

                  <div style={{
                    borderRadius: 16,
                    minHeight: 92,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 44,
                    marginBottom: 10,
                    background: 'linear-gradient(180deg, rgba(10, 18, 34, 0.2), rgba(10, 18, 34, 0.6))',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}>
                    {entry.icon}
                  </div>

                  <div style={{ fontSize: 18, fontWeight: 800 }}>{entry.labelRu}</div>
                  <div style={{ fontSize: 13, opacity: 0.72, marginBottom: 6 }}>{entry.labelKo}</div>
                  <div style={{ fontSize: 13, opacity: 0.68, marginBottom: 12 }}>{entry.description}</div>

                  {owned ? (
                    <div style={{ minHeight: 44, display: 'grid', alignItems: 'center', fontSize: 13, color: '#9aee86', fontWeight: 700 }}>
                      Уже в вашей коллекции
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBuy(entry.id, entry.labelRu)}
                      disabled={!canAfford || pending === entry.id}
                      style={primaryButton(canAfford && pending !== entry.id)}
                    >
                      {canAfford ? `Купить за ${entry.cost}` : 'Недостаточно монет'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
