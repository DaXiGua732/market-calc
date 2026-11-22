import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GRAMS, parseAmount, cost, gramsFor, floorYuan, floorHint, convertWeight, convertPrice } from '../calc.js';

test('单位基准', () => {
  assert.deepEqual(GRAMS, { 斤: 500, 两: 50, 钱: 5, 公斤: 1000, 克: 1 });
});

test('3.5元/斤 买 0.62公斤', () => {
  assert.equal(cost(3.5, '斤', 0.62, '公斤').toFixed(2), '4.34');
});

test('按两计价与按斤计价一致', () => {
  assert.equal(cost(3.5, '斤', 12.4, '两'), cost(3.5, '斤', 0.62, '公斤'));
  assert.equal(cost(7, '公斤', 620, '克'), cost(3.5, '斤', 0.62, '公斤'));
});

test('反算：10元 按 3.5元/斤 能买多少', () => {
  const g = gramsFor(10, 3.5, '斤');
  assert.equal((g / GRAMS['斤']).toFixed(2), '2.86');
  assert.equal((g / GRAMS['公斤']).toFixed(2), '1.43');
});

test('parseAmount 拒绝空、0、负数、非数字', () => {
  assert.equal(parseAmount(''), NaN);
  assert.equal(parseAmount('  '), NaN);
  assert.equal(parseAmount('0'), NaN);
  assert.equal(parseAmount('-2'), NaN);
  assert.equal(parseAmount('abc'), NaN);
  assert.equal(parseAmount('3.5'), 3.5);
  assert.equal(parseAmount(' 0.62 '), 0.62);
});

test('单位切换：重量与单价方向相反', () => {
  assert.equal(convertWeight(620, '克', '公斤'), 0.62);
  assert.equal(convertWeight(0.62, '公斤', '斤'), 1.24);
  assert.equal(convertPrice(3.5, '斤', '公斤'), 7);
  assert.equal(convertPrice(7, '公斤', '斤'), 3.5);
  // 切换后总价不变
  assert.equal(
    cost(convertPrice(3.5, '斤', '公斤'), '公斤', 620, '克').toFixed(2),
    cost(3.5, '斤', 0.62, '公斤').toFixed(2)
  );
});

test('抹零不因浮点误差多减一元', () => {
  assert.equal(floorYuan(6.83), 6);
  assert.equal(floorYuan(6), 6);
  assert.equal(floorYuan(5.999999999999), 6);
  assert.equal(floorYuan(0.99), 0);
});

test('抹零提示只在真能抹掉整元时出现', () => {
  assert.equal(floorHint(6.83), 6);
  assert.equal(floorHint(12.5), 12);
  assert.equal(Number.isNaN(floorHint(6)), true);
  assert.equal(Number.isNaN(floorHint(0.6)), true);
  assert.equal(Number.isNaN(floorHint(0.99)), true);
});
