import {
    getRowsHeight,
    getControlBarHeight,
    getNumRowsFromHeight,
} from '../controlBarDimensions';

describe('controlBarDimensions', () => {
    describe('getRowsHeight', () => {
        it('calculates the inner height', () => {
            expect(getRowsHeight(2)).toEqual(72);
        });
    });

    describe('getControlBarHeight', () => {
        it('is greater when bar not expandable', () => {
            expect(getControlBarHeight(2, false)).toBeGreaterThan(
                getControlBarHeight(2, true)
            );
        });
    });

    describe('getNumRowsFromHeight', () => {
        it('returns an integer', () => {
            const res = getNumRowsFromHeight(100);
            expect(Number.isInteger(res)).toBeTruthy();
        });
    });
});
