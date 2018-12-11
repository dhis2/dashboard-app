import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import SnackbarMessage from '../components/SnackbarMessage/SnackbarMessage';

describe('App', () => {
    let props;
    let shallowApp;
    let context;
    const app = context => {
        if (!shallowApp) {
            shallowApp = shallow(<App {...props} />, {
                context,
            });
        }
        return shallowApp;
    };

    beforeEach(() => {
        props = {};
        shallowApp = undefined;
        context = {
            store: {
                dispatch: jest.fn(),
            },
            d2: {},
        };
    });

    it('renders a SnackbarMessage', () => {
        expect(app(context).find(SnackbarMessage)).toHaveLength(1);
    });

    it('dispatches some actions', () => {
        app(context);

        expect(context.store.dispatch).toHaveBeenCalledTimes(3);
    });
});
