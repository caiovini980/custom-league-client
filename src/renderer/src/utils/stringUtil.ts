export const currencyFormat = (value: number, digits = 2): string => {
  if (!value) {
    value = 0
  }
  const tempDigit = digits <= 0 ? 2 : digits
  const valueFormat = value
    .toFixed(tempDigit)
    .replace('.', ',')
    .replace(/\d(?=(\d{3})+,)/g, '$&.')

  if (digits <= 0) {
    return valueFormat.split(',')[0]
  }

  return valueFormat
}

export const stringSplitter = (text: string, size = 20) => {
  const parts: string[] = []
  for (let i = 0, length = text.length; i < length; i += size) {
    parts.push(text.substring(i, i + size))
  }
  return parts
}

export const inputCurrency = (text: string, digits = 2): string => {
  text = text.trim().match(/[,.\d]+/)?.[0] ?? '0'

  let listText = text.split(',')
  listText = listText.map(getNumber)
  listText[0] = currencyFormat(parseInt(listText[0]), 0)
  if (listText[1]) listText[1] = listText[1].substring(0, digits)

  return listText.join(',')
}

export const currencyToNumber = (text: string, defaultValue = 0): number => {
  const reFormat = text.replace(/\./g, '').replace(',', '.')
  const listValue = reFormat.match(/[+-]?\d+(\.\d+)?/g)
  if (listValue && listValue.length) {
    return parseFloat(listValue[0])
  }
  return defaultValue
}

export const stringLimit = (text: string, limit = 15): string => {
  if (text.length > limit) {
    return text.slice(0, limit) + '...'
  }
  return text
}

/**
 * Função para formatar um texto.
 * @param value {string} Texto para set formatado.
 * @param pattern {string} Modelo do formato. EX: ####-###.
 * @param justNumber Se verdadeiro, é removido qualquer coisa exceto numero
 */
export const mask = (value: string, pattern: string, justNumber = false): string => {
  if (!value) {
    return ''
  }
  let i = 0
  const v = justNumber ? getNumber(value) : value.toString()

  const resPattern = pattern.replace(/#/g, () => v[i++] || '#')

  const indexHash = resPattern.indexOf('#')

  if (indexHash === -1) return resPattern

  if (v[v.length - 1] !== resPattern[resPattern.length - 1]) {
    return resPattern.substring(0, resPattern.lastIndexOf(v[v.length - 1]) + 1)
  }
  if (indexHash !== -1) return resPattern.substring(0, indexHash)
  return resPattern
}

export const removeMask = (text: string, pattern: string) => {
  const newText = text.split('').map((char, index) => {
    if (pattern[index] === '#') return char
    else if (pattern[index] !== char) return char
    return ''
  })
  return newText.join('')
}

export const textIsMatchWithPattern = (text: string, pattern: string) => {
  const patternSplit = pattern.split('')
  let regX = ''
  let hashCount = 0
  patternSplit.forEach((char, index) => {
    if (char === '#') {
      hashCount++
      if (index === patternSplit.length - 1) {
        regX += `(.{${hashCount}})`
      }
    } else {
      regX += `(.{${hashCount}})${char}`
      hashCount = 0
    }
  })

  const regTest = new RegExp(regX)

  return regTest.test(text)
}

export const getNumber = (text: string) => {
  return text.replace(/\D/g, '')
}

export const capitalize = (text: string): string => {
  return `${text.charAt(0).toUpperCase()}${text.substring(1)}`
}

export const dateToPattern = {
  dd: '##',
  MM: '##',
  yyyy: '####',
  'dd/MM': '##/##',
  'MM/yyyy': '##/####',
  'dd/MM/yyyy': '##/##/####'
}
