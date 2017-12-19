import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducers';

const configureStore = () => {
    const middleware = [thunk];

    // Enable Redux devtools if extension is installed instead of redux-logger
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    if (
        !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
        process.env.NODE_ENV !== 'production'
    ) {
        middleware.push(createLogger());
    }

    return createStore(
        reducer,
        composeEnhancers(applyMiddleware(...middleware))
    );
};

export default configureStore;
