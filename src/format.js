export function isRealItem(item) {
  if (!item || typeof item !== 'object') return false
  const brand = String(item.brand || '').trim()
  const name = String(item.name || '').trim()
  const number = String(item.number || '').trim()
  return Boolean(brand || name || number)
}

function errorMessage(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join('. ')
  }
  return String(value || '').trim()
}

export function normalizeGoods(response) {
  if (response == null || response === '') {
    return { items: [], error: 'Сервис вернул пустой ответ.' }
  }
  if (typeof response !== 'object') {
    return { items: [], error: 'Сервис вернул некорректный ответ.' }
  }
  if (response.error) {
    return { items: [], error: errorMessage(response.error) || 'Сервис вернул ошибку.' }
  }
  if (!Array.isArray(response.goods)) {
    return { items: [], error: 'Сервис вернул пустой ответ.' }
  }
  return { items: response.goods.filter(isRealItem), error: '' }
}

function positionPrice(item) {
  const warehouses = Array.isArray(item.warehouses) ? item.warehouses : []
  const inStock = warehouses.filter((warehouse) => Number(warehouse.stock) > 0)
  const source = inStock.length ? inStock : warehouses
  const prices = source
    .map((warehouse) => Number(warehouse.price))
    .filter((price) => Number.isFinite(price) && price > 0)
  if (prices.length) return Math.min(...prices)
  const fallback = Number(item.price)
  return Number.isFinite(fallback) ? fallback : null
}

function positionStock(item) {
  const count = Number(item.count)
  if (Number.isFinite(count)) return count
  const warehouses = Array.isArray(item.warehouses) ? item.warehouses : []
  return warehouses.reduce((sum, warehouse) => sum + (Number(warehouse.stock) || 0), 0)
}

function toRow(item, key) {
  return {
    id: key,
    name: String(item.name || '').trim() || '—',
    brand: String(item.brand || '').trim() || '—',
    number: String(item.number || '').trim(),
    price: positionPrice(item),
    stock: positionStock(item),
  }
}

export function normalizeOffers(response) {
  const result = normalizeGoods(response)
  if (result.error) return { rows: [], error: result.error }
  const rows = result.items.flatMap((item, itemIndex) => {
    const analogues = Array.isArray(item.analogues) ? item.analogues.filter(isRealItem) : []
    return [item, ...analogues].map((position, positionIndex) =>
      toRow(position, `${item.goodsID || itemIndex}-${position.goodsID || positionIndex}-${positionIndex}`),
    )
  })
  return { rows, error: '' }
}

export function manufacturersFromGoods(items) {
  const seen = new Set()
  const manufacturers = []
  items.forEach((item) => {
    const brand = String(item.brand || '').trim()
    if (!brand || seen.has(brand)) return
    seen.add(brand)
    manufacturers.push({
      brand,
      name: String(item.name || '').trim(),
      number: String(item.number || '').trim(),
    })
  })
  return manufacturers.sort((left, right) => left.brand.localeCompare(right.brand, 'ru'))
}

export function formatPrice(value) {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatStock(value) {
  const stock = Number(value)
  if (!Number.isFinite(stock)) return '—'
  return new Intl.NumberFormat('ru-RU').format(stock)
}

export function errorText(error) {
  if (!error) return 'Не удалось выполнить запрос.'
  if (error.status === 'FETCH_ERROR') {
    return 'Нет соединения с сервисом. Проверьте сеть и повторите запрос.'
  }
  if (error.status === 'TIMEOUT_ERROR') {
    return 'Сервис не ответил вовремя. Повторите запрос.'
  }
  if (error.status === 'PARSING_ERROR') {
    return 'Сервис вернул некорректный ответ.'
  }
  if (error.data && typeof error.data === 'object' && error.data.error) {
    return errorMessage(error.data.error) || 'Сервис вернул ошибку.'
  }
  if (typeof error.status === 'number') {
    return `Сервис ответил с ошибкой ${error.status}.`
  }
  return 'Не удалось выполнить запрос.'
}
