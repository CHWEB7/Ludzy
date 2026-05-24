/** Parse widget id from LightWidget iframe src or bare id string */
export function parseLightWidgetId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const fromUrl = trimmed.match(/widgets\/([a-f0-9]+)\.html/i);
  if (fromUrl?.[1]) return fromUrl[1];

  if (/^[a-f0-9]+$/i.test(trimmed)) return trimmed;

  return null;
}

export function resolveLightWidgetIframeSrc(input: string): string | null {
  const id = parseLightWidgetId(input);
  if (!id) return null;
  return `https://cdn.lightwidget.com/widgets/${id}.html`;
}

export function lightWidgetScriptSrc(id: string) {
  return `https://cdn.lightwidget.com/widgets/${id}.js`;
}
