import { sanitizeUserSvg } from '../svgSanitizer';

describe('sanitizeUserSvg', () => {
  it('removes script tags and event handlers', () => {
    const unsafeSvg =
      '<svg viewBox="0 0 10 10"><script>alert(1)</script><rect width="10" height="10" onclick="alert(2)" /></svg>';
    const sanitized = sanitizeUserSvg(unsafeSvg);

    expect(sanitized).not.toBeNull();
    expect(sanitized).not.toContain('<script');
    expect(sanitized).not.toContain('onclick=');
    expect(sanitized).toContain('<rect');
  });

  it('removes javascript href payloads', () => {
    const unsafeSvg =
      '<svg viewBox="0 0 10 10"><use href="javascript:alert(1)" x="0" y="0" /></svg>';
    const sanitized = sanitizeUserSvg(unsafeSvg);

    expect(sanitized).not.toBeNull();
    expect(sanitized).not.toContain('javascript:');
    expect(sanitized).not.toContain('href=');
  });

  it('keeps valid SVG content', () => {
    const safeSvg = '<svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg>';
    const sanitized = sanitizeUserSvg(safeSvg);

    expect(sanitized).not.toBeNull();
    expect(sanitized).toContain('<svg');
    expect(sanitized).toContain('<rect');
    expect(sanitized).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it('rejects non-svg markup', () => {
    const nonSvg = '<div>not an svg</div>';
    expect(sanitizeUserSvg(nonSvg)).toBeNull();
  });
});
