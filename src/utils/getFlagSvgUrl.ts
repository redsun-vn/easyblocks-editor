const SUBDIVISION_OVERRIDES: Record<string, string> = {
  "gd-GB": "gb-sct", // Scotland flag
  "cy-GB": "gb-wls", // Wales flag
};

export function getFlagUrl(locale: string, size?: number): string {
  const override = SUBDIVISION_OVERRIDES[locale];
  const code = override || locale.split("-")[1]?.toLowerCase();

  if (!code) return "";

  // SVG cho quality cao
  if (!size) return `https://flagcdn.com/${code}.svg`;

  // PNG cho size cụ thể
  return `https://flagcdn.com/w${size}/${code}.png`;
}
