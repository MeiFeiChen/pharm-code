import { table, getBorderCharacters } from 'table'

export function formatToTable(data) {
  return table(data, { border: getBorderCharacters('ramac') });
}

export function processTableData(input) {
  const parsedData = JSON.parse(input)
  return Object.entries(parsedData).reduce((acc, [key, value]) => {
    acc[key] = formatToTable(value)
    return acc
  }, {})
}
