import { validateReducer, getDhis2Credentials } from '../util';

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

    describe('getDhis2Credentials', () => {
        it('should return the baseUrl and auth header', () => {
            const baseUrl = 'https://base.url.com';
            const authVal = 'the authorization str';
            const d2 = {
                Api: {
                    getApi: () => ({
                        baseUrl: `${baseUrl}/api`,
                        defaultHeaders: {
                            Authorization: authVal,
                        },
                    }),
                },
            };

            const actual = getDhis2Credentials(d2);
            expect(actual.baseUrl).toEqual(baseUrl);
            expect(actual.auth).toEqual(authVal);
        });

        it('should return the baseUrl and auth header from versioned api', () => {
            const baseUrl = 'https://base.url.com';
            const authVal = 'the authorization str';
            const d2 = {
                Api: {
                    getApi: () => ({
                        baseUrl: `${baseUrl}/api/29`,
                        defaultHeaders: {
                            Authorization: authVal,
                        },
                    }),
                },
            };

            const actual = getDhis2Credentials(d2);
            expect(actual.baseUrl).toEqual(baseUrl);
            expect(actual.auth).toEqual(authVal);
        });
    });
});
