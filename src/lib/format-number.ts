export function compactFormat(value: number) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    compactDisplay: "short",
  });

  return formatter.format(value);
}

export function standardFormat(value: number) {
  return value.toLocaleString("vi-VN", {
    minimumFractionDigits: 0, // Changed to 0
    maximumFractionDigits: 2,
  });
}

export { standardFormat as formatNumber };