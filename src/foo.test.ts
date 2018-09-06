import { sum } from './foo';

test('basic', () => {
  expect(sum()).toBe(0);
});

test('basic again', () => {
  expect(sum(1, 2)).toBe(3);
});

test('basic async', async () => {
  expect(sum()).toBe(0);
});

test(
  'basic async again',
  async () => {
    expect(sum(1, 2)).toBe(3);
  },
  1000 /* optional timeout */
);
