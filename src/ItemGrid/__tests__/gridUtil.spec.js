import { hasShape, getShape } from '../gridUtil';

describe('gridUtil', () => {
    describe('getShape', () => {
        it('should get the position and size properties of the first grid block', () => {
            expect(getShape(0)).toEqual({ x: 0, y: 0, w: 9, h: 10 });
        });

        it('should get the position and size properties of the eighth grid block', () => {
            expect(getShape(7)).toEqual({ x: 9, y: 20, w: 9, h: 10 });
        });

        it('should throw an error when the grid block number is invalid', () => {
            expect(() => {
                getShape('octopus');
            }).toThrow('Invalid grid block number');
        });
    });

    describe('hasShape', () => {
        it('should return true if grid block object has correct properties', () => {
            expect(hasShape({ x: 9, y: 20, w: 9, h: 10 })).toBeTruthy();
        });

        it('should return false if grid block object is missing properties', () => {
            expect(hasShape({ x: 9, y: 20, w: 9 })).toBeFalsy();
        });

        it('should return false if grid block object has invalid properties', () => {
            expect(hasShape({ x: 9, y: 20, w: 9, h: 'octopus' })).toBeFalsy();
        });
    });
});
