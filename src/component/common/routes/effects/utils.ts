export function rgbaToHex(rgba: string): string {
  if (rgba === undefined || rgba === null) {
    return "#000000";
  }

  // 匹配 rgba 和 rgb 格式的颜色值
  const match = rgba.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/
  );
  if (!match) {
    return rgba.startsWith("#") ? rgba.slice(0, 7) : "#000000";
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  // 将每个颜色分量转换为两位十六进制字符串
  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  return `#${hexR}${hexG}${hexB}`;
}
