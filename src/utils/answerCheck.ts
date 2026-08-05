export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:'"()\-]/g, '')
    .replace(/\s+/g, ' ')
}

export function isAnswerCorrect(given: string, correct: string, accepted: string[] = []): boolean {
  const norm = normalizeAnswer(given)
  const candidates = [correct, ...accepted].map(normalizeAnswer)
  return candidates.includes(norm)
}
