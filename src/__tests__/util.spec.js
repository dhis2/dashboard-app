import { validateReducer } from '../util';

describe('util', () => {
    describe('validateReducer', () => {
        it('should return the given value when it is defined and not null', () => {
            const result = validateReducer('42', 'default val');
            expect(result).toEqual('42');
        });

        it('should return the default value if the given value is undefined', () => {
            let undefVal;
            const result = validateReducer(undefVal, 'default val');
            expect(result).toEqual('default val');
        });

        it('should return the default value if the given value is null', () => {
            const nullVal = null;
            const result = validateReducer(nullVal, 'default val');
            expect(result).toEqual('default val');
        });
    });
});
