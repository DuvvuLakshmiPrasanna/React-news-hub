const formatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatUnixTime(unixSeconds) {
  return formatter.format(new Date(unixSeconds * 1000))
}
