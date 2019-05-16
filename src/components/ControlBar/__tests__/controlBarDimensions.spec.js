import { getRowsHeight, getNumRowsFromHeight } from '../controlBarDimensions';

describe('controlBarDimensions', () => {
    describe('getRowsHeight', () => {
        it('calculates the inner height', () => {
            expect(getRowsHeight(2)).toEqual(72);
        });
    });

    describe('getNumRowsFromHeight', () => {
        it('returns an integer', () => {
            const res = getNumRowsFromHeight(100);
            expect(Number.isInteger(res)).toBeTruthy();
        });
    });
});
