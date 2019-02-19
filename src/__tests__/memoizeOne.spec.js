import memoizeOne from '../modules/memoizeOne';

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
