import { LocalStorageItemData } from '@render/typings/localStorage.typing'

export const setItem = <T extends keyof LocalStorageItemData>(
  item: T,
  value: LocalStorageItemData[T]
): void => {
  localStorage.setItem(item, JSON.stringify(value))
}

export const getItem = <T extends keyof LocalStorageItemData>(
  item: T
): LocalStorageItemData[T] | null => {
  const value = localStorage.getItem(item)
  try {
    return value ? JSON.parse(value) : null
  } catch (e) {
    clearAll()
    return null
  }
}

export const clearItem = <T extends keyof LocalStorageItemData>(item: T): void => {
  localStorage.removeItem(item)
}

export const clearAll = (): void => {
  localStorage.clear()
}
