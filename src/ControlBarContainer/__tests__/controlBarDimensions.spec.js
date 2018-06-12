import { getInnerHeight, getOuterHeight } from '../controlBarDimensions';

describe('controlBarDimensions', () => {
    describe('getInnerHeight', () => {
        it('calculates the inner height', () => {
            expect(getInnerHeight(2)).toEqual(72);
        });
    });

    describe('getOuterHeight', () => {
        it('is greater when bar not expandable', () => {
            expect(getOuterHeight(2, false)).toBeGreaterThan(
                getOuterHeight(2, true)
            );
        });
    });
});
