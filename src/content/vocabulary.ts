export interface VocabEntry {
  id: string
  korean: string
  russian: string
  locationId: string
  level: number
}

export const vocabulary: VocabEntry[] = [
  { id: 'v-dorm', korean: '기숙사', russian: 'общежитие', locationId: 'dorm', level: 1 },
  { id: 'v-bed', korean: '침대', russian: 'кровать', locationId: 'dorm', level: 1 },
  { id: 'v-desk', korean: '책상', russian: 'стол', locationId: 'dorm', level: 1 },
  { id: 'v-bag', korean: '가방', russian: 'сумка', locationId: 'dorm', level: 1 },
  { id: 'v-room', korean: '방', russian: 'комната', locationId: 'dorm', level: 1 },
  { id: 'v-chair', korean: '의자', russian: 'стул', locationId: 'dorm', level: 1 },
  { id: 'v-store', korean: '편의점', russian: 'магазин', locationId: 'store', level: 1 },
  { id: 'v-water', korean: '물', russian: 'вода', locationId: 'store', level: 1 },
  { id: 'v-milk', korean: '우유', russian: 'молоко', locationId: 'store', level: 1 },
  { id: 'v-triangle-rice-ball', korean: '삼각김밥', russian: 'треугольный кимбап', locationId: 'store', level: 1 },
  { id: 'v-snack', korean: '간식', russian: 'перекус', locationId: 'store', level: 1 },
  { id: 'v-cashier', korean: '계산대', russian: 'касса', locationId: 'store', level: 1 },
  { id: 'v-cafe', korean: '카페', russian: 'кафе', locationId: 'cafe', level: 2 },
  { id: 'v-coffee', korean: '커피', russian: 'кофе', locationId: 'cafe', level: 2 },
  { id: 'v-cup', korean: '컵', russian: 'чашка', locationId: 'cafe', level: 2 },
  { id: 'v-menu', korean: '메뉴판', russian: 'меню', locationId: 'cafe', level: 2 },
  { id: 'v-order', korean: '주문', russian: 'заказ', locationId: 'cafe', level: 2 },
  { id: 'v-table', korean: '테이블', russian: 'столик', locationId: 'cafe', level: 2 },
  { id: 'v-school', korean: '학교', russian: 'школа', locationId: 'school', level: 2 },
  { id: 'v-book', korean: '책', russian: 'книга', locationId: 'school', level: 2 },
  { id: 'v-student-id', korean: '학생증', russian: 'студенческий билет', locationId: 'school', level: 2 },
  { id: 'v-board', korean: '칠판', russian: 'доска', locationId: 'school', level: 2 },
  { id: 'v-pencil', korean: '연필', russian: 'карандаш', locationId: 'school', level: 2 },
  { id: 'v-classroom', korean: '교실', russian: 'класс', locationId: 'school', level: 2 },
]
