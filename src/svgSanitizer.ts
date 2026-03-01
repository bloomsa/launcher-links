import DOMPurify from 'dompurify';

export function sanitizeUserSvg(svgStr: string): string | null {
  if (!svgStr.trim()) {
    return null;
  }

  const purified = DOMPurify.sanitize(svgStr, {
    USE_PROFILES: {
      svg: true
    }
  });

  if (!purified || typeof purified !== 'string' || !purified.trim()) {
    return null;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(purified, 'image/svg+xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    return null;
  }

  const root = doc.documentElement;
  if (!root || root.tagName.toLowerCase() !== 'svg') {
    return null;
  }

  // LabIcon expects a real SVG element and crashes otherwise.
  // ensure namespace is always present.
  if (!root.getAttribute('xmlns')) {
    root.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }

  return new XMLSerializer().serializeToString(root);
}
