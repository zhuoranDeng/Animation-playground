/**
 * Resolve user input: either an npx command / package name, or a URL.
 * Use this when adding an example so both "npx shadcn add @animate-ui/..." and URLs work.
 * @param {string} input
 * @returns {Promise<{ embedUrl: string, title: string, sourceUrl: string, description?: string, thumbnailUrl?: string, error?: string }>}
 */
export async function resolveInput(input) {
  const trimmed = (input || '').trim()
  if (!trimmed) {
    return { embedUrl: '', title: '', sourceUrl: '', error: 'Enter a URL or package command' }
  }
  if (isNpmPackageInput(trimmed)) {
    return resolveNpmPackage(trimmed)
  }
  return resolveAnimationUrl(trimmed)
}

/**
 * Detect if input looks like an npx command or npm package name.
 * @param {string} str
 * @returns {boolean}
 */
export function isNpmPackageInput(str) {
  if (str.startsWith('npx ') || str.startsWith('npm install ') || str.startsWith('pnpm add ') || str.startsWith('yarn add ')) {
    return true
  }
  // Scoped package: @scope/name or @scope/name@version
  if (/^@[\w.-]+\/[\w.-]+(@[\w.-]*)?$/.test(str)) return true
  // Unscoped: name or name@version (avoid matching URLs)
  if (!/^https?:\/\//i.test(str) && /^[\w.-]+(@[\w.-]*)?$/.test(str) && str.includes('/')) return true
  return false
}

/**
 * Extract package name from npx/npm command or return the string if it's already a package name.
 * @param {string} input
 * @returns {string|null}
 */
function parsePackageName(input) {
  const trimmed = input.trim()
  // npx shadcn@latest add @animate-ui/components-animate-avatar-group
  const addMatch = trimmed.match(/(?:add|install)\s+([^\s]+)/i)
  if (addMatch) return addMatch[1]
  // npx create-react-app my-app -> no package to add; npx something @pkg/name -> @pkg/name
  if (trimmed.startsWith('npx ')) {
    const parts = trimmed.slice(4).trim().split(/\s+/)
    const last = parts[parts.length - 1]
    if (last && (last.startsWith('@') || last.includes('/'))) return last
  }
  if (trimmed.startsWith('@') || /^[\w.-]+\/[\w.-]+/.test(trimmed)) return trimmed
  return null
}

/**
 * Resolve an npm package: fetch metadata and return title, npm page URL, description.
 * @param {string} input - npx command or package name (e.g. @animate-ui/components-animate-avatar-group)
 * @returns {Promise<{ embedUrl: string, title: string, sourceUrl: string, description?: string, error?: string }>}
 */
export async function resolveNpmPackage(input) {
  const packageName = parsePackageName(input)
  if (!packageName) {
    return { embedUrl: '', title: '', sourceUrl: '', error: 'Could not parse package name from command' }
  }
  const registryUrl = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(registryUrl)}`
  try {
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) {
      return { embedUrl: '', title: '', sourceUrl: '', error: `Package not found: ${packageName}` }
    }
    const text = await res.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      return { embedUrl: '', title: '', sourceUrl: '', error: 'Could not load package info (proxy or network error)' }
    }
    const name = data.name || packageName
    const description = typeof data.description === 'string' ? data.description.trim() : undefined
    const npmPageUrl = `https://www.npmjs.com/package/${encodeURIComponent(packageName)}`
    return {
      embedUrl: '',
      title: name,
      sourceUrl: npmPageUrl,
      description: description || `Install: npx shadcn@latest add ${packageName}`,
    }
  } catch (e) {
    return {
      embedUrl: '',
      title: '',
      sourceUrl: '',
      error: e?.message || 'Failed to fetch package info',
    }
  }
}

/**
 * Resolve a source URL to title, optional embed URL (CodePen/JSFiddle), and optional thumbnail.
 * Accepts any website URL; for CodePen/JSFiddle we also get an embed URL.
 * @param {string} inputUrl
 * @returns {Promise<{ embedUrl: string, title: string, sourceUrl: string, thumbnailUrl?: string, error?: string }>}
 */
export async function resolveAnimationUrl(inputUrl) {
  const url = (inputUrl || '').trim()
  if (!url) {
    return { embedUrl: '', title: '', sourceUrl: '', error: 'Enter a URL' }
  }

  let sourceUrl = url
  if (!/^https?:\/\//i.test(sourceUrl)) {
    sourceUrl = 'https://' + sourceUrl
  }

  try {
    new URL(sourceUrl)
  } catch {
    return { embedUrl: '', title: '', sourceUrl, error: 'Invalid URL' }
  }

  // CodePen: /username/pen/xyz or /username/pen/xyz/
  const codepenMatch = sourceUrl.match(
    /codepen\.io\/([^/]+)\/pen\/([^/?#]+)/
  )
  if (codepenMatch) {
    const [, user, penId] = codepenMatch
    const embedUrl = `https://codepen.io/${user}/embed/${penId}?default-tab=result`
    const title = await fetchCodePenTitle(sourceUrl)
    return {
      embedUrl,
      title: title || `CodePen - ${user}/${penId}`,
      sourceUrl,
    }
  }

  // CodePen embed URL as input - use as-is, try to get title from pen URL
  const codepenEmbedMatch = sourceUrl.match(
    /codepen\.io\/([^/]+)\/embed\/([^/?#]+)/
  )
  if (codepenEmbedMatch) {
    const [, user, penId] = codepenEmbedMatch
    const penUrl = `https://codepen.io/${user}/pen/${penId}`
    const title = await fetchCodePenTitle(penUrl)
    return {
      embedUrl: sourceUrl,
      title: title || `CodePen - ${user}/${penId}`,
      sourceUrl,
    }
  }

  // JSFiddle: https://jsfiddle.net/username/abc123/ or /username/abc123
  const jsfiddleMatch = sourceUrl.match(
    /jsfiddle\.net\/([^/]+)\/([^/?#]+)\/?/
  )
  if (jsfiddleMatch) {
    const [, user, fiddleId] = jsfiddleMatch
    const embedUrl = `https://jsfiddle.net/${user}/${fiddleId}/embedded/result/`
    return {
      embedUrl,
      title: `JSFiddle - ${user}/${fiddleId}`,
      sourceUrl,
    }
  }

  // Generic embed-looking URL
  if (
    sourceUrl.includes('/embed') ||
    sourceUrl.includes('/embedded/') ||
    sourceUrl.endsWith('/embed')
  ) {
    const titleFromUrl = new URL(sourceUrl).pathname.split('/').filter(Boolean).pop() || 'Animation'
    return {
      embedUrl: sourceUrl,
      title: titleFromUrl,
      sourceUrl,
    }
  }

  // Any other website URL: fetch title (and thumbnail) via proxy, no embed
  const metadata = await fetchPageMetadata(sourceUrl)
  const title = metadata?.title || titleFromUrl(sourceUrl)
  return {
    embedUrl: '',
    title,
    sourceUrl,
    thumbnailUrl: metadata?.thumbnailUrl,
  }
}

/**
 * Derive a readable title from URL (hostname + path).
 * @param {string} url
 * @returns {string}
 */
function titleFromUrl(url) {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    const path = u.pathname === '/' ? '' : u.pathname
    const combined = path ? `${host}${path}` : host
    return combined.length > 60 ? combined.slice(0, 57) + '...' : combined
  } catch {
    return 'Animation'
  }
}

/**
 * Fetch page HTML via CORS proxy and parse <title> and og:image.
 * @param {string} pageUrl
 * @returns {Promise<{ title?: string, thumbnailUrl?: string } | null>}
 */
async function fetchPageMetadata(pageUrl) {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(pageUrl)}`
  try {
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const html = await res.text()
    const title = parseTitle(html)
    const thumbnailUrl = parseOgImage(html)
    return { title: title || null, thumbnailUrl: thumbnailUrl || null }
  } catch {
    return null
  }
}

function parseTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (!match) return null
  return match[1].replace(/<[^>]+>/g, '').trim() || null
}

function parseOgImage(html) {
  const match = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
  ) || html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
  )
  if (!match) return null
  const url = match[1].trim()
  return url.startsWith('http') ? url : null
}

/**
 * Fetch CodePen pen title via oEmbed (no API key). Falls back to null if CORS blocks.
 * @param {string} penUrl
 * @returns {Promise<string | null>}
 */
async function fetchCodePenTitle(penUrl) {
  const oembedUrl = `https://codepen.io/api/oembed?format=json&url=${encodeURIComponent(penUrl)}`
  try {
    const res = await fetch(oembedUrl)
    if (!res.ok) return null
    const data = await res.json()
    return data?.title?.trim() || null
  } catch {
    return null
  }
}
