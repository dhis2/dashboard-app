import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import Item from '../Item';

const mockStore = configureMockStore();

const item = {
    appKey: 'scorecard',
    id: 'rainbowdash',
};

test('renders a valid App item', () => {
    const store = {
        itemFilters: {},
    };
    const { container } = render(
        <Provider store={mockStore(store)}>
            <D2Provider>
                <Item item={item} />
            </D2Provider>
        </Provider>
    );
    expect(container).toMatchSnapshot();
});

test('renders a valid App item with filter', () => {
    const store = {
        itemFilters: {
            ou: [{ path: '/rainbow' }],
        },
    };

    const { container } = render(
        <Provider store={mockStore(store)}>
            <D2Provider>
                <Item item={item} />
            </D2Provider>
        </Provider>
    );
    expect(container).toMatchSnapshot();
});

test('renders an invalid App item', () => {
    const store = {
        itemFilters: {
            ou: [{ path: '/rainbow' }],
        },
    };

    const invalidItem = {
        appKey: 'unknownApp',
        id: 'unknown',
    };

    const { container } = render(
        <Provider store={mockStore(store)}>
            <D2Provider>
                <Item item={invalidItem} />
            </D2Provider>
        </Provider>
    );
    expect(container).toMatchSnapshot();
});

// Mock context provider
class D2Provider extends React.Component {
    getChildContext() {
        return {
            d2: {
                system: {
                    installedApps: [
                        {
                            key: 'scorecard',
                            name: 'Scorecard',
                            launchUrl: 'launchurl',
                        },
                    ],
                },
            },
        };
    }

    render() {
        return this.props.children;
    }
}

D2Provider.childContextTypes = {
    d2: PropTypes.object,
};

D2Provider.propTypes = {
    children: PropTypes.node,
};
