import svgManMarkup from './svg_man.svg?raw'

// Reusable JSX fallback for the supplied SVG. Importing it as markup (instead
// of placing a second <img> on the page) means this last-resort avatar cannot
// create another failed network image request or a broken-image icon.
export default function SvgMan({ className = '', alt = '' }) {
  return (
    <span
      className={`svg-man-fallback ${className}`.trim()}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svgManMarkup }}
    />
  )
}
