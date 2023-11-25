export function formatTimestamp(timestamp) {
  const date = new Date(timestamp)

  // Format the date components
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  // Construct the formatted date string
  const formattedDate = `${month}/${day}/${year} ${hours}:${minutes}`

  return formattedDate;
}
