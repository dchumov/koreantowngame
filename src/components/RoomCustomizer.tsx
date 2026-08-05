import type { RoomSlotId } from '../content/interactions'
import { itemCatalog, roomSlots } from '../content/interactions'
import { cardSurface, closeButton, overlayBackdrop, panelHeader, panelShell, primaryButton, secondaryButton } from './panelStyles'

interface Props {
  coins: number
  ownedFurniture: string[]
  unlockedItems: string[]
  roomState: Record<RoomSlotId, string | null>
  onClose: () => void
  onBuyItem: (itemId: string, cost: number) => void
  onEquip: (slotId: RoomSlotId, itemId: string | null) => void
}

export default function RoomCustomizer({ coins, ownedFurniture, unlockedItems, roomState, onClose, onBuyItem, onEquip }: Props) {
  const furnitureBySlot = roomSlots.map((slot) => ({
    slot,
    items: itemCatalog.filter((item) => item.kind === 'furniture' && item.slot === slot.id),
  }))

  return (
    <div style={{ ...overlayBackdrop, display: 'grid', placeItems: 'center', padding: 16 }} onClick={onClose}>
      <div style={panelShell} onClick={(event) => event.stopPropagation()}>
        <div style={panelHeader}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.62 }}>Room Customizer</div>
            <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 6 }}>Комната игрока</div>
            <div style={{ fontSize: 14, opacity: 0.72 }}>Покупай и расставляй мебель по слотам. Состояние сохраняется в localStorage.</div>
          </div>
          <button onClick={onClose} style={closeButton}>✕</button>
        </div>

        <div style={{ padding: 24, display: 'grid', gap: 18 }}>
          <div style={{ ...cardSurface, display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 14, opacity: 0.66 }}>Баланс</div>
                <div style={{ fontSize: 28, fontWeight: 900 }}>{coins} coins</div>
              </div>
              <div style={{ fontSize: 13, opacity: 0.7, maxWidth: 320 }}>
                Активные слоты: {Object.values(roomState).filter(Boolean).length} / {roomSlots.length}
              </div>
            </div>
            <div style={{
              borderRadius: 20,
              minHeight: 180,
              background: 'radial-gradient(circle at top, rgba(106, 208, 255, 0.24), rgba(255, 255, 255, 0.03) 40%), linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: 18,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 12,
            }}>
              {roomSlots.map((slot) => (
                <div key={slot.id} style={{
                  borderRadius: 16,
                  background: 'rgba(7, 12, 22, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: 12,
                }}>
                  <div style={{ fontSize: 12, opacity: 0.58, marginBottom: 8 }}>{slot.labelKo}</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{roomState[slot.id] ? itemCatalog.find((item) => item.id === roomState[slot.id])?.labelRu : 'Пусто'}</div>
                </div>
              ))}
            </div>
          </div>

          {furnitureBySlot.map(({ slot, items }) => (
            <div key={slot.id} style={cardSurface}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 13, opacity: 0.56 }}>{slot.labelKo}</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{slot.labelRu}</div>
                </div>
                <button onClick={() => onEquip(slot.id, null)} style={secondaryButton}>
                  Очистить слот
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {items.map((item) => {
                  const owned = ownedFurniture.includes(item.id)
                  const unlocked = unlockedItems.includes(item.id) || owned
                  const canAfford = coins >= item.cost
                  return (
                    <div key={item.id} style={{
                      borderRadius: 16,
                      padding: 14,
                      background: owned ? 'rgba(94, 200, 255, 0.14)' : 'rgba(255, 255, 255, 0.04)',
                      border: owned ? '1px solid rgba(94, 200, 255, 0.34)' : '1px solid rgba(255, 255, 255, 0.08)',
                    }}>
                      <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>{unlocked ? item.labelRu : '???'}</div>
                      <div style={{ fontSize: 13, opacity: 0.72, marginBottom: 8 }}>{unlocked ? item.description : item.unlockHint}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {owned && (
                          <button onClick={() => onEquip(slot.id, item.id)} style={primaryButton(true)}>
                            Поставить
                          </button>
                        )}
                        {!owned && unlocked && (
                          <button onClick={() => onBuyItem(item.id, item.cost)} style={primaryButton(canAfford)}>
                            Купить за {item.cost}
                          </button>
                        )}
                        {!unlocked && (
                          <div style={{ minHeight: 44, display: 'grid', alignItems: 'center', fontSize: 12, opacity: 0.56 }}>
                            {item.unlockHint}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
