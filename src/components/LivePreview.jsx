import { useMemo, useRef } from 'react'

/** Script injected into code preview iframes: static until hover, then play. Pause when cursor leaves. */
const PREVIEW_PLAY_CONTROLLER = `
window.__previewPlaying = false;
function pausePreview() {
  window.__previewPlaying = false;
  document.body.classList.remove('preview-playing');
}
function playPreview() {
  window.__previewPlaying = true;
  document.body.classList.add('preview-playing');
}
window.addEventListener('message', function(e) {
  if (e.data === 'preview-play' || (e.data && e.data.type === 'preview-play')) playPreview();
  if (e.data === 'preview-pause' || (e.data && e.data.type === 'preview-pause')) pausePreview();
});
document.addEventListener('mouseleave', pausePreview);
document.documentElement.addEventListener('mouseleave', pausePreview);
window.addEventListener('blur', pausePreview);
`

/** Pause CSS animations until hover (body.preview-playing). */
const PREVIEW_PAUSE_STYLE = `
* { animation-play-state: paused !important; }
body.preview-playing * { animation-play-state: running !important; }
`

/**
 * Renders a live preview: either pasted HTML/CSS/JS in an iframe srcdoc,
 * or an embed URL in an iframe src. Code previews are static until hover.
 */
export default function LivePreview({
  previewType,
  codeHtml = '',
  codeCss = '',
  codeJs = '',
  embedUrl = '',
  title = 'Preview',
  className,
}) {
  const iframeRef = useRef(null)
  const iframeClass = className || 'live-preview-iframe'
  const srcdoc = useMemo(() => {
    if (previewType !== 'code') return null
    const html = codeHtml?.trim() || '<div></div>'
    const safeCss = (codeCss || '').trim().replace(/<\/style>/gi, '<\\/style>')
    const css = safeCss ? `<style>${safeCss}</style>` : ''
    const fontLink = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" />'
    const previewBg = '<style>html,body{background:#f4f5f4 !important;min-height:100%;margin:0;display:flex !important;align-items:center !important;justify-content:center !important;}</style>'
    const pauseStyle = `<style>${PREVIEW_PAUSE_STYLE}</style>`
    const safeJs = (codeJs || '').trim().replace(/<\/script>/gi, '<\\/script>')
    const controllerScript = `<script>${PREVIEW_PLAY_CONTROLLER}<\/script>`
    const js = safeJs ? `<script>${safeJs}<\/script>` : ''
    return `<!DOCTYPE html><html><head><meta charset="utf-8">${fontLink}${css}${previewBg}${pauseStyle}</head><body>${html}${controllerScript}${js}</body></html>`
  }, [previewType, codeHtml, codeCss, codeJs])

  const handleMouseEnter = () => {
    try {
      iframeRef.current?.contentWindow?.postMessage('preview-play', '*')
    } catch (_) {}
  }
  const handleMouseLeave = () => {
    try {
      iframeRef.current?.contentWindow?.postMessage('preview-pause', '*')
    } catch (_) {}
  }

  if (previewType === 'embed' && embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        className={iframeClass}
        sandbox="allow-scripts allow-same-origin"
      />
    )
  }

  if (previewType === 'code' && srcdoc) {
    return (
      <div className="live-preview-wrap" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <iframe
          ref={iframeRef}
          srcDoc={srcdoc}
          title={title}
          className={iframeClass}
          sandbox="allow-scripts"
        />
      </div>
    )
  }

  return (
    <div className="live-preview-empty">
      No preview available. Add code or an embed URL in edit mode.
    </div>
  )
}
