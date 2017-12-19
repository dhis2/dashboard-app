import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducers';

const configureStore = () => {
    const middleware = [thunk];

    // If the Redux devtools extension is installed, enable that in favor of logging every state change
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
