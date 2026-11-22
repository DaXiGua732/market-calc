export const GRAMS = { 斤: 500, 两: 50, 钱: 5, 公斤: 1000, 克: 1 };

/** 空、非数字、0 或负数都返回 NaN，调用方据此显示占位符。 */
export function parseAmount(text) {
  const t = String(text).trim();
  if (t === '') return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

/** 总价：单价（元/斤 或 元/公斤）× 重量（任意单位）。 */
export function cost(price, priceUnit, amount, amountUnit) {
  return (price / GRAMS[priceUnit]) * amount * GRAMS[amountUnit];
}

/** 反算：这些钱能买多少克。 */
export function gramsFor(money, price, priceUnit) {
  return money / (price / GRAMS[priceUnit]);
}

/** 重量换单位：620克 → 0.62公斤。 */
export function convertWeight(value, from, to) {
  return (value * GRAMS[from]) / GRAMS[to];
}

/** 单价换单位，方向与重量相反：3.5元/斤 → 7元/公斤。 */
export function convertPrice(value, from, to) {
  return (value * GRAMS[to]) / GRAMS[from];
}

export function floorYuan(value) {
  return Math.floor(value + 1e-9);
}
