import 'babel-polyfill';

global.requestAnimationFrame = callback => {
    setTimeout(callback, 0);
};
