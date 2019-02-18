import { validateReducer, getBaseUrl } from '../modules/util';

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
});
