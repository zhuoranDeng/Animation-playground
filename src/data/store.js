/**
 * In-memory + localStorage store for animation examples.
 * ensureSeedExample() seeds Avatar Group, Cursor, Text effects, Background effects if missing.
 */
import {
  AVATAR_GROUP_SEED,
  CURSOR_SEED,
  TEXT_EFFECT_SEEDS,
  BACKGROUND_EFFECT_SEEDS,
  BUTTON_INTERACTION_SEEDS,
} from './seedExample'

const STORAGE_KEY = 'animation-library-examples'

function getStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function setStored(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

const DEDUPE_TITLES = ['Generative Noise']

function dedupeByTitle(list) {
  const seen = new Set()
  const out = list.filter((ex) => {
    const title = ex.title && ex.title.trim()
    if (!DEDUPE_TITLES.includes(title)) return true
    if (seen.has(title)) return false
    seen.add(title)
    return true
  })
  if (out.length !== list.length) setStored(out)
  return out
}

export function getExamples() {
  const raw = getStored()
  let list = raw.filter((ex) => !isRemovedTitle(ex.title))
  if (list.length !== raw.length) setStored(list)
  return dedupeByTitle(list)
}

export function getExampleById(id) {
  return getStored().find((ex) => ex.id === id) ?? null
}

export function addExample(example) {
  const list = getStored()
  const newEx = {
    ...example,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  list.push(newEx)
  setStored(list)
  return newEx
}

export function updateExample(id, payload) {
  const list = getStored()
  const i = list.findIndex((ex) => ex.id === id)
  if (i === -1) return null
  list[i] = { ...list[i], ...payload }
  setStored(list)
  return list[i]
}

const REMOVED_TITLES = ['Flow Fields', 'Matrix/Digital rain', 'Matrix/Digital tain', 'Generative Noise/Grain', 'Interactive Fluids', 'Aurora Borealis', 'Tabs']

function isRemovedTitle(title) {
  if (!title || typeof title !== 'string') return false
  const t = title.trim().toLowerCase()
  return REMOVED_TITLES.some((removed) => removed.trim().toLowerCase() === t)
}

function removeDeletedTitles(list) {
  const filtered = list.filter((ex) => !isRemovedTitle(ex.title))
  if (filtered.length !== list.length) setStored(filtered)
  return filtered
}

export function ensureSeedExample() {
  let list = getStored()
  list = removeDeletedTitles(list)
  list = dedupeByTitle(list)

  const updateOrAdd = (seed) => {
    const existing = list.find((ex) => ex.title === seed.title)
    if (existing) {
      updateExample(existing.id, {
        description: seed.description,
        sourceUrl: seed.sourceUrl,
        codeHtml: seed.codeHtml,
        codeCss: seed.codeCss,
        codeJs: seed.codeJs,
      })
    } else {
      addExample(seed)
    }
  }

  const avatar = list.find((ex) => ex.title === 'Avatar Group')
  if (avatar) {
    updateExample(avatar.id, {
      description: AVATAR_GROUP_SEED.description,
      sourceUrl: AVATAR_GROUP_SEED.sourceUrl,
      codeHtml: AVATAR_GROUP_SEED.codeHtml,
      codeCss: AVATAR_GROUP_SEED.codeCss,
      codeJs: AVATAR_GROUP_SEED.codeJs,
    })
  } else if (list.length === 0) {
    addExample(AVATAR_GROUP_SEED)
  }

  const cursor = list.find((ex) => ex.title === 'Cursor')
  if (cursor) {
    updateExample(cursor.id, {
      description: CURSOR_SEED.description,
      sourceUrl: CURSOR_SEED.sourceUrl,
      codeHtml: CURSOR_SEED.codeHtml,
      codeCss: CURSOR_SEED.codeCss,
      codeJs: CURSOR_SEED.codeJs,
    })
  } else {
    addExample(CURSOR_SEED)
  }

  TEXT_EFFECT_SEEDS.forEach((seed) => {
    const existing = getStored().find((ex) => ex.title === seed.title)
    if (existing) {
      updateExample(existing.id, { codeHtml: seed.codeHtml, codeCss: seed.codeCss, codeJs: seed.codeJs })
    } else {
      addExample(seed)
    }
  })

  BACKGROUND_EFFECT_SEEDS.forEach((seed) => {
    const existing = getStored().find((ex) => ex.title === seed.title)
    if (existing) {
      const update = {}
      if (seed.codeHtml !== undefined) update.codeHtml = seed.codeHtml
      if (seed.codeCss !== undefined) update.codeCss = seed.codeCss
      if (seed.codeJs !== undefined) update.codeJs = seed.codeJs
      if (seed.previewType !== undefined) update.previewType = seed.previewType
      if (seed.componentKey !== undefined) update.componentKey = seed.componentKey
      if (seed.componentProps !== undefined) update.componentProps = seed.componentProps
      if (Object.keys(update).length) updateExample(existing.id, update)
    } else {
      addExample(seed)
    }
  })

  BUTTON_INTERACTION_SEEDS.forEach((seed) => {
    const existing = getStored().find((ex) => ex.title === seed.title)
    if (existing) {
      const update = {}
      if (seed.codeHtml !== undefined) update.codeHtml = seed.codeHtml
      if (seed.codeCss !== undefined) update.codeCss = seed.codeCss
      if (seed.codeJs !== undefined) update.codeJs = seed.codeJs
      if (seed.previewType !== undefined) update.previewType = seed.previewType
      if (seed.componentKey !== undefined) update.componentKey = seed.componentKey
      if (seed.componentProps !== undefined) update.componentProps = seed.componentProps
      if (Object.keys(update).length) updateExample(existing.id, update)
    } else {
      addExample(seed)
    }
  })
}
