import { useState } from 'react'
import { itemCatalog, locationCatalog, outfitCatalog, sentenceCatalog } from '../content/interactions'
import { vocabulary } from '../content/vocabulary'
import { getLocationProgress } from '../utils/progress'
import { cardSurface, closeButton, overlayBackdrop, panelHeader, panelShell, tabButton } from './panelStyles'

type CollectionState = {
  words: string[]
  sentences: string[]
  places: string[]
  items: string[]
}

interface Props {
  collection: CollectionState
  completedInteractions: string[]
  onClose: () => void
}

type TabId = 'words' | 'sentences' | 'places' | 'items'

const itemKindLabels: Record<string, string> = {
  furniture: 'Мебель',
  souvenir: 'Сувенир',
  bag: 'Сумка',
  accessory: 'Аксессуар',
  snack: 'Еда и напитки',
  outfit: 'Одежда',
}

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'words', label: 'Слова' },
  { id: 'sentences', label: 'Предложения' },
  { id: 'places', label: 'Места' },
  { id: 'items', label: 'Предметы' },
]

export default function CollectionPanel({ collection, completedInteractions, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('words')

  const renderWords = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
      {vocabulary.map((entry) => {
        const unlocked = collection.words.includes(entry.id)
        return (
          <div key={entry.id} style={cardSurface}>
            <div style={{ fontSize: 12, opacity: 0.62, marginBottom: 10 }}>{entry.locationId.toUpperCase()}</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{unlocked ? entry.korean : '???'}</div>
            <div style={{ fontSize: 14, opacity: unlocked ? 0.92 : 0.52 }}>{unlocked ? entry.russian : 'Не открыто'}</div>
          </div>
        )
      })}
    </div>
  )

  const renderSentences = () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {sentenceCatalog.map((entry) => {
        const unlocked = collection.sentences.includes(entry.id)
        return (
          <div key={entry.id} style={cardSurface}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{unlocked ? entry.korean : '???'}</div>
            <div style={{ fontSize: 14, opacity: unlocked ? 0.86 : 0.54 }}>{unlocked ? entry.russian : 'Фраза откроется по мере прохождения.'}</div>
          </div>
        )
      })}
    </div>
  )

  const renderPlaces = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
      {locationCatalog.map((entry) => {
        const progress = getLocationProgress(entry.id, completedInteractions)
        const unlocked = progress.completed > 0 || collection.places.includes(entry.id)
        return (
          <div key={entry.id} style={{ ...cardSurface, opacity: unlocked ? 1 : 0.82 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.58 }}>{entry.labelKo}</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{entry.labelRu}</div>
              </div>
              <div style={{
                alignSelf: 'flex-start',
                padding: '6px 10px',
                borderRadius: 999,
                background: progress.isComplete ? 'rgba(151, 239, 138, 0.18)' : 'rgba(255, 255, 255, 0.06)',
                color: progress.isComplete ? '#9aee86' : '#f5f7ff',
                fontSize: 12,
                fontWeight: 800,
              }}>
                {progress.percent}%
              </div>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ width: `${progress.percent}%`, height: '100%', background: progress.isComplete ? '#9aee86' : '#5ec8ff' }} />
            </div>
            <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 10 }}>{entry.summary}</div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              {progress.completed} / {progress.total} шагов, статус: {progress.isComplete ? 'цветной' : 'серый'}
            </div>
          </div>
        )
      })}
    </div>
  )

  const renderItems = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
      {[...itemCatalog, ...outfitCatalog.map((outfit) => ({
        id: outfit.id,
        labelRu: outfit.labelRu,
        labelKo: outfit.labelKo,
        kind: 'outfit' as const,
        description: outfit.description,
        unlockHint: outfit.unlockHint,
      }))].map((entry) => {
        const unlocked = collection.items.includes(entry.id)
        return (
          <div key={entry.id} style={cardSurface}>
            <div style={{ fontSize: 12, opacity: 0.56, marginBottom: 8 }}>
              {itemKindLabels[entry.kind] ?? 'Одежда'}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{unlocked ? entry.labelRu : '???'}</div>
            <div style={{ fontSize: 14, opacity: 0.84, marginBottom: 8 }}>{unlocked ? entry.labelKo : 'Силуэт предмета'}</div>
            <div style={{ fontSize: 13, opacity: 0.68 }}>{unlocked ? entry.description : entry.unlockHint}</div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div style={{ ...overlayBackdrop, display: 'grid', placeItems: 'center', padding: 16 }} onClick={onClose}>
      <div style={panelShell} onClick={(event) => event.stopPropagation()}>
        <div style={panelHeader}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.62 }}>도감</div>
            <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 6 }}>Коллекция Korea Town</div>
            <div style={{ fontSize: 14, opacity: 0.72 }}>Все найденные слова, фразы, места и предметы сохраняются после перезагрузки.</div>
          </div>
          <button onClick={onClose} style={closeButton}>✕</button>
        </div>

        <div style={{ padding: '18px 24px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabButton(activeTab === tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'words' && renderWords()}
          {activeTab === 'sentences' && renderSentences()}
          {activeTab === 'places' && renderPlaces()}
          {activeTab === 'items' && renderItems()}
        </div>
      </div>
    </div>
  )
}
