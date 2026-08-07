import type { DialogueLine } from '../components/DialogueModal'

export interface InteractionReward {
  xp: number
  coins: number
  itemIds?: string[]
  outfitIds?: string[]
}

export interface InteractionData {
  id: string
  locationId: string
  npcId: string
  level: number
  type: 'dialogue' | 'multiple-choice'
  koreanPrompt: string
  russianInstruction: string
  russianExplanation?: string
  choices?: string[]
  correctAnswer?: string
  acceptedAnswers?: string[]
  reward: InteractionReward
  unlockWords?: string[]
  unlockSentenceId?: string
  completed: boolean
  dialogue: DialogueLine[]
}

export interface LocationConfig {
  id: string
  labelKo: string
  labelRu: string
  npcId: string
  npcName: string
  npcSpritePrefix: string
  buildingTexture: string
  mapX: number
  mapY: number
  entrance: 'top' | 'bottom'
  progressColor: number
  summary: string
}

export interface SentenceEntry {
  id: string
  korean: string
  russian: string
  locationId: string
}

export interface ItemConfig {
  id: string
  labelKo: string
  labelRu: string
  kind: 'furniture' | 'souvenir' | 'bag' | 'accessory' | 'snack'
  slot?: RoomSlotId
  cost: number
  unlockHint: string
  description: string
}

export interface OutfitConfig {
  id: string
  labelKo: string
  labelRu: string
  cost: number
  unlockHint: string
  description: string
}

export type RoomSlotId = 'bed' | 'desk' | 'chair' | 'lamp' | 'poster' | 'plant'

export const roomSlots: Array<{ id: RoomSlotId; labelRu: string; labelKo: string }> = [
  { id: 'bed', labelRu: 'Кровать', labelKo: '침대' },
  { id: 'desk', labelRu: 'Стол', labelKo: '책상' },
  { id: 'chair', labelRu: 'Стул', labelKo: '의자' },
  { id: 'lamp', labelRu: 'Лампа', labelKo: '램프' },
  { id: 'poster', labelRu: 'Постер', labelKo: '포스터' },
  { id: 'plant', labelRu: 'Цветок', labelKo: '화분' },
]

export const locationCatalog: LocationConfig[] = [
  {
    id: 'dorm',
    labelKo: '기숙사',
    labelRu: 'Общежитие',
    npcId: 'yuna',
    npcName: '유나',
    npcSpritePrefix: 'yuna',
    buildingTexture: 'building-dorm',
    mapX: 13,
    mapY: 8,
    entrance: 'bottom',
    progressColor: 0x6fd3ff,
    summary: 'Базовые предметы комнаты и простые фразы знакомства.',
  },
  {
    id: 'store',
    labelKo: '편의점',
    labelRu: 'Магазин',
    npcId: 'minsu',
    npcName: '민수',
    npcSpritePrefix: 'minsu',
    buildingTexture: 'building-store',
    mapX: 51,
    mapY: 8,
    entrance: 'bottom',
    progressColor: 0x97ef8a,
    summary: 'Еда и напитки, нужные в повседневной покупке.',
  },
  {
    id: 'cafe',
    labelKo: '카페',
    labelRu: 'Кафе',
    npcId: 'jihoon',
    npcName: '지훈',
    npcSpritePrefix: 'jihoon',
    buildingTexture: 'building-cafe',
    mapX: 13,
    mapY: 32,
    entrance: 'top',
    progressColor: 0xffb36b,
    summary: 'Заказ кофе и чтение меню в кафе.',
  },
  {
    id: 'school',
    labelKo: '학교',
    labelRu: 'Школа',
    npcId: 'sora',
    npcName: '소라',
    npcSpritePrefix: 'sora',
    buildingTexture: 'building-school',
    mapX: 51,
    mapY: 32,
    entrance: 'top',
    progressColor: 0xff92c2,
    summary: 'Слова про учебу, документы и предметы класса.',
  },
]

export const sentenceCatalog: SentenceEntry[] = [
  { id: 's-dorm-1', korean: '기숙사에 침대가 있어요.', russian: 'В общежитии есть кровать.', locationId: 'dorm' },
  { id: 's-dorm-2', korean: '가방은 책상 옆에 있어요.', russian: 'Сумка рядом со столом.', locationId: 'dorm' },
  { id: 's-store-1', korean: '물하고 우유를 주세요.', russian: 'Дайте, пожалуйста, воду и молоко.', locationId: 'store' },
  { id: 's-store-2', korean: '삼각김밥은 어디에 있어요?', russian: 'Где находится 삼각김밥?', locationId: 'store' },
  { id: 's-cafe-1', korean: '커피 한 잔 주세요.', russian: 'Один кофе, пожалуйста.', locationId: 'cafe' },
  { id: 's-cafe-2', korean: '메뉴판을 보고 싶어요.', russian: 'Я хочу посмотреть меню.', locationId: 'cafe' },
  { id: 's-school-1', korean: '학생증을 보여 주세요.', russian: 'Покажите, пожалуйста, студенческий билет.', locationId: 'school' },
  { id: 's-school-2', korean: '칠판 앞에 책이 있어요.', russian: 'Перед доской лежит книга.', locationId: 'school' },
]

export const itemCatalog: ItemConfig[] = [
  {
    id: 'cozy-bed',
    labelKo: '포근한 침대',
    labelRu: 'Уютная кровать',
    kind: 'furniture',
    slot: 'bed',
    cost: 24,
    unlockHint: 'Открывается после квестов в общежитии.',
    description: 'Мягкая кровать для первой комнаты.',
  },
  {
    id: 'study-desk',
    labelKo: '공부 책상',
    labelRu: 'Учебный стол',
    kind: 'furniture',
    slot: 'desk',
    cost: 18,
    unlockHint: 'Подарок от Юны за завершение общежития.',
    description: 'Первый предмет мебели, который Юна отдаёт игроку.',
  },
  {
    id: 'wood-chair',
    labelKo: '나무 의자',
    labelRu: 'Деревянный стул',
    kind: 'furniture',
    slot: 'chair',
    cost: 16,
    unlockHint: 'Покупается после знакомства с магазином.',
    description: 'Простой стул для учебного уголка.',
  },
  {
    id: 'moon-lamp',
    labelKo: '달 램프',
    labelRu: 'Лунная лампа',
    kind: 'furniture',
    slot: 'lamp',
    cost: 22,
    unlockHint: 'Открывается после кафе.',
    description: 'Тёплый свет для комнаты после вечерних заданий.',
  },
  {
    id: 'seoul-poster',
    labelKo: '서울 포스터',
    labelRu: 'Постер Сеула',
    kind: 'furniture',
    slot: 'poster',
    cost: 20,
    unlockHint: 'Покупается после квестов в школе.',
    description: 'Постер для стены с атмосферой города.',
  },
  {
    id: 'mint-plant',
    labelKo: '민트 화분',
    labelRu: 'Мятный цветок',
    kind: 'furniture',
    slot: 'plant',
    cost: 14,
    unlockHint: 'Открывается после магазина.',
    description: 'Небольшой зелёный акцент для комнаты.',
  },
  {
    id: 'ramen-sticker',
    labelKo: '라면 스티커',
    labelRu: 'Стикер с рамёном',
    kind: 'souvenir',
    cost: 0,
    unlockHint: 'Награда от 민수.',
    description: 'Сувенир за помощь в магазине.',
  },
  {
    id: 'cafe-mug',
    labelKo: '카페 머그컵',
    labelRu: 'Кружка из кафе',
    kind: 'souvenir',
    cost: 0,
    unlockHint: 'Награда от 지훈.',
    description: 'Памятная кружка после заказа в кафе.',
  },
  {
    id: 'campus-badge',
    labelKo: '학교 배지',
    labelRu: 'Значок кампуса',
    kind: 'souvenir',
    cost: 0,
    unlockHint: 'Награда от 소라.',
    description: 'Коллекционный значок за прохождение школы.',
  },

  // ── Товары магазинов Хондэ (покупаются за монеты в интерьерах) ──────────
  {
    id: 'barley-tea',
    labelKo: '보리차',
    labelRu: 'Ячменный чай',
    kind: 'snack',
    cost: 6,
    unlockHint: 'Продаётся в круглосуточном магазине Хондэ.',
    description: 'Холодный ячменный чай из холодильника у входа.',
  },
  {
    id: 'rice-ball',
    labelKo: '삼각김밥',
    labelRu: 'Онигири самгак-кимпаб',
    kind: 'snack',
    cost: 8,
    unlockHint: 'Продаётся в круглосуточном магазине Хондэ.',
    description: 'Треугольный рисовый ролик — классика корейских магазинов.',
  },
  {
    id: 'umbrella',
    labelKo: '우산',
    labelRu: 'Зонт',
    kind: 'accessory',
    cost: 15,
    unlockHint: 'Продаётся в круглосуточном магазине Хондэ.',
    description: 'Простой прозрачный зонт на случай дождя.',
  },
  {
    id: 'hair-pin',
    labelKo: '별 머리핀',
    labelRu: 'Заколка-звезда',
    kind: 'accessory',
    cost: 12,
    unlockHint: 'Продаётся в магазине одежды Хондэ.',
    description: 'Маленькая заколка в форме звезды.',
  },
  {
    id: 'cap-navy',
    labelKo: '네이비 모자',
    labelRu: 'Тёмно-синяя кепка',
    kind: 'accessory',
    cost: 18,
    unlockHint: 'Продаётся в универмаге Хондэ.',
    description: 'Базовая кепка, которая подходит к любому образу.',
  },
  {
    id: 'round-glasses',
    labelKo: '동그란 안경',
    labelRu: 'Круглые очки',
    kind: 'accessory',
    cost: 22,
    unlockHint: 'Продаётся в универмаге Хондэ.',
    description: 'Тонкая оправа круглой формы.',
  },
  {
    id: 'canvas-bag',
    labelKo: '캔버스 가방',
    labelRu: 'Холщовая сумка',
    kind: 'bag',
    cost: 28,
    unlockHint: 'Продаётся в универмаге Хондэ.',
    description: 'Лёгкая тканевая сумка на каждый день.',
  },
  {
    id: 'mini-backpack',
    labelKo: '미니 백팩',
    labelRu: 'Мини-рюкзак',
    kind: 'bag',
    cost: 38,
    unlockHint: 'Продаётся в универмаге Хондэ.',
    description: 'Компактный рюкзак для прогулок по городу.',
  },
]

export const outfitCatalog: OutfitConfig[] = [
  {
    id: 'base',
    labelKo: '기본 복장',
    labelRu: 'Базовый',
    cost: 0,
    unlockHint: 'Доступен с самого начала.',
    description: 'Стартовый комплект игрока.',
  },
  {
    id: 'casual',
    labelKo: '캐주얼 복장',
    labelRu: 'Кэжуал',
    cost: 30,
    unlockHint: 'Открывается после магазина.',
    description: 'Повседневный комплект для прогулки по району.',
  },
  {
    id: 'school',
    labelKo: '학교 복장',
    labelRu: 'Школьный',
    cost: 40,
    unlockHint: 'Открывается после школы.',
    description: 'Аккуратная одежда для учебных заданий.',
  },

  // ── Одежда из магазина одежды в Хондэ ──────────────────────────────────
  {
    id: 'street-style',
    labelKo: '스트리트 룩',
    labelRu: 'Уличный стиль',
    cost: 35,
    unlockHint: 'Продаётся в магазине одежды Хондэ.',
    description: 'Свободный уличный образ в духе района Хондэ.',
  },
  {
    id: 'hongdae-jacket',
    labelKo: '홍대 재킷',
    labelRu: 'Куртка Хондэ',
    cost: 45,
    unlockHint: 'Продаётся в магазине одежды Хондэ.',
    description: 'Тёплая куртка для вечерних прогулок по району.',
  },
  {
    id: 'stage-look',
    labelKo: '무대 의상',
    labelRu: 'Сценический образ',
    cost: 60,
    unlockHint: 'Продаётся в магазине одежды Хондэ.',
    description: 'Яркий комплект для выступления на сцене.',
  },
]

const DORM_GREET: DialogueLine[] = [
  { speaker: '유나', korean: '안녕하세요! 저는 유나예요.', russian: 'Привет! Меня зовут Юна.' },
  { speaker: '유나', korean: '여기는 기숙사예요. 침대, 책상, 가방이 있어요.', russian: 'Это общежитие. Здесь есть кровать, стол и сумка.' },
  { speaker: '유나', korean: '방에서 쓰는 단어부터 같이 연습해요.', russian: 'Давай сначала потренируем слова для комнаты.' },
]

const DORM_Q1: DialogueLine[] = [
  { speaker: '유나', korean: '좋아요. 첫 번째 질문이에요.', russian: 'Хорошо. Первый вопрос.' },
]

const DORM_Q2: DialogueLine[] = [
  { speaker: '유나', korean: '이번에는 가방을 기억해 볼까요?', russian: 'Теперь проверим, помнишь ли ты слово “сумка”.' },
]

const DORM_DONE: DialogueLine[] = [
  { speaker: '유나', korean: '이제 방 단어를 잘 알고 있네요!', russian: 'Теперь ты хорошо знаешь слова для комнаты.' },
  { speaker: '유나', korean: '공부 책상을 선물로 줄게요.', russian: 'Дарю тебе учебный стол.' },
]

const STORE_GREET: DialogueLine[] = [
  { speaker: '민수', korean: '어서 오세요! 저는 민수예요.', russian: 'Добро пожаловать! Я Минсу.' },
  { speaker: '민수', korean: '편의점에서는 물, 우유, 삼각김밥을 자주 사요.', russian: 'В магазине часто покупают воду, молоко и 삼각김밥.' },
  { speaker: '민수', korean: '필요한 걸 말할 수 있으면 훨씬 편해져요.', russian: 'Если умеешь назвать нужное, покупать станет проще.' },
]

const STORE_Q1: DialogueLine[] = [
  { speaker: '민수', korean: '먼저 음료부터 볼까요?', russian: 'Сначала посмотрим на напитки.' },
]

const STORE_Q2: DialogueLine[] = [
  { speaker: '민수', korean: '이번에는 간단한 음식을 골라봐요.', russian: 'Теперь выберем простую еду.' },
]

const STORE_DONE: DialogueLine[] = [
  { speaker: '민수', korean: '편의점 미션 완료예요!', russian: 'Миссия магазина завершена.' },
  { speaker: '민수', korean: '이 스티커와 캐주얼 복장을 열어 줄게요.', russian: 'Открываю тебе стикер и кэжуал-комплект.' },
]

const CAFE_GREET: DialogueLine[] = [
  { speaker: '지훈', korean: '안녕하세요, 저는 지훈이에요.', russian: 'Здравствуйте, я Джихун.' },
  { speaker: '지훈', korean: '카페에서는 커피, 컵, 메뉴판 단어가 자주 나와요.', russian: 'В кафе часто встречаются слова кофе, чашка и меню.' },
  { speaker: '지훈', korean: '주문할 때 자신 있게 말해 봐요.', russian: 'Попробуй уверенно произнести заказ.' },
]

const CAFE_Q1: DialogueLine[] = [
  { speaker: '지훈', korean: '먼저 가장 기본적인 주문부터요.', russian: 'Начнём с самого базового заказа.' },
]

const CAFE_Q2: DialogueLine[] = [
  { speaker: '지훈', korean: '이제 카페 물건 이름도 확인해요.', russian: 'Теперь проверим названия предметов в кафе.' },
]

const CAFE_DONE: DialogueLine[] = [
  { speaker: '지훈', korean: '주문이 아주 자연스러웠어요.', russian: 'Заказ прозвучал очень естественно.' },
  { speaker: '지훈', korean: '카페 머그컵과 램프를 챙겨 가세요.', russian: 'Забирай кружку из кафе и лампу.' },
]

const SCHOOL_GREET: DialogueLine[] = [
  { speaker: '소라', korean: '안녕! 나는 소라야.', russian: 'Привет! Я Сора.' },
  { speaker: '소라', korean: '학교에서는 책, 학생증, 칠판 같은 단어를 꼭 알아야 해.', russian: 'В школе обязательно знать слова “книга”, “студенческий билет”, “доска”.' },
  { speaker: '소라', korean: '준비되면 바로 시작하자.', russian: 'Если готов, начнём сразу.' },
]

const SCHOOL_Q1: DialogueLine[] = [
  { speaker: '소라', korean: '먼저 학교에 꼭 필요한 물건부터요.', russian: 'Сначала предмет, который нужен каждому ученику.' },
]

const SCHOOL_Q2: DialogueLine[] = [
  { speaker: '소라', korean: '이번에는 교실 안에 있는 물건이에요.', russian: 'Теперь предмет, который находится в классе.' },
]

const SCHOOL_DONE: DialogueLine[] = [
  { speaker: '소라', korean: '학교 단어도 잘 익혔네요.', russian: 'Школьные слова ты тоже хорошо усвоил.' },
  { speaker: '소라', korean: '학교 복장과 기념 배지를 줄게요.', russian: 'Дарю школьный комплект и памятный значок.' },
]

export const interactions: InteractionData[] = [
  {
    id: 'dorm-yuna-greet',
    locationId: 'dorm',
    npcId: 'yuna',
    level: 1,
    type: 'dialogue',
    koreanPrompt: '안녕하세요! 저는 유나예요.',
    russianInstruction: 'Юна знакомит тебя с общежитием.',
    russianExplanation: '안녕하세요 — формальное приветствие. 저는 X예요 — “я X”.',
    reward: { xp: 6, coins: 3 },
    unlockWords: ['v-dorm', 'v-bed', 'v-desk', 'v-bag'],
    unlockSentenceId: 's-dorm-1',
    completed: false,
    dialogue: DORM_GREET,
  },
  {
    id: 'dorm-yuna-quiz-1',
    locationId: 'dorm',
    npcId: 'yuna',
    level: 1,
    type: 'multiple-choice',
    koreanPrompt: '침대가 뭐예요?',
    russianInstruction: 'Что означает слово “침대”?',
    russianExplanation: '침대 = кровать. 책상 = стол. 가방 = сумка.',
    choices: ['кровать', 'стол', 'сумка'],
    correctAnswer: 'кровать',
    acceptedAnswers: ['Кровать', 'кровать.'],
    reward: { xp: 10, coins: 6 },
    unlockWords: ['v-bed'],
    unlockSentenceId: 's-dorm-1',
    completed: false,
    dialogue: DORM_Q1,
  },
  {
    id: 'dorm-yuna-quiz-2',
    locationId: 'dorm',
    npcId: 'yuna',
    level: 1,
    type: 'multiple-choice',
    koreanPrompt: '가방이 뭐예요?',
    russianInstruction: 'Что означает слово “가방”?',
    russianExplanation: '가방 = сумка. 침대 = кровать. 책상 = стол.',
    choices: ['сумка', 'кровать', 'стол'],
    correctAnswer: 'сумка',
    acceptedAnswers: ['Сумка', 'сумка.'],
    reward: { xp: 10, coins: 6 },
    unlockWords: ['v-bag'],
    unlockSentenceId: 's-dorm-2',
    completed: false,
    dialogue: DORM_Q2,
  },
  {
    id: 'dorm-yuna-final',
    locationId: 'dorm',
    npcId: 'yuna',
    level: 1,
    type: 'dialogue',
    koreanPrompt: '이제 방 단어를 잘 알고 있네요!',
    russianInstruction: 'Юна завершает квест в общежитии.',
    russianExplanation: '선물이에요 — “это подарок”.',
    reward: { xp: 12, coins: 8, itemIds: ['study-desk', 'cozy-bed'] },
    unlockWords: ['v-room', 'v-chair'],
    unlockSentenceId: 's-dorm-2',
    completed: false,
    dialogue: DORM_DONE,
  },
  {
    id: 'store-minsu-greet',
    locationId: 'store',
    npcId: 'minsu',
    level: 1,
    type: 'dialogue',
    koreanPrompt: '어서 오세요! 저는 민수예요.',
    russianInstruction: 'Минсу знакомит тебя с магазином.',
    russianExplanation: '어서 오세요 — “добро пожаловать” в магазин.',
    reward: { xp: 6, coins: 4 },
    unlockWords: ['v-store', 'v-water', 'v-milk', 'v-triangle-rice-ball'],
    unlockSentenceId: 's-store-1',
    completed: false,
    dialogue: STORE_GREET,
  },
  {
    id: 'store-minsu-quiz-1',
    locationId: 'store',
    npcId: 'minsu',
    level: 1,
    type: 'multiple-choice',
    koreanPrompt: '물이 뭐예요?',
    russianInstruction: 'Что означает слово “물”?',
    russianExplanation: '물 = вода. 우유 = молоко. 컵 = чашка.',
    choices: ['вода', 'молоко', 'чашка'],
    correctAnswer: 'вода',
    acceptedAnswers: ['Вода', 'вода.'],
    reward: { xp: 10, coins: 7 },
    unlockWords: ['v-water'],
    unlockSentenceId: 's-store-1',
    completed: false,
    dialogue: STORE_Q1,
  },
  {
    id: 'store-minsu-quiz-2',
    locationId: 'store',
    npcId: 'minsu',
    level: 1,
    type: 'multiple-choice',
    koreanPrompt: '삼각김밥이 뭐예요?',
    russianInstruction: 'Что означает слово “삼각김밥”?',
    russianExplanation: '삼각김밥 = треугольный кимбап из магазина.',
    choices: ['сэндвич', 'треугольный кимбап', 'печенье'],
    correctAnswer: 'треугольный кимбап',
    acceptedAnswers: ['Треугольный кимбап'],
    reward: { xp: 10, coins: 7 },
    unlockWords: ['v-triangle-rice-ball'],
    unlockSentenceId: 's-store-2',
    completed: false,
    dialogue: STORE_Q2,
  },
  {
    id: 'store-minsu-final',
    locationId: 'store',
    npcId: 'minsu',
    level: 1,
    type: 'dialogue',
    koreanPrompt: '편의점 미션 완료예요!',
    russianInstruction: 'Минсу завершает магазинный квест.',
    russianExplanation: '복장을 열다 — “открыть комплект одежды”.',
    reward: { xp: 12, coins: 10, itemIds: ['ramen-sticker', 'wood-chair', 'mint-plant'], outfitIds: ['casual'] },
    unlockWords: ['v-snack', 'v-cashier'],
    unlockSentenceId: 's-store-2',
    completed: false,
    dialogue: STORE_DONE,
  },
  {
    id: 'cafe-jihoon-greet',
    locationId: 'cafe',
    npcId: 'jihoon',
    level: 2,
    type: 'dialogue',
    koreanPrompt: '안녕하세요, 저는 지훈이에요.',
    russianInstruction: 'Джихун знакомит тебя с кафе.',
    russianExplanation: '한 잔 주세요 — “одну чашку, пожалуйста”.',
    reward: { xp: 6, coins: 4 },
    unlockWords: ['v-cafe', 'v-coffee', 'v-cup', 'v-menu'],
    unlockSentenceId: 's-cafe-1',
    completed: false,
    dialogue: CAFE_GREET,
  },
  {
    id: 'cafe-jihoon-quiz-1',
    locationId: 'cafe',
    npcId: 'jihoon',
    level: 2,
    type: 'multiple-choice',
    koreanPrompt: '커피가 뭐예요?',
    russianInstruction: 'Что означает слово “커피”?',
    russianExplanation: '커피 = кофе. 컵 = чашка.',
    choices: ['чай', 'кофе', 'стол'],
    correctAnswer: 'кофе',
    acceptedAnswers: ['Кофе', 'кофе.'],
    reward: { xp: 12, coins: 8 },
    unlockWords: ['v-coffee'],
    unlockSentenceId: 's-cafe-1',
    completed: false,
    dialogue: CAFE_Q1,
  },
  {
    id: 'cafe-jihoon-quiz-2',
    locationId: 'cafe',
    npcId: 'jihoon',
    level: 2,
    type: 'multiple-choice',
    koreanPrompt: '메뉴판이 뭐예요?',
    russianInstruction: 'Что означает слово “메뉴판”?',
    russianExplanation: '메뉴판 = меню. 컵 = чашка. 칠판 = доска.',
    choices: ['меню', 'чашка', 'доска'],
    correctAnswer: 'меню',
    acceptedAnswers: ['Меню'],
    reward: { xp: 12, coins: 8 },
    unlockWords: ['v-menu'],
    unlockSentenceId: 's-cafe-2',
    completed: false,
    dialogue: CAFE_Q2,
  },
  {
    id: 'cafe-jihoon-final',
    locationId: 'cafe',
    npcId: 'jihoon',
    level: 2,
    type: 'dialogue',
    koreanPrompt: '주문이 아주 자연스러웠어요.',
    russianInstruction: 'Джихун завершает квест в кафе.',
    russianExplanation: '자연스러웠어요 — “звучало естественно”.',
    reward: { xp: 14, coins: 10, itemIds: ['cafe-mug', 'moon-lamp'] },
    unlockWords: ['v-order', 'v-table'],
    unlockSentenceId: 's-cafe-2',
    completed: false,
    dialogue: CAFE_DONE,
  },
  {
    id: 'school-sora-greet',
    locationId: 'school',
    npcId: 'sora',
    level: 2,
    type: 'dialogue',
    koreanPrompt: '안녕! 나는 소라야.',
    russianInstruction: 'Сора знакомит тебя со школой.',
    russianExplanation: '학생증 — студенческий билет.',
    reward: { xp: 6, coins: 4 },
    unlockWords: ['v-school', 'v-book', 'v-student-id', 'v-board'],
    unlockSentenceId: 's-school-1',
    completed: false,
    dialogue: SCHOOL_GREET,
  },
  {
    id: 'school-sora-quiz-1',
    locationId: 'school',
    npcId: 'sora',
    level: 2,
    type: 'multiple-choice',
    koreanPrompt: '학생증이 뭐예요?',
    russianInstruction: 'Что означает слово “학생증”?',
    russianExplanation: '학생증 = студенческий билет.',
    choices: ['тетрадь', 'студенческий билет', 'доска'],
    correctAnswer: 'студенческий билет',
    acceptedAnswers: ['Студенческий билет'],
    reward: { xp: 12, coins: 8 },
    unlockWords: ['v-student-id'],
    unlockSentenceId: 's-school-1',
    completed: false,
    dialogue: SCHOOL_Q1,
  },
  {
    id: 'school-sora-quiz-2',
    locationId: 'school',
    npcId: 'sora',
    level: 2,
    type: 'multiple-choice',
    koreanPrompt: '칠판이 뭐예요?',
    russianInstruction: 'Что означает слово “칠판”?',
    russianExplanation: '칠판 = доска. 책 = книга.',
    choices: ['книга', 'доска', 'ручка'],
    correctAnswer: 'доска',
    acceptedAnswers: ['Доска', 'доска.'],
    reward: { xp: 12, coins: 8 },
    unlockWords: ['v-board'],
    unlockSentenceId: 's-school-2',
    completed: false,
    dialogue: SCHOOL_Q2,
  },
  {
    id: 'school-sora-final',
    locationId: 'school',
    npcId: 'sora',
    level: 2,
    type: 'dialogue',
    koreanPrompt: '학교 단어도 잘 익혔네요.',
    russianInstruction: 'Сора завершает школьный квест.',
    russianExplanation: '배지 — значок или badge.',
    reward: { xp: 14, coins: 10, itemIds: ['campus-badge', 'seoul-poster'], outfitIds: ['school'] },
    unlockWords: ['v-pencil', 'v-classroom'],
    unlockSentenceId: 's-school-2',
    completed: false,
    dialogue: SCHOOL_DONE,
  },
]
