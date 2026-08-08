import { useState } from 'react'
import {
  collectionCategories,
  countDiscovered,
  type CollectionCategory,
  type CollectionEntry,
} from '../content/collection'
import { cardSurface, closeButton, overlayBackdrop, panelHeader, panelShell, tabButton } from './panelStyles'

type CollectionState = {
  words: string[]
  sentences: string[]
  places: string[]
  items: string[]
}

interface Props {
  collection: CollectionState
  onClose: () => void
}

/** Visible title for this feature. Replaces the former «도감» label everywhere. */
export const COLLECTION_TITLE = 'Коллекция Korea Town'
export const COLLECTION_SUBTITLE =
  'Все найденные слова, предложения, места и предметы сохраняются в вашей коллекции.'

export default function CollectionPanel({ collection, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<CollectionCategory>('words')

  const active = collectionCategories.find((tab) => tab.id === activeTab)!
  const discoveredIds = collection[activeTab] ?? []
  const discoveredCount = countDiscovered(active.entries, discoveredIds)
  const owned = new Set(discoveredIds)

  return (
    <div style={{ ...overlayBackdrop, display: 'grid', placeItems: 'center', padding: 16 }} onClick={onClose}>
      <div style={panelShell} onClick={(event) => event.stopPropagation()}>
        <div style={panelHeader}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 6, lineHeight: 1.15 }}>{COLLECTION_TITLE}</div>
            <div style={{ fontSize: 14, opacity: 0.72 }}>{COLLECTION_SUBTITLE}</div>
          </div>
          <button onClick={onClose} style={closeButton} aria-label="Закрыть коллекцию">✕</button>
        </div>

        <div style={{ padding: '18px 20px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {collectionCategories.map((tab) => {
              const count = countDiscovered(tab.entries, collection[tab.id] ?? [])
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={tabButton(activeTab === tab.id)}
                  aria-pressed={activeTab === tab.id}
                >
                  {tab.label} <span style={{ opacity: 0.72, fontWeight: 700 }}>{count}/{tab.entries.length}</span>
                </button>
              )
            })}
          </div>

          <div style={{ fontSize: 13, opacity: 0.66, marginBottom: 16 }}>
            Открыто {discoveredCount} из {active.entries.length}
          </div>

          {active.entries.length === 0 ? (
            <div style={{ ...cardSurface, textAlign: 'center', opacity: 0.75 }}>
              В этой категории пока нет записей.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: 12,
            }}>
              {active.entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} unlocked={owned.has(entry.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EntryCard({ entry, unlocked }: { entry: CollectionEntry; unlocked: boolean }) {
  const isSentence = entry.category === 'sentences'

  return (
    <div style={{
      ...cardSurface,
      minWidth: 0,
      opacity: unlocked ? 1 : 0.9,
      border: unlocked ? '1px solid rgba(126, 219, 255, 0.28)' : '1px solid rgba(255, 255, 255, 0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 20, lineHeight: 1, filter: unlocked ? 'none' : 'grayscale(1)', opacity: unlocked ? 1 : 0.5 }}>
          {entry.icon}
        </span>
        <span style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          opacity: 0.62,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {entry.topicRu}
        </span>
      </div>

      {unlocked ? (
        <>
          <div style={{
            fontSize: isSentence ? 16 : 19,
            fontWeight: 800,
            marginBottom: 4,
            lineHeight: 1.35,
            overflowWrap: 'anywhere',
          }}>
            {entry.korean}
          </div>
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8, overflowWrap: 'anywhere' }}>
            {entry.russian}
          </div>
          {entry.exampleKo && (
            <div style={{
              fontSize: 12.5,
              opacity: 0.78,
              padding: '8px 10px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.05)',
              marginBottom: 8,
              overflowWrap: 'anywhere',
            }}>
              <div style={{ fontWeight: 700 }}>{entry.exampleKo}</div>
              {entry.exampleRu && <div style={{ opacity: 0.82 }}>{entry.exampleRu}</div>}
            </div>
          )}
          <div style={{ fontSize: 12, opacity: 0.6, overflowWrap: 'anywhere' }}>{entry.descriptionRu}</div>
          {entry.cost !== undefined && (
            <div style={{ fontSize: 12, marginTop: 8, fontWeight: 800, color: '#9aee86' }}>{entry.cost} coins</div>
          )}
        </>
      ) : (
        <>
          <div style={{
            fontSize: 18,
            fontWeight: 800,
            marginBottom: 6,
            letterSpacing: '0.14em',
            opacity: 0.55,
          }}>
            ● ● ●
          </div>
          <div style={{
            display: 'inline-block',
            fontSize: 11,
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.07)',
            marginBottom: 8,
          }}>
            Не открыто
          </div>
          <div style={{ fontSize: 12.5, opacity: 0.72, overflowWrap: 'anywhere' }}>
            {entry.discoveryHintRu}
          </div>
        </>
      )}
    </div>
  )
}
