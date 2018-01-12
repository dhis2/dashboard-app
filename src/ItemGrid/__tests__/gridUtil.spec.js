import { hasShape, getShape } from '../gridUtil';

describe('gridUtil', () => {
    describe('getShape', () => {
        it('should return an object with 4 properties (x, y, w, h)', () => {
            const shape = getShape(0);
            expect(shape).toHaveProperty('x');
            expect(shape).toHaveProperty('y');
            expect(shape).toHaveProperty('w');
            expect(shape).toHaveProperty('h');
            expect(Object.keys(shape)).toHaveLength(4);
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
