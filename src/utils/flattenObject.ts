function flattenObject(obj: any, prefix = '') {
  return Object.keys(obj).reduce((acc: any, key) => {
    const pre = prefix.length ? prefix + '.' : ''
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], pre + key))
    } else {
      acc[pre + key] = obj[key]
    }
    return acc
  }, {})
}

export function objectToString(obj: any) {
  const flattened = flattenObject(obj)
  return Object.entries(flattened)
    .map(([key, value]) => `${key}=${value}`)
    .join(',')
}

export function getFormattedDateTime() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`
}

export function sanitizeForJSON(str: string) {
  return str.replace(/[\n"&\r\t\b\f{}`']/g, ' ')
}
