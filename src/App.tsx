import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Phaser from 'phaser'
import CollectionPanel from './components/CollectionPanel'
import DialogueModal from './components/DialogueModal'
import MobileControls from './components/MobileControls'
import OutfitPanel from './components/OutfitPanel'
import QuizPanel from './components/QuizPanel'
import RoomCustomizer from './components/RoomCustomizer'
import SpeedSlider from './components/SpeedSlider'
import { itemCatalog, interactions, locationCatalog, outfitCatalog, type InteractionData, type RoomSlotId } from './content/interactions'
import { TownScene } from './game/scenes/TownScene'
import { useGameStore } from './store/gameStore'
import { getOverallProgress } from './utils/progress'

type FlowPhase = 'dialogue' | 'quiz' | null
type OverlayPanel = 'collection' | 'room' | 'outfit' | null

export default function App() {
  const ref = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  const [current, setCurrent] = useState<InteractionData | null>(null)
  const [phase, setPhase] = useState<FlowPhase>(null)
  const [activePanel, setActivePanel] = useState<OverlayPanel>(null)
  const [debugOpen, setDebugOpen] = useState(false)
  const [isMobileUi, setIsMobileUi] = useState(false)
  const [debugState, setDebugState] = useState({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    activeZone: null as string | null,
    lastEvent: 'Игра запускается',
  })

  const xp = useGameStore((state) => state.xp)
  const coins = useGameStore((state) => state.coins)
  const furniture = useGameStore((state) => state.furniture)
  const outfits = useGameStore((state) => state.outfits)
  const equippedOutfit = useGameStore((state) => state.equippedOutfit)
  const roomSlots = useGameStore((state) => state.roomSlots)
  const unlockedItems = useGameStore((state) => state.unlockedItems)
  const unlockedOutfits = useGameStore((state) => state.unlockedOutfits)
  const completedInteractions = useGameStore((state) => state.completedInteractions)
  const collection = useGameStore((state) => state.collection)
  const reviewList = useGameStore((state) => state.reviewList)

  const addXP = useGameStore((state) => state.addXP)
  const addCoins = useGameStore((state) => state.addCoins)
  const spendCoins = useGameStore((state) => state.spendCoins)
  const addFurniture = useGameStore((state) => state.addFurniture)
  const addOutfit = useGameStore((state) => state.addOutfit)
  const unlockItem = useGameStore((state) => state.unlockItem)
  const unlockOutfit = useGameStore((state) => state.unlockOutfit)
  const equipOutfit = useGameStore((state) => state.equipOutfit)
  const setRoomSlot = useGameStore((state) => state.setRoomSlot)
  const completeInteraction = useGameStore((state) => state.completeInteraction)
  const addWordToCollection = useGameStore((state) => state.addWordToCollection)
  const addSentenceToCollection = useGameStore((state) => state.addSentenceToCollection)
  const addPlaceToCollection = useGameStore((state) => state.addPlaceToCollection)
  const addItemToCollection = useGameStore((state) => state.addItemToCollection)
  const addToReview = useGameStore((state) => state.addToReview)
  const resetProgress = useGameStore((state) => state.resetProgress)

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: ref.current!,
      width: 960,
      height: 540,
      backgroundColor: '#0c1220',
      pixelArt: true,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      physics: { default: 'arcade', arcade: { debug: false } },
      scene: [TownScene],
    })
    gameRef.current = game

    const onOpenInteraction = (data: { interactionId: string }) => {
      const interaction = interactions.find((entry) => entry.id === data.interactionId)
      if (!interaction) return
      setCurrent(interaction)
      setPhase('dialogue')
    }
    const onDebugState = (state: typeof debugState) => setDebugState(state)
    const onDebugEvent = (lastEvent: string) => setDebugState((state) => ({ ...state, lastEvent }))

    game.events.on('open-interaction', onOpenInteraction)
    game.events.on('debug-state', onDebugState)
    game.events.on('debug-event', onDebugEvent)

    return () => {
      game.events.off('open-interaction', onOpenInteraction)
      game.events.off('debug-state', onDebugState)
      game.events.off('debug-event', onDebugEvent)
      game.destroy(true)
      gameRef.current = null
    }
  }, [])

  useEffect(() => {
    gameRef.current?.registry.set('interactionOpen', Boolean(current && phase))
    gameRef.current?.registry.set('debugOpen', debugOpen)
  }, [current, phase, debugOpen])

  useEffect(() => {
    gameRef.current?.events.emit('progress-changed')
  }, [completedInteractions, collection.places])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)')
    const updateMobileState = () => setIsMobileUi(mediaQuery.matches || window.innerWidth <= 900)
    updateMobileState()
    mediaQuery.addEventListener('change', updateMobileState)
    window.addEventListener('resize', updateMobileState)
    return () => {
      mediaQuery.removeEventListener('change', updateMobileState)
      window.removeEventListener('resize', updateMobileState)
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'F3') {
        event.preventDefault()
        setDebugOpen((value) => !value)
      }
      if (event.key === 'Escape') {
        setActivePanel(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const unlockInteractionContent = (interaction: InteractionData) => {
    interaction.unlockWords?.forEach((wordId) => addWordToCollection(wordId))
    if (interaction.unlockSentenceId) {
      addSentenceToCollection(interaction.unlockSentenceId)
    }
    addPlaceToCollection(interaction.locationId)
  }

  const grantReward = (interaction: InteractionData) => {
    addXP(interaction.reward.xp)
    addCoins(interaction.reward.coins)

    interaction.reward.itemIds?.forEach((itemId) => {
      const item = itemCatalog.find((entry) => entry.id === itemId)
      unlockItem(itemId)
      addItemToCollection(itemId)
      if (item?.kind === 'furniture') {
        addFurniture(itemId)
      }
    })

    interaction.reward.outfitIds?.forEach((outfitId) => {
      unlockOutfit(outfitId)
      addOutfit(outfitId)
      addItemToCollection(outfitId)
    })
  }

  const completeInteractionFlow = (interaction: InteractionData, rewardGranted: boolean) => {
    completeInteraction(interaction.id)
    unlockInteractionContent(interaction)
    if (rewardGranted) {
      grantReward(interaction)
    }
  }

  const handleDialogueComplete = () => {
    if (!current) return
    if (current.type === 'multiple-choice') {
      setPhase('quiz')
      return
    }
    completeInteractionFlow(current, true)
    setCurrent(null)
    setPhase(null)
  }

  const handleQuizFinish = (result: { correct: boolean; addedToReview: boolean }) => {
    if (!current) return
    completeInteractionFlow(current, result.correct)
    if (result.addedToReview) {
      addToReview(current.id)
    }
    setCurrent(null)
    setPhase(null)
  }

  const handleBuyItem = (itemId: string, cost: number) => {
    const item = itemCatalog.find((entry) => entry.id === itemId)
    if (!item) return
    if (!spendCoins(cost)) return
    unlockItem(itemId)
    addItemToCollection(itemId)
    if (item.kind === 'furniture') {
      addFurniture(itemId)
    }
  }

  const handleBuyOutfit = (outfitId: string, cost: number) => {
    if (!outfitCatalog.find((entry) => entry.id === outfitId)) return
    if (!spendCoins(cost)) return
    unlockOutfit(outfitId)
    addOutfit(outfitId)
    addItemToCollection(outfitId)
  }

  const closeAll = () => {
    setCurrent(null)
    setPhase(null)
  }

  const activeOverlaysOpen = Boolean(current && phase) || Boolean(activePanel)
  const totalProgress = getOverallProgress(completedInteractions)
  const completedPlaces = locationCatalog.filter((location) =>
    interactions.filter((interaction) => interaction.locationId === location.id).every((interaction) => completedInteractions.includes(interaction.id))
  ).length

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(circle at top, #1d2f56, #0a101d 58%)',
      overflow: 'hidden',
      fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    }}>
      <div ref={ref} style={{ width: '100%', height: '100%' }} />

      <div style={{
        position: 'fixed',
        inset: '14px 14px auto 14px',
        zIndex: 999,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        pointerEvents: 'none',
      }}>
        <div style={{
          pointerEvents: 'auto',
          padding: '12px 14px',
          borderRadius: 18,
          background: 'rgba(6, 10, 20, 0.72)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#f5f7ff',
          boxShadow: '0 12px 30px rgba(0,0,0,0.28)',
          minWidth: 250,
        }}>
          <div style={{ fontSize: 12, opacity: 0.62, marginBottom: 6 }}>Korea Town MVP</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 800 }}>XP {xp}</span>
            <span style={{ fontWeight: 800 }}>Coins {coins}</span>
            <span style={{ fontWeight: 800 }}>Места {completedPlaces} / {locationCatalog.length}</span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${totalProgress}%`, height: '100%', background: 'linear-gradient(90deg, #5ec8ff, #9aee86)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', pointerEvents: 'auto' }}>
          <button onClick={() => setActivePanel('collection')} style={hudButtonStyle}>도감</button>
          <button onClick={() => setActivePanel('room')} style={hudButtonStyle}>Комната</button>
          <button onClick={() => setActivePanel('outfit')} style={hudButtonStyle}>Одежда</button>
          <button onClick={resetProgress} style={{ ...hudButtonStyle, background: 'rgba(255, 124, 124, 0.16)' }}>Сбросить</button>
        </div>
      </div>

      {current && phase === 'dialogue' && (
        <DialogueModal lines={current.dialogue} onComplete={handleDialogueComplete} onClose={closeAll} />
      )}

      {current && phase === 'quiz' && (
        <QuizPanel interaction={current} onFinish={handleQuizFinish} />
      )}

      {activePanel === 'collection' && (
        <CollectionPanel collection={collection} completedInteractions={completedInteractions} onClose={() => setActivePanel(null)} />
      )}

      {activePanel === 'room' && (
        <RoomCustomizer
          coins={coins}
          ownedFurniture={furniture}
          unlockedItems={unlockedItems}
          roomState={roomSlots}
          onClose={() => setActivePanel(null)}
          onBuyItem={handleBuyItem}
          onEquip={(slotId: RoomSlotId, itemId: string | null) => setRoomSlot(slotId, itemId)}
        />
      )}

      {activePanel === 'outfit' && (
        <OutfitPanel
          coins={coins}
          ownedOutfits={outfits}
          unlockedOutfits={unlockedOutfits}
          equippedOutfit={equippedOutfit}
          onClose={() => setActivePanel(null)}
          onBuy={handleBuyOutfit}
          onEquip={equipOutfit}
        />
      )}

      {!activeOverlaysOpen && <SpeedSlider isMobile={isMobileUi} />}

      {isMobileUi && (
        <MobileControls
          disabled={activeOverlaysOpen}
          onMoveChange={(input) => gameRef.current?.registry.set('mobileInput', input)}
          onInteract={() => gameRef.current?.events.emit('mobile-interact')}
        />
      )}

      {debugOpen && (
        <div style={{
          position: 'fixed',
          left: 14,
          bottom: isMobileUi ? 160 : 14,
          zIndex: 1100,
          width: 290,
          background: 'rgba(7, 12, 22, 0.92)',
          color: '#d7f9ff',
          border: '1px solid #4fc3f7',
          borderRadius: 14,
          padding: 12,
          font: '12px/1.5 monospace',
          pointerEvents: 'none',
        }}>
          <strong>DEBUG (F3)</strong>
          <div>phase: {phase ?? 'none'}</div>
          <div>panel: {activePanel ?? 'none'}</div>
          <div>position: {debugState.x}, {debugState.y}</div>
          <div>velocity: {debugState.vx}, {debugState.vy}</div>
          <div>zone: {debugState.activeZone ?? 'none'}</div>
          <div>completed: {completedInteractions.length} / {interactions.length}</div>
          <div>review: {reviewList.join(', ') || 'none'}</div>
          <div>items: {collection.items.length}</div>
          <div>event: {debugState.lastEvent}</div>
        </div>
      )}
    </div>
  )
}

const hudButtonStyle: CSSProperties = {
  minHeight: 44,
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(6, 10, 20, 0.72)',
  color: '#f5f7ff',
  padding: '0 14px',
  fontWeight: 800,
  cursor: 'pointer',
  boxShadow: '0 12px 30px rgba(0,0,0,0.28)',
}
