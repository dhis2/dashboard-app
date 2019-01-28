import { getRowsHeight, getControlBarHeight } from '../controlBarDimensions';

describe('controlBarDimensions', () => {
    describe('getRowsHeight', () => {
        it('calculates the inner height', () => {
            expect(getRowsHeight(2)).toEqual(92);
        });
    });

    describe('getControlBarHeight', () => {
        it('is greater when bar not expandable', () => {
            expect(getControlBarHeight(2, false)).toBeGreaterThan(
                getControlBarHeight(2, true)
            );
        });
    });
});
