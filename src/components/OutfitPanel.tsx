import { outfitCatalog } from '../content/interactions'
import { cardSurface, closeButton, overlayBackdrop, panelHeader, panelShell, primaryButton } from './panelStyles'

interface Props {
  coins: number
  ownedOutfits: string[]
  unlockedOutfits: string[]
  equippedOutfit: string
  onClose: () => void
  onBuy: (id: string, cost: number) => void
  onEquip: (id: string) => void
}

export default function OutfitPanel({ coins, ownedOutfits, unlockedOutfits, equippedOutfit, onClose, onBuy, onEquip }: Props) {
  return (
    <div style={{ ...overlayBackdrop, display: 'grid', placeItems: 'center', padding: 16 }} onClick={onClose}>
      <div style={panelShell} onClick={(event) => event.stopPropagation()}>
        <div style={panelHeader}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.62 }}>Outfit Panel</div>
            <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 6 }}>Одежда персонажа</div>
            <div style={{ fontSize: 14, opacity: 0.72 }}>Новые комплекты открываются квестами и покупаются за монеты.</div>
          </div>
          <button onClick={onClose} style={closeButton}>✕</button>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {outfitCatalog.map((outfit) => {
              const owned = ownedOutfits.includes(outfit.id)
              const unlocked = unlockedOutfits.includes(outfit.id) || owned
              const equipped = equippedOutfit === outfit.id
              const canAfford = coins >= outfit.cost
              return (
                <div key={outfit.id} style={{
                  ...cardSurface,
                  background: equipped
                    ? 'linear-gradient(180deg, rgba(94, 200, 255, 0.18), rgba(154, 238, 134, 0.1))'
                    : cardSurface.background,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, opacity: 0.56 }}>{outfit.labelKo}</div>
                      <div style={{ fontSize: 22, fontWeight: 800 }}>{unlocked ? outfit.labelRu : '???'}</div>
                    </div>
                    <div style={{
                      alignSelf: 'flex-start',
                      padding: '6px 10px',
                      borderRadius: 999,
                      background: equipped ? 'rgba(154, 238, 134, 0.16)' : 'rgba(255, 255, 255, 0.06)',
                      fontSize: 12,
                      fontWeight: 800,
                      color: equipped ? '#9aee86' : '#f5f7ff',
                    }}>
                      {equipped ? 'Надето' : owned ? 'Есть' : unlocked ? `${outfit.cost} coins` : 'Locked'}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, opacity: 0.76, marginBottom: 14 }}>
                    {unlocked ? outfit.description : outfit.unlockHint}
                  </div>
                  <div style={{
                    borderRadius: 18,
                    minHeight: 140,
                    background: 'linear-gradient(180deg, rgba(10, 18, 34, 0.2), rgba(10, 18, 34, 0.6))',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    marginBottom: 14,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 56,
                  }}>
                    {outfit.id === 'base' && '🧥'}
                    {outfit.id === 'casual' && '👕'}
                    {outfit.id === 'school' && '🎒'}
                  </div>
                  {owned && (
                    <button onClick={() => onEquip(outfit.id)} style={primaryButton(!equipped)}>
                      {equipped ? 'Сейчас надето' : 'Надеть'}
                    </button>
                  )}
                  {!owned && unlocked && (
                    <button onClick={() => onBuy(outfit.id, outfit.cost)} style={primaryButton(canAfford)}>
                      Купить за {outfit.cost}
                    </button>
                  )}
                  {!unlocked && (
                    <div style={{ minHeight: 44, display: 'grid', alignItems: 'center', opacity: 0.56, fontSize: 13 }}>
                      {outfit.unlockHint}
                    </div>
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
