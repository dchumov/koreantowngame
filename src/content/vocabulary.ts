export type VocabTopic =
  | 'greetings'
  | 'food'
  | 'store'
  | 'clothing'
  | 'sizes-colors'
  | 'bags'
  | 'cafe'
  | 'music'
  | 'restaurant'
  | 'transport'
  | 'directions'
  | 'places'
  | 'payment'
  | 'actions'
  | 'school'
  | 'room'

export const vocabTopicLabelRu: Record<VocabTopic, string> = {
  greetings: 'Приветствия',
  food: 'Еда и напитки',
  store: 'Круглосуточный магазин',
  clothing: 'Одежда',
  'sizes-colors': 'Размеры и цвета',
  bags: 'Сумки и аксессуары',
  cafe: 'Кафе',
  music: 'Музыка',
  restaurant: 'Ресторан',
  transport: 'Метро и транспорт',
  directions: 'Направления',
  places: 'Здания и места',
  payment: 'Оплата',
  actions: 'Повседневные действия',
  school: 'Школа',
  room: 'Комната',
}

export interface VocabEntry {
  id: string
  korean: string
  russian: string
  /** Kept for backwards compatibility with existing progress helpers. */
  locationId: string
  level: number
  topic: VocabTopic
  /** Short Korean example showing the word in context. */
  example?: string
  exampleRu?: string
  /** Where the player meets this word in the game. */
  sourceRu: string
}

export const vocabulary: VocabEntry[] = [
  // ── Комната и общежитие (legacy quest content) ─────────────────────────
  { id: 'v-dorm', korean: '기숙사', russian: 'общежитие', locationId: 'dorm', level: 1, topic: 'places', example: '기숙사에 살아요.', exampleRu: 'Я живу в общежитии.', sourceRu: 'Разговор с 유나 у общежития' },
  { id: 'v-bed', korean: '침대', russian: 'кровать', locationId: 'dorm', level: 1, topic: 'room', example: '침대가 있어요.', exampleRu: 'Есть кровать.', sourceRu: 'Викторина 유나 у общежития' },
  { id: 'v-desk', korean: '책상', russian: 'стол', locationId: 'dorm', level: 1, topic: 'room', example: '책상 위에 책이 있어요.', exampleRu: 'На столе книга.', sourceRu: 'Разговор с 유나 у общежития' },
  { id: 'v-bag', korean: '가방', russian: 'сумка', locationId: 'dorm', level: 1, topic: 'bags', example: '가방이 예뻐요.', exampleRu: 'Сумка красивая.', sourceRu: 'Викторина 유나 у общежития' },
  { id: 'v-room', korean: '방', russian: 'комната', locationId: 'dorm', level: 1, topic: 'room', example: '제 방이에요.', exampleRu: 'Это моя комната.', sourceRu: 'Завершение квеста общежития' },
  { id: 'v-chair', korean: '의자', russian: 'стул', locationId: 'dorm', level: 1, topic: 'room', example: '의자에 앉으세요.', exampleRu: 'Садитесь на стул.', sourceRu: 'Завершение квеста общежития' },

  // ── Магазин у общежития (legacy) ───────────────────────────────────────
  { id: 'v-store', korean: '편의점', russian: 'круглосуточный магазин', locationId: 'store', level: 1, topic: 'places', example: '편의점에 가요.', exampleRu: 'Я иду в магазин.', sourceRu: 'Разговор с 민수 у магазина' },
  { id: 'v-water', korean: '물', russian: 'вода', locationId: 'store', level: 1, topic: 'food', example: '물 주세요.', exampleRu: 'Дайте воды.', sourceRu: 'Викторина 민수 у магазина' },
  { id: 'v-milk', korean: '우유', russian: 'молоко', locationId: 'store', level: 1, topic: 'food', example: '우유를 사요.', exampleRu: 'Я покупаю молоко.', sourceRu: 'Разговор с 민수 у магазина' },
  { id: 'v-triangle-rice-ball', korean: '삼각김밥', russian: 'треугольный кимпаб', locationId: 'store', level: 1, topic: 'food', example: '삼각김밥이 맛있어요.', exampleRu: 'Онигири вкусный.', sourceRu: 'Викторина 민수 у магазина' },
  { id: 'v-snack', korean: '간식', russian: 'перекус', locationId: 'store', level: 1, topic: 'food', example: '간식을 먹어요.', exampleRu: 'Я ем перекус.', sourceRu: 'Завершение квеста магазина' },
  { id: 'v-cashier', korean: '계산대', russian: 'касса', locationId: 'store', level: 1, topic: 'payment', example: '계산대는 저기예요.', exampleRu: 'Касса вон там.', sourceRu: 'Завершение квеста магазина' },

  // ── Кафе (legacy) ──────────────────────────────────────────────────────
  { id: 'v-cafe', korean: '카페', russian: 'кафе', locationId: 'cafe', level: 2, topic: 'cafe', example: '카페에서 만나요.', exampleRu: 'Встретимся в кафе.', sourceRu: 'Разговор с 지훈 у кафе' },
  { id: 'v-coffee', korean: '커피', russian: 'кофе', locationId: 'cafe', level: 2, topic: 'cafe', example: '커피 한 잔 주세요.', exampleRu: 'Один кофе, пожалуйста.', sourceRu: 'Викторина 지훈 у кафе' },
  { id: 'v-cup', korean: '컵', russian: 'чашка', locationId: 'cafe', level: 2, topic: 'cafe', example: '컵이 커요.', exampleRu: 'Чашка большая.', sourceRu: 'Разговор с 지훈 у кафе' },
  { id: 'v-menu', korean: '메뉴판', russian: 'меню', locationId: 'cafe', level: 2, topic: 'cafe', example: '메뉴판 좀 주세요.', exampleRu: 'Дайте, пожалуйста, меню.', sourceRu: 'Викторина 지훈 у кафе' },
  { id: 'v-order', korean: '주문', russian: 'заказ', locationId: 'cafe', level: 2, topic: 'cafe', example: '주문할게요.', exampleRu: 'Я сделаю заказ.', sourceRu: 'Завершение квеста кафе' },
  { id: 'v-table', korean: '테이블', russian: 'столик', locationId: 'cafe', level: 2, topic: 'cafe', example: '테이블이 비었어요.', exampleRu: 'Столик свободен.', sourceRu: 'Завершение квеста кафе' },

  // ── Школа (legacy) ─────────────────────────────────────────────────────
  { id: 'v-school', korean: '학교', russian: 'школа', locationId: 'school', level: 2, topic: 'school', example: '학교에 가요.', exampleRu: 'Я иду в школу.', sourceRu: 'Разговор с 소라 у школы' },
  { id: 'v-book', korean: '책', russian: 'книга', locationId: 'school', level: 2, topic: 'school', example: '책을 읽어요.', exampleRu: 'Я читаю книгу.', sourceRu: 'Разговор с 소라 у школы' },
  { id: 'v-student-id', korean: '학생증', russian: 'студенческий билет', locationId: 'school', level: 2, topic: 'school', example: '학생증을 보여 주세요.', exampleRu: 'Покажите студенческий билет.', sourceRu: 'Викторина 소라 у школы' },
  { id: 'v-board', korean: '칠판', russian: 'доска', locationId: 'school', level: 2, topic: 'school', example: '칠판을 보세요.', exampleRu: 'Посмотрите на доску.', sourceRu: 'Викторина 소라 у школы' },
  { id: 'v-pencil', korean: '연필', russian: 'карандаш', locationId: 'school', level: 2, topic: 'school', example: '연필 있어요?', exampleRu: 'Есть карандаш?', sourceRu: 'Завершение квеста школы' },
  { id: 'v-classroom', korean: '교실', russian: 'класс', locationId: 'school', level: 2, topic: 'school', example: '교실이 커요.', exampleRu: 'Класс большой.', sourceRu: 'Завершение квеста школы' },

  // ── Приветствия и вежливость ───────────────────────────────────────────
  { id: 'v-hello', korean: '안녕하세요', russian: 'здравствуйте', locationId: 'int-convenience', level: 1, topic: 'greetings', example: '안녕하세요!', exampleRu: 'Здравствуйте!', sourceRu: 'Разговор с 나미 в круглосуточном магазине' },
  { id: 'v-welcome', korean: '어서 오세요', russian: 'добро пожаловать', locationId: 'int-convenience', level: 1, topic: 'greetings', example: '어서 오세요!', exampleRu: 'Добро пожаловать!', sourceRu: 'Разговор с 나미 в круглосуточном магазине' },
  { id: 'v-thanks', korean: '감사합니다', russian: 'спасибо', locationId: 'int-convenience', level: 1, topic: 'greetings', example: '감사합니다!', exampleRu: 'Спасибо!', sourceRu: 'Разговор с 나미 в круглосуточном магазине' },
  { id: 'v-goodbye', korean: '조심히 가세요', russian: 'счастливого пути', locationId: 'int-subway', level: 2, topic: 'greetings', example: '조심히 가세요!', exampleRu: 'Счастливого пути!', sourceRu: 'Разговор с 지훈 в метро' },

  // ── Круглосуточный магазин ─────────────────────────────────────────────
  { id: 'v-drink', korean: '음료수', russian: 'напиток', locationId: 'int-convenience', level: 1, topic: 'food', example: '음료수는 냉장고에 있어요.', exampleRu: 'Напитки в холодильнике.', sourceRu: 'Разговор с 나미 в круглосуточном магазине' },
  { id: 'v-barley-tea', korean: '보리차', russian: 'ячменный чай', locationId: 'int-convenience', level: 1, topic: 'food', example: '보리차를 좋아해요.', exampleRu: 'Я люблю ячменный чай.', sourceRu: 'Разговор с 철수 в круглосуточном магазине' },
  { id: 'v-fridge', korean: '냉장고', russian: 'холодильник', locationId: 'int-convenience', level: 1, topic: 'store', example: '냉장고 안에 있어요.', exampleRu: 'Это в холодильнике.', sourceRu: 'Разговор с 나미 в круглосуточном магазине' },
  { id: 'v-plastic-bag', korean: '봉투', russian: 'пакет', locationId: 'int-convenience', level: 1, topic: 'store', example: '봉투 필요하세요?', exampleRu: 'Пакет нужен?', sourceRu: 'Разговор с 나미 в круглосуточном магазине' },
  { id: 'v-delicious', korean: '맛있어요', russian: 'вкусно', locationId: 'int-convenience', level: 1, topic: 'food', example: '이거 진짜 맛있어요.', exampleRu: 'Это очень вкусно.', sourceRu: 'Разговор с 철수 в круглосуточном магазине' },

  // ── Оплата ─────────────────────────────────────────────────────────────
  { id: 'v-card', korean: '카드', russian: 'карта', locationId: 'int-convenience', level: 1, topic: 'payment', example: '카드로 할게요.', exampleRu: 'Я оплачу картой.', sourceRu: 'Разговор с 나미 в круглосуточном магазине' },
  { id: 'v-cash', korean: '현금', russian: 'наличные', locationId: 'int-convenience', level: 1, topic: 'payment', example: '현금으로 주세요.', exampleRu: 'Наличными, пожалуйста.', sourceRu: 'Разговор с 나미 в круглосуточном магазине' },
  { id: 'v-price', korean: '얼마', russian: 'сколько (стоит)', locationId: 'int-convenience', level: 1, topic: 'payment', example: '이거 얼마예요?', exampleRu: 'Сколько это стоит?', sourceRu: 'Разговор с 나미 в круглосуточном магазине' },
  { id: 'v-won', korean: '원', russian: 'вона (валюта)', locationId: 'int-convenience', level: 1, topic: 'payment', example: '삼천 원이에요.', exampleRu: 'Три тысячи вон.', sourceRu: 'Разговор с 나미 в круглосуточном магазине' },
  { id: 'v-discount', korean: '할인', russian: 'скидка', locationId: 'int-department', level: 2, topic: 'payment', example: '지금 할인 중이에요.', exampleRu: 'Сейчас идёт скидка.', sourceRu: 'Разговор с 유나 в универмаге' },
  { id: 'v-expensive', korean: '비싸요', russian: 'дорого', locationId: 'int-department', level: 2, topic: 'payment', example: '이 가방은 비싸요.', exampleRu: 'Эта сумка дорогая.', sourceRu: 'Разговор с 민수 в универмаге' },
  { id: 'v-cheap', korean: '싸요', russian: 'дёшево', locationId: 'int-department', level: 2, topic: 'payment', example: '이건 정말 싸요.', exampleRu: 'Это очень дёшево.', sourceRu: 'Разговор с 민수 в универмаге' },

  // ── Одежда, размеры и цвета ────────────────────────────────────────────
  { id: 'v-clothes', korean: '옷', russian: 'одежда', locationId: 'int-clothing', level: 1, topic: 'clothing', example: '옷을 사요.', exampleRu: 'Я покупаю одежду.', sourceRu: 'Разговор с 수진 в магазине одежды' },
  { id: 'v-size', korean: '사이즈', russian: 'размер', locationId: 'int-clothing', level: 1, topic: 'sizes-colors', example: '어떤 사이즈를 입으세요?', exampleRu: 'Какой размер вы носите?', sourceRu: 'Разговор с 수진 в магазине одежды' },
  { id: 'v-big', korean: '커요', russian: 'большой', locationId: 'int-clothing', level: 1, topic: 'sizes-colors', example: '이건 좀 커요.', exampleRu: 'Это немного велико.', sourceRu: 'Разговор с 현우 в магазине одежды' },
  { id: 'v-small', korean: '작아요', russian: 'маленький', locationId: 'int-clothing', level: 1, topic: 'sizes-colors', example: '조금 작아요.', exampleRu: 'Немного мало.', sourceRu: 'Разговор с 현우 в магазине одежды' },
  { id: 'v-color', korean: '색깔', russian: 'цвет', locationId: 'int-clothing', level: 1, topic: 'sizes-colors', example: '다른 색깔 있어요?', exampleRu: 'Есть другой цвет?', sourceRu: 'Разговор с 현우 в магазине одежды' },
  { id: 'v-black', korean: '검은색', russian: 'чёрный', locationId: 'int-clothing', level: 1, topic: 'sizes-colors', example: '검은색 가방이요.', exampleRu: 'Чёрная сумка.', sourceRu: 'Разговор с 민수 в универмаге' },
  { id: 'v-fitting-room', korean: '탈의실', russian: 'примерочная', locationId: 'int-clothing', level: 2, topic: 'clothing', example: '탈의실은 저쪽이에요.', exampleRu: 'Примерочная вон там.', sourceRu: 'Разговор с 수진 в магазине одежды' },
  { id: 'v-try-on', korean: '입어 보다', russian: 'примерить', locationId: 'int-clothing', level: 2, topic: 'actions', example: '한번 입어 보세요.', exampleRu: 'Примерьте разок.', sourceRu: 'Разговор с 수진 в магазине одежды' },
  { id: 'v-suits-you', korean: '어울려요', russian: 'вам идёт', locationId: 'int-clothing', level: 2, topic: 'clothing', example: '잘 어울려요!', exampleRu: 'Вам очень идёт!', sourceRu: 'Разговор с 수진 в магазине одежды' },

  // ── Сумки и аксессуары ─────────────────────────────────────────────────
  { id: 'v-backpack', korean: '백팩', russian: 'рюкзак', locationId: 'int-department', level: 2, topic: 'bags', example: '미니 백팩이 좋아요.', exampleRu: 'Мини-рюкзак хорош.', sourceRu: 'Универмаг Хондэ' },
  { id: 'v-accessory', korean: '액세서리', russian: 'аксессуар', locationId: 'int-department', level: 2, topic: 'bags', example: '액세서리 매장이에요.', exampleRu: 'Это отдел аксессуаров.', sourceRu: 'Универмаг Хондэ' },
  { id: 'v-hat', korean: '모자', russian: 'шапка, кепка', locationId: 'int-department', level: 2, topic: 'bags', example: '모자를 써요.', exampleRu: 'Я надеваю кепку.', sourceRu: 'Универмаг Хондэ' },
  { id: 'v-gift', korean: '선물', russian: 'подарок', locationId: 'int-department', level: 2, topic: 'bags', example: '친구 선물이에요.', exampleRu: 'Это подарок другу.', sourceRu: 'Разговор с 민수 в универмаге' },

  // ── Здания, этажи, направления ─────────────────────────────────────────
  { id: 'v-department-store', korean: '백화점', russian: 'универмаг', locationId: 'int-department', level: 2, topic: 'places', example: '백화점에 가요.', exampleRu: 'Я иду в универмаг.', sourceRu: 'Разговор с 유나 в универмаге' },
  { id: 'v-floor', korean: '층', russian: 'этаж', locationId: 'int-department', level: 2, topic: 'directions', example: '가방 매장은 이 층이에요.', exampleRu: 'Отдел сумок на этом этаже.', sourceRu: 'Разговор с 유나 в универмаге' },
  { id: 'v-restroom', korean: '화장실', russian: 'туалет', locationId: 'int-department', level: 2, topic: 'directions', example: '화장실이 어디예요?', exampleRu: 'Где туалет?', sourceRu: 'Разговор с 유나 в универмаге' },
  { id: 'v-where', korean: '어디', russian: 'где', locationId: 'int-convenience', level: 1, topic: 'directions', example: '삼각김밥이 어디에 있어요?', exampleRu: 'Где онигири?', sourceRu: 'Разговор с 철수 в круглосуточном магазине' },
  { id: 'v-over-there', korean: '저쪽', russian: 'вон там', locationId: 'int-clothing', level: 1, topic: 'directions', example: '저쪽에 있어요.', exampleRu: 'Это вон там.', sourceRu: 'Разговор с 수진 в магазине одежды' },

  // ── Метро и транспорт ──────────────────────────────────────────────────
  { id: 'v-subway', korean: '지하철', russian: 'метро', locationId: 'int-subway', level: 2, topic: 'transport', example: '지하철을 타요.', exampleRu: 'Я еду на метро.', sourceRu: 'Разговор с 도하 в метро' },
  { id: 'v-station', korean: '역', russian: 'станция', locationId: 'int-subway', level: 2, topic: 'transport', example: '여기가 홍대입구역이에요.', exampleRu: 'Это станция Хондэ-Ипку.', sourceRu: 'Разговор с 지훈 в метро' },
  { id: 'v-line', korean: '호선', russian: 'линия метро', locationId: 'int-subway', level: 2, topic: 'transport', example: '이호선을 타세요.', exampleRu: 'Садитесь на вторую линию.', sourceRu: 'Разговор с 지훈 в метро' },
  { id: 'v-stop', korean: '정거장', russian: 'остановка', locationId: 'int-subway', level: 2, topic: 'transport', example: '두 정거장만 가면 돼요.', exampleRu: 'Всего две остановки.', sourceRu: 'Разговор с 지훈 в метро' },
  { id: 'v-transfer', korean: '갈아타다', russian: 'делать пересадку', locationId: 'int-subway', level: 2, topic: 'transport', example: '여기서 갈아타세요.', exampleRu: 'Пересаживайтесь здесь.', sourceRu: 'Разговор с 지훈 в метро' },
  { id: 'v-transit-card', korean: '교통카드', russian: 'транспортная карта', locationId: 'int-subway', level: 2, topic: 'transport', example: '교통카드가 있으면 편해요.', exampleRu: 'С транспортной картой удобнее.', sourceRu: 'Разговор с 도하 в метро' },
  { id: 'v-ride', korean: '타다', russian: 'садиться (на транспорт)', locationId: 'int-subway', level: 2, topic: 'actions', example: '버스를 타요.', exampleRu: 'Я сажусь на автобус.', sourceRu: 'Разговор с 지훈 в метро' },

  // ── Ресторан и еда ─────────────────────────────────────────────────────
  { id: 'v-ramen', korean: '라멘', russian: 'рамэн', locationId: 'int-restaurant', level: 2, topic: 'restaurant', example: '라멘을 먹어요.', exampleRu: 'Я ем рамэн.', sourceRu: 'Рамэн в переулке' },
  { id: 'v-tteokbokki', korean: '떡볶이', russian: 'токпокки', locationId: 'int-department', level: 2, topic: 'restaurant', example: '떡볶이를 좋아해요.', exampleRu: 'Я люблю токпокки.', sourceRu: 'Разговор с 세연 в универмаге' },
  { id: 'v-eat', korean: '먹다', russian: 'есть, кушать', locationId: 'int-restaurant', level: 1, topic: 'actions', example: '같이 먹어요.', exampleRu: 'Поедим вместе.', sourceRu: 'Рамэн в переулке' },
  { id: 'v-restaurant', korean: '식당', russian: 'ресторан, столовая', locationId: 'int-restaurant', level: 1, topic: 'places', example: '식당에 가요.', exampleRu: 'Я иду в ресторан.', sourceRu: 'Рамэн в переулке' },

  // ── Музыка и выступления ───────────────────────────────────────────────
  { id: 'v-music', korean: '음악', russian: 'музыка', locationId: 'int-music', level: 2, topic: 'music', example: '음악을 들어요.', exampleRu: 'Я слушаю музыку.', sourceRu: 'Музыкальный магазин' },
  { id: 'v-song', korean: '노래', russian: 'песня', locationId: 'int-music', level: 2, topic: 'music', example: '노래 연습을 해요.', exampleRu: 'Я репетирую песню.', sourceRu: 'Разговор с 세연 в универмаге' },
  { id: 'v-dance', korean: '춤', russian: 'танец', locationId: 'int-clothing', level: 2, topic: 'music', example: '춤 연습을 했어요.', exampleRu: 'Я репетировал танец.', sourceRu: 'Разговор с 리안 в магазине одежды' },
  { id: 'v-stage', korean: '무대', russian: 'сцена', locationId: 'int-clothing', level: 2, topic: 'music', example: '무대 의상을 찾아요.', exampleRu: 'Ищу сценический костюм.', sourceRu: 'Разговор с 리안 в магазине одежды' },
  { id: 'v-concert', korean: '공연', russian: 'выступление, концерт', locationId: 'int-music', level: 2, topic: 'music', example: '내일 공연이 있어요.', exampleRu: 'Завтра выступление.', sourceRu: 'Разговор с 리안 в магазине одежды' },
  { id: 'v-practice', korean: '연습하다', russian: 'тренироваться, репетировать', locationId: 'int-music', level: 2, topic: 'actions', example: '매일 연습해요.', exampleRu: 'Я репетирую каждый день.', sourceRu: 'Разговор с 리안 в магазине одежды' },

  // ── Повседневные действия и город ──────────────────────────────────────
  { id: 'v-buy', korean: '사다', russian: 'покупать', locationId: 'hongdae-street', level: 1, topic: 'actions', example: '물을 사요.', exampleRu: 'Я покупаю воду.', sourceRu: 'Покупка в любом магазине Хондэ' },
  { id: 'v-look', korean: '보다', russian: 'смотреть', locationId: 'hongdae-street', level: 1, topic: 'actions', example: '가방을 보고 있어요.', exampleRu: 'Я смотрю сумки.', sourceRu: 'Разговор с 민수 в универмаге' },
  { id: 'v-like', korean: '좋아하다', russian: 'нравиться, любить', locationId: 'hongdae-street', level: 1, topic: 'actions', example: '이 색깔을 좋아해요.', exampleRu: 'Мне нравится этот цвет.', sourceRu: 'Разговор с 철수 в круглосуточном магазине' },
  { id: 'v-shopping', korean: '쇼핑', russian: 'шопинг', locationId: 'int-department', level: 2, topic: 'actions', example: '쇼핑하러 왔어요.', exampleRu: 'Я пришла за покупками.', sourceRu: 'Разговор с 세연 в универмаге' },
  { id: 'v-hongdae', korean: '홍대', russian: 'Хондэ (район)', locationId: 'hongdae-street', level: 1, topic: 'places', example: '홍대는 재미있어요.', exampleRu: 'В Хондэ весело.', sourceRu: 'Прогулка по улицам Хондэ' },
  { id: 'v-street', korean: '거리', russian: 'улица', locationId: 'hongdae-street', level: 1, topic: 'places', example: '걷고 싶은 거리예요.', exampleRu: 'Это пешеходная улица.', sourceRu: 'Прогулка по улицам Хондэ' },
  { id: 'v-alley', korean: '골목', russian: 'переулок', locationId: 'hongdae-street', level: 2, topic: 'places', example: '골목이 좁아요.', exampleRu: 'Переулок узкий.', sourceRu: 'Прогулка по улицам Хондэ' },
  { id: 'v-many-people', korean: '사람이 많다', russian: 'много людей', locationId: 'hongdae-street', level: 2, topic: 'places', example: '홍대는 사람이 많아요.', exampleRu: 'В Хондэ много людей.', sourceRu: 'Разговор с 리안 в магазине одежды' },
]

export const vocabularyByTopic = (topic: VocabTopic) => vocabulary.filter((entry) => entry.topic === topic)
