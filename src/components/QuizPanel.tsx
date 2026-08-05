import { useState } from 'react'
import type { InteractionData } from '../content/interactions'
import { isAnswerCorrect } from '../utils/answerCheck'

interface Props {
  interaction: InteractionData
  onFinish: (result: { correct: boolean; addedToReview: boolean }) => void
}

type Phase = 'answering' | 'correct' | 'wrong-retry' | 'wrong-final'

export default function QuizPanel({ interaction, onFinish }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('answering')
  const [attempts, setAttempts] = useState(0)
  const [hadFinalMistake, setHadFinalMistake] = useState(false)

  const choices = interaction.choices ?? []
  const correct = interaction.correctAnswer ?? ''
  const accepted = interaction.acceptedAnswers ?? []

  const submit = () => {
    if (!selected) return
    const ok = isAnswerCorrect(selected, correct, accepted)
    if (ok) { setPhase('correct'); return }
    if (attempts === 0) { setAttempts(1); setPhase('wrong-retry') }
    else { setHadFinalMistake(true); setPhase('wrong-final') }
  }

  const retry = () => { setSelected(null); setPhase('answering') }

  const finish = (addedToReview: boolean) => {
    onFinish({ correct: phase === 'correct' && !hadFinalMistake, addedToReview: addedToReview || hadFinalMistake })
  }

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      width: '90%', maxWidth: 600, background: '#1a1a2eea', border: '2px solid #4fc3f7',
      borderRadius: 12, padding: '16px 20px', color: '#fff', zIndex: 1000,
      fontFamily: 'system-ui, sans-serif', boxShadow: '0 8px 32px #000a'
    }}>
      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Задание</div>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{interaction.koreanPrompt}</div>
      <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 16, fontStyle: 'italic' }}>{interaction.russianInstruction}</div>

      {(phase === 'answering' || phase === 'wrong-retry') && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {choices.map((c) => (
              <button key={c} onClick={() => setSelected(c)}
                style={{
                  textAlign: 'left', padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                  border: selected === c ? '2px solid #4fc3f7' : '1px solid #555',
                  background: selected === c ? '#264653' : '#222', color: '#fff', fontSize: 14,
                }}>
                {c}
              </button>
            ))}
          </div>
          {phase === 'wrong-retry' && (
            <div style={{ color: '#ff6b6b', marginBottom: 12, fontSize: 13 }}>
              Неправильно. Попробуйте ещё раз.
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={submit} disabled={!selected}
              style={{
                background: selected ? '#4fc3f7' : '#555', color: '#000', border: 'none',
                borderRadius: 6, padding: '6px 16px', cursor: selected ? 'pointer' : 'default',
                fontWeight: 600, fontSize: 13,
              }}>
              Ответить
            </button>
          </div>
        </>
      )}

      {phase === 'correct' && (
        <>
          <div style={{ color: '#69db7c', fontWeight: 600, marginBottom: 8, fontSize: 15 }}>
            ✓ Правильно!
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 16 }}>
            +{interaction.reward.xp} XP{interaction.reward.coins ? `, +${interaction.reward.coins} монет` : ''}
            {interaction.reward.itemIds?.length ? ' — новый предмет!' : ''}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => finish(false)}
              style={{ background: '#4fc3f7', color: '#000', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              Далее →
            </button>
          </div>
        </>
      )}

      {phase === 'wrong-final' && (
        <>
          <div style={{ color: '#ff6b6b', fontWeight: 600, marginBottom: 8, fontSize: 15 }}>
            ✗ Правильный ответ: {correct}
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 16 }}>
            {interaction.russianExplanation}
          </div>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12 }}>
            Это слово добавлено в список повторения.
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={retry} style={{ background: '#333', color: '#fff', border: '1px solid #555', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}>
              Ещё попытка (без награды)
            </button>
            <button onClick={() => finish(true)}
              style={{ background: '#4fc3f7', color: '#000', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              Далее →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
