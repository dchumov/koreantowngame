import type { DialogueLine } from '../components/DialogueModal'

// 10 new interactive NPCs for the Hongdae interiors.
// All characters are entirely fictional and original. No real people, groups,
// agencies, logos or biographies are referenced anywhere in this file.

export type NpcCategory = 'ordinary' | 'idol'
export type NpcGender = 'male' | 'female'

export interface InteriorNpc {
  id: string
  koreanName: string
  /** Localized (ru) display name, following the existing localization convention. */
  russianName: string
  category: NpcCategory
  gender: NpcGender
  /** Short role label shown in the dialogue header area. */
  roleRu: string
  /** Short personality description (used by the prompt/summary line). */
  personalityRu: string
  interiorId: string
  /** Existing sprite prefix reused from public/assets/generated. */
  spritePrefix: string
  /** Tint applied to the reused sprite so all 10 NPCs stay visually distinct. */
  tint: number
  /** Position inside the interior, in pixels, relative to the interior origin. */
  x: number
  y: number
  /** Main teaching topic, surfaced in the report and the prompt label. */
  topicRu: string
  dialogue: DialogueLine[]
}

const HINT = 'Подсказка'

export const interiorNpcs: InteriorNpc[] = [
  // ── Convenience store (2) ────────────────────────────────────────────────
  {
    id: 'cvs-nami',
    koreanName: '나미',
    russianName: 'Нами',
    category: 'ordinary',
    gender: 'female',
    roleRu: 'Продавец в магазине',
    personalityRu: 'Спокойная и приветливая, объясняет всё по одному шагу.',
    interiorId: 'convenience',
    spritePrefix: 'yuna',
    tint: 0xffd9a8,
    x: 300,
    y: 176,
    topicRu: 'Приветствие и оплата картой или наличными',
    dialogue: [
      { speaker: '나미', korean: '어서 오세요! 무엇을 찾으세요?', russian: 'Добро пожаловать! Что вы ищете?' },
      { speaker: HINT, korean: '무엇을 찾으세요?', russian: '찾다 — «искать». Вежливый вопрос покупателю.' },
      { speaker: '나미', korean: '음료수는 저기 냉장고에 있어요.', russian: 'Напитки вон там, в холодильнике.' },
      { speaker: '나미', korean: '전부 삼천 원이에요.', russian: 'Всего три тысячи вон.' },
      { speaker: HINT, korean: '얼마예요?', russian: '«Сколько стоит?» — самый нужный вопрос в магазине.' },
      { speaker: '나미', korean: '카드로 하시겠어요, 현금으로 하시겠어요?', russian: 'Картой или наличными?' },
      { speaker: '나미', korean: '봉투 필요하세요? 오십 원이에요.', russian: 'Пакет нужен? Пятьдесят вон.' },
      { speaker: '나미', korean: '감사합니다. 또 오세요!', russian: 'Спасибо. Приходите ещё!' },
    ],
  },
  {
    id: 'cvs-cheolsu',
    koreanName: '철수',
    russianName: 'Чольсу',
    category: 'ordinary',
    gender: 'male',
    roleRu: 'Покупатель',
    personalityRu: 'Разговорчивый студент, вечно голодный и любит советовать.',
    interiorId: 'convenience',
    spritePrefix: 'minsu',
    tint: 0xa8e6ff,
    x: 168,
    y: 300,
    topicRu: 'Как спросить, где лежит товар',
    dialogue: [
      { speaker: '철수', korean: '안녕하세요! 여기 자주 와요.', russian: 'Здравствуйте! Я сюда часто хожу.' },
      { speaker: '철수', korean: '삼각김밥이 어디에 있어요?', russian: 'Где лежат онигири?' },
      { speaker: HINT, korean: '어디에 있어요?', russian: '«Где находится?» — работает с любым предметом.' },
      { speaker: '철수', korean: '저는 보리차를 제일 좋아해요.', russian: 'Больше всего я люблю ячменный чай.' },
      { speaker: HINT, korean: '제일 좋아해요', russian: '제일 — «самый». 좋아하다 — «нравиться».' },
      { speaker: '철수', korean: '이거 진짜 맛있어요. 한번 드셔 보세요.', russian: 'Это очень вкусно. Попробуйте разок.' },
      { speaker: '철수', korean: '그럼 저는 먼저 갈게요!', russian: 'Ну, я пойду первым!' },
    ],
  },

  // ── Clothing store (3) ───────────────────────────────────────────────────
  {
    id: 'cloth-sujin',
    koreanName: '수진',
    russianName: 'Суджин',
    category: 'ordinary',
    gender: 'female',
    roleRu: 'Продавец одежды',
    personalityRu: 'Внимательная и терпеливая, всегда подбирает размер.',
    interiorId: 'clothing',
    spritePrefix: 'sora',
    tint: 0xffc2dd,
    x: 316,
    y: 168,
    topicRu: 'Размеры и примерка одежды',
    dialogue: [
      { speaker: '수진', korean: '어서 오세요. 천천히 구경하세요.', russian: 'Добро пожаловать. Смотрите не спеша.' },
      { speaker: '수진', korean: '어떤 사이즈를 입으세요?', russian: 'Какой размер вы носите?' },
      { speaker: HINT, korean: '사이즈', russian: '사이즈 — «размер». Можно сказать 스몰, 미디엄, 라지.' },
      { speaker: '수진', korean: '이거 한번 입어 보시겠어요?', russian: 'Хотите это примерить?' },
      { speaker: HINT, korean: '입어 보다', russian: '-어 보다 — «попробовать сделать». 입다 — «надевать».' },
      { speaker: '수진', korean: '탈의실은 저쪽에 있어요.', russian: 'Примерочная вон там.' },
      { speaker: '수진', korean: '잘 어울려요! 정말 예뻐요.', russian: 'Вам очень идёт! Правда красиво.' },
    ],
  },
  {
    id: 'cloth-hyeonu',
    koreanName: '현우',
    russianName: 'Хёну',
    category: 'ordinary',
    gender: 'male',
    roleRu: 'Покупатель',
    personalityRu: 'Нерешительный, долго выбирает и просит совета.',
    interiorId: 'clothing',
    spritePrefix: 'jihoon',
    tint: 0xc5c1ff,
    x: 168,
    y: 328,
    topicRu: 'Размер не подходит: большой или маленький',
    dialogue: [
      { speaker: '현우', korean: '이 옷 어때요? 저한테 어울려요?', russian: 'Как вам эта одежда? Мне идёт?' },
      { speaker: '현우', korean: '이건 저한테 좀 커요.', russian: 'Это мне немного велико.' },
      { speaker: HINT, korean: '커요 / 작아요', russian: '크다 — «большой», 작다 — «маленький». 좀 — «немного».' },
      { speaker: '현우', korean: '더 작은 사이즈 있어요?', russian: 'Есть размер поменьше?' },
      { speaker: '현우', korean: '다른 색깔도 보고 싶어요.', russian: 'Хочу посмотреть и другой цвет.' },
      { speaker: HINT, korean: '색깔', russian: '색깔 — «цвет»: 검은색, 흰색, 파란색.' },
      { speaker: '현우', korean: '고민되네요. 조금 더 볼게요.', russian: 'Сложно решить. Посмотрю ещё немного.' },
    ],
  },
  {
    id: 'cloth-rian',
    koreanName: '리안',
    russianName: 'Риан',
    category: 'idol',
    gender: 'male',
    roleRu: 'Айдол (вымышленный), выбирает сценический костюм',
    personalityRu: 'Дружелюбный и энергичный, подбадривает учить корейский.',
    interiorId: 'clothing',
    spritePrefix: 'jihoon',
    tint: 0x9ef0ff,
    x: 452,
    y: 300,
    topicRu: 'Сценический костюм и репетиции',
    dialogue: [
      { speaker: '리안', korean: '안녕하세요! 저는 리안이에요.', russian: 'Здравствуйте! Я Риан.' },
      { speaker: '리안', korean: '내일 공연이 있어서 무대 의상을 찾고 있어요.', russian: 'Завтра выступление, поэтому ищу сценический костюм.' },
      { speaker: HINT, korean: '공연 / 무대', russian: '공연 — «выступление», 무대 — «сцена».' },
      { speaker: '리안', korean: '오늘 아침에 네 시간 동안 춤 연습을 했어요.', russian: 'Сегодня утром я четыре часа репетировал танец.' },
      { speaker: HINT, korean: '연습하다', russian: '연습하다 — «тренироваться». 춤 — «танец», 노래 — «песня».' },
      { speaker: '리안', korean: '홍대는 사람이 많고 재미있어요.', russian: 'В Хондэ много людей и весело.' },
      { speaker: '리안', korean: '한국어 공부 계속 열심히 하세요! 화이팅!', russian: 'Продолжайте усердно учить корейский! Держитесь!' },
    ],
  },

  // ── Department store (3) ─────────────────────────────────────────────────
  {
    id: 'dept-yuna',
    koreanName: '유나',
    russianName: 'Юна (универмаг)',
    category: 'ordinary',
    gender: 'female',
    roleRu: 'Сотрудница отдела сумок',
    personalityRu: 'Вежливая и очень организованная, знает все этажи наизусть.',
    interiorId: 'department',
    spritePrefix: 'yuna',
    tint: 0xbfffd4,
    x: 328,
    y: 168,
    topicRu: 'Этажи, отделы и скидки',
    dialogue: [
      { speaker: '유나', korean: '안녕하세요, 백화점에 오신 걸 환영합니다.', russian: 'Здравствуйте, добро пожаловать в универмаг.' },
      { speaker: '유나', korean: '가방 매장은 이 층에 있어요.', russian: 'Отдел сумок на этом этаже.' },
      { speaker: HINT, korean: '층', russian: '층 — «этаж»: 일층, 이층, 삼층.' },
      { speaker: '유나', korean: '지금 이십 퍼센트 할인 중이에요.', russian: 'Сейчас идёт скидка двадцать процентов.' },
      { speaker: HINT, korean: '할인', russian: '할인 — «скидка». 할인해요? — «Есть скидка?»' },
      { speaker: '유나', korean: '화장실은 저쪽 엘리베이터 옆이에요.', russian: 'Туалет вон там, рядом с лифтом.' },
      { speaker: '유나', korean: '더 필요한 게 있으면 말씀해 주세요.', russian: 'Если нужно что-то ещё, скажите, пожалуйста.' },
    ],
  },
  {
    id: 'dept-minsu',
    koreanName: '민수',
    russianName: 'Минсу (универмаг)',
    category: 'ordinary',
    gender: 'male',
    roleRu: 'Покупатель у витрины с сумками',
    personalityRu: 'Практичный, выбирает подарок и сравнивает цены.',
    interiorId: 'department',
    spritePrefix: 'minsu',
    tint: 0xffe6a3,
    x: 168,
    y: 320,
    topicRu: 'Выбор сумки и подарка',
    dialogue: [
      { speaker: '민수', korean: '안녕하세요. 가방을 보고 있어요.', russian: 'Здравствуйте. Я смотрю сумки.' },
      { speaker: '민수', korean: '친구 생일 선물을 찾고 있어요.', russian: 'Ищу подарок на день рождения друга.' },
      { speaker: HINT, korean: '선물', russian: '선물 — «подарок». 생일 — «день рождения».' },
      { speaker: '민수', korean: '이 가방은 조금 비싸요.', russian: 'Эта сумка немного дорогая.' },
      { speaker: HINT, korean: '비싸요 / 싸요', russian: '비싸다 — «дорогой», 싸다 — «дешёвый».' },
      { speaker: '민수', korean: '저 검은색 가방을 추천해요.', russian: 'Рекомендую вон ту чёрную сумку.' },
      { speaker: '민수', korean: '좋은 하루 보내세요!', russian: 'Хорошего дня!' },
    ],
  },
  {
    id: 'dept-seyeon',
    koreanName: '세연',
    russianName: 'Сеён',
    category: 'idol',
    gender: 'female',
    roleRu: 'Айдол (вымышленная), зашла за аксессуарами',
    personalityRu: 'Спокойная и добрая, любит простые вещи и тихие кафе.',
    interiorId: 'department',
    spritePrefix: 'sora',
    tint: 0xffb3ec,
    x: 468,
    y: 312,
    topicRu: 'Хобби, любимая еда и покупки',
    dialogue: [
      { speaker: '세연', korean: '안녕하세요. 저는 세연이라고 해요.', russian: 'Здравствуйте. Меня зовут Сеён.' },
      { speaker: HINT, korean: '-(이)라고 해요', russian: 'Вежливый способ представиться: «меня называют…».' },
      { speaker: '세연', korean: '오늘은 쉬는 날이라서 쇼핑하러 왔어요.', russian: 'Сегодня выходной, поэтому пришла за покупками.' },
      { speaker: HINT, korean: '-(으)러 오다', russian: '«приходить, чтобы…»: 쇼핑하러 왔어요.' },
      { speaker: '세연', korean: '저는 떡볶이를 정말 좋아해요.', russian: 'Я очень люблю токпокки.' },
      { speaker: '세연', korean: '노래 연습은 매일 해요. 조금씩이라도요.', russian: 'Вокал репетирую каждый день. Пусть даже понемногу.' },
      { speaker: '세연', korean: '한국어도 똑같아요. 매일 조금씩 하세요.', russian: 'С корейским так же. Занимайтесь каждый день понемногу.' },
    ],
  },

  // ── Subway station (2) ───────────────────────────────────────────────────
  {
    id: 'subway-jihun',
    koreanName: '지훈',
    russianName: 'Чихун (метро)',
    category: 'ordinary',
    gender: 'male',
    roleRu: 'Пассажир метро',
    personalityRu: 'Торопливый офисный работник, но охотно подсказывает дорогу.',
    interiorId: 'subway',
    spritePrefix: 'jihoon',
    tint: 0xa9d6ff,
    x: 300,
    y: 180,
    topicRu: 'Линии метро, пересадка и количество остановок',
    dialogue: [
      { speaker: '지훈', korean: '안녕하세요. 어디에 가세요?', russian: 'Здравствуйте. Куда вы едете?' },
      { speaker: '지훈', korean: '여기가 홍대입구역이에요.', russian: 'Это станция Хондэ-Ипку.' },
      { speaker: HINT, korean: '역', russian: '역 — «станция». 홍대입구역 — станция «Хондэ-Ипку».' },
      { speaker: '지훈', korean: '이호선을 타세요.', russian: 'Садитесь на вторую линию.' },
      { speaker: HINT, korean: '-호선 / 타다', russian: '이호선 — «линия 2». 타다 — «садиться на транспорт».' },
      { speaker: '지훈', korean: '두 정거장만 가면 돼요.', russian: 'Нужно проехать всего две остановки.' },
      { speaker: HINT, korean: '정거장', russian: '정거장 — «остановка». 갈아타다 — «делать пересадку».' },
      { speaker: '지훈', korean: '조심히 가세요!', russian: 'Счастливого пути!' },
    ],
  },
  {
    id: 'subway-doha',
    koreanName: '도하',
    russianName: 'Тоха',
    category: 'idol',
    gender: 'male',
    roleRu: 'Айдол (вымышленный), ждёт поезд в вестибюле',
    personalityRu: 'Скромный и вежливый, ездит на метро как обычный пассажир.',
    interiorId: 'subway',
    spritePrefix: 'minsu',
    tint: 0xd7b3ff,
    x: 470,
    y: 300,
    topicRu: 'Транспортная карта и дорога на репетицию',
    dialogue: [
      { speaker: '도하', korean: '안녕하세요! 저는 도하예요.', russian: 'Здравствуйте! Я Тоха.' },
      { speaker: '도하', korean: '저도 지하철을 자주 타요.', russian: 'Я тоже часто езжу на метро.' },
      { speaker: HINT, korean: '지하철', russian: '지하철 — «метро». 버스 — «автобус».' },
      { speaker: '도하', korean: '교통카드가 있으면 더 편해요.', russian: 'С транспортной картой намного удобнее.' },
      { speaker: HINT, korean: '교통카드', russian: '교통카드 — «транспортная карта». 충전하다 — «пополнять».' },
      { speaker: '도하', korean: '지금 연습실에 가는 길이에요.', russian: 'Сейчас я как раз еду в репетиционный зал.' },
      { speaker: '도하', korean: '천천히, 그렇지만 매일 공부하세요. 화이팅!', russian: 'Учитесь медленно, но каждый день. Удачи!' },
    ],
  },
]

export const interiorNpcMap = new Map(interiorNpcs.map((npc) => [npc.id, npc]))

export function getNpcsForInterior(interiorId: string) {
  return interiorNpcs.filter((npc) => npc.interiorId === interiorId)
}
