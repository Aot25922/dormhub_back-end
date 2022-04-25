const _sum = require('./sum');

describe('test sum function', () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(_sum.add(1, 2)).toBe(3);
    });
});