import { MONTHS } from "../../../shared/constants"

export type TFilter = {
  id: string
  elements: { key: number | string, value: string }[]
}[]

export const FILTERS: TFilter = [
  {
    id: 'teams',
    elements: [
      { key: 'all', value: 'Все команды' },
      { key: 'rubin', value: 'Рубин' },
      { key: 'rostov', value: 'Ростов' },
      { key: 'himki', value: 'Химки' },
    ]
  },
  {
    id: 'month',
    elements: MONTHS.reduce<TFilter[number]['elements']>((acc, month, i) => {
      acc.push({
        key: i+1,
        value: month
      })
      return acc
    }, [
      { key: 'all', value: 'Месяц' },
    ])
  },
  {
    id: 'year',
    elements: [
      { key: 'all', value: 'Год' },
      { key: 2024, value: '2024' },
      { key: 2023, value: '2023' },
      { key: 2022, value: '2022' },
    ]
  },
]