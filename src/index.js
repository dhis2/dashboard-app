import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './configureStore';
import App from './App';

import './index.css';

const store = configureStore();

const indexRender = () => {
    render(
        <Provider store={ store }>
            <App />
        </Provider>,
        document.getElementById('root')
    );
};

store.subscribe(indexRender);

indexRender();