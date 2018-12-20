import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import SnackbarMessage from '../SnackbarMessage/SnackbarMessage';

jest.mock('ui/widgets/HeaderBar', () => () => (
    <div id="mockHeaderBar">mockHeaderBar</div>
));

jest.mock('../Dashboard/Dashboard', () => () => (
    <div id="mockDashboard">mockDashboard</div>
));

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
        props = { d2: {} };
        shallowApp = undefined;
        context = {
            store: {
                dispatch: jest.fn(),
            },
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
