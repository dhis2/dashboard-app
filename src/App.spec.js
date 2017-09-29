import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';

global.reportTablePlugin = {};
global.chartPlugin = {};

it.skip('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <MuiThemeProvider>
            <App />
        </MuiThemeProvider>,
        div
    );
});
