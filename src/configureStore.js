import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
// import observable from 'redux-observable';
import reducer from './reducers';

const configureStore = () => {
    const middlewares = [
        thunk,
        // observable,
    ];

    if (process.env.NODE_ENV !== 'production') {
        middlewares.push(createLogger());
    }

    return createStore(
        reducer,
        applyMiddleware(...middlewares),
    );
};

export default configureStore;
