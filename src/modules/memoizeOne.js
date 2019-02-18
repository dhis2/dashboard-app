// Note that this ignores discrepancies in 'this', so shouldn't be used with bound functions
// This is useful instead of lodash/memoize when we only need to memoize a single value
// Inspiration: https://github.com/alexreardon/memoize-one

const memoizeOne = fn => {
    let lastArgs = undefined;
    let lastValue = undefined;

    return (...args) => {
        if (
            lastArgs &&
            args.length === lastArgs.length &&
            args.every((arg, i) => arg === lastArgs[i])
        ) {
            return lastValue;
        }
        lastArgs = args;
        lastValue = fn(...args);
        return lastValue;
    };
};

export default memoizeOne;
