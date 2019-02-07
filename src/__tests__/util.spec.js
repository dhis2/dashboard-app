import { validateReducer, getBaseUrl, memoizeOne } from '../modules/util';

describe('util', () => {
    describe('validateReducer', () => {
        it('should return the given value when it is defined and not null', () => {
            const givenVal = '42';
            const result = validateReducer(givenVal, 'default val');
            expect(result).toEqual(givenVal);
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

    describe('getBaseUrl', () => {
        it('should return the baseUrl', () => {
            const baseUrl = 'https://base.url.com';
            const d2 = {
                Api: {
                    getApi: () => ({
                        baseUrl: `${baseUrl}/api`,
                    }),
                },
            };

            const actual = getBaseUrl(d2);
            expect(actual).toEqual(baseUrl);
        });

        it('should return the baseUrl and auth header from versioned api', () => {
            const baseUrl = 'https://base.url.com';
            const d2 = {
                Api: {
                    getApi: () => ({
                        baseUrl: `${baseUrl}/api/29`,
                    }),
                },
            };

            const actual = getBaseUrl(d2);
            expect(actual).toEqual(baseUrl);
        });
    });

    describe('memoizeOne', () => {
        it('Should return the same value when called twice with shallow-equal arguments', () => {
            const object = { a: 0, b: 0 };
            const fn = x => x.a + x.b;
            const memoizedFn = memoizeOne(fn);

            const val0 = memoizedFn(object);
            expect(val0).toBe(0);
            object.a = 1; // maintain shallow equality
            expect(fn(object)).toBe(1);
            const val1 = memoizedFn(object);
            expect(val1).toBe(0);
        });

        it('Should forget the first value when called thrice', () => {
            const object = { a: 0, b: 0 };
            const memoizedFn = memoizeOne(x => x.a + x.b);

            const val0 = memoizedFn(object);
            expect(val0).toBe(0);
            object.a = 1; // maintain shallow equality
            const val1 = memoizedFn({ a: 42, b: 84 }); // This will bump val0 out of the cache
            expect(val1).toBe(42 + 84);
            const val2 = memoizedFn(object);
            expect(val2).toBe(1);
        });
    });
});
