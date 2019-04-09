import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../App';
import SnackbarMessage from '../SnackbarMessage/SnackbarMessage';

jest.mock('@dhis2/ui/widgets/HeaderBar', () => () => (
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
        props = {
            d2: {},
            setCurrentUser: jest.fn(),
            fetchDashboards: jest.fn(),
            setControlBarRows: jest.fn(),
            setDimensions: jest.fn(),
        };
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

    it('fetches the dashboards', () => {
        app(context);

        expect(props.fetchDashboards).toHaveBeenCalledTimes(1);
    });
});
