import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import TitleBar from '../TitleBar.jsx'

const mockStore = configureMockStore()

jest.mock(
    '../ItemSelector/ItemSelector.jsx',
    () =>
        function MockItemSelector() {
            return <div className="item-selector" />
        }
)

/* eslint-disable react/prop-types, no-unused-vars*/
jest.mock('@dhis2/ui', () => {
    const originalModule = jest.requireActual('@dhis2/ui')
    // InputField, TextAreaField, Radio,
    return {
        __esModule: true,
        ...originalModule,
        InputField: function Mock({ dense, dataTest, ...props }) {
            return <div className="ui-InputField" {...props} />
        },
        Button: function Mock({ children }) {
            return <div className="ui-Button">{children}</div>
        },
        TextAreaField: function Mock({ dense, dataTest, ...props }) {
            return <div className="ui-TextAreaField" {...props} />
        },
        Radio: function Mock({ children, dense, ...props }) {
            return (
                <div className="ui-Radio" {...props}>
                    {children}
                </div>
            )
        },
    }
})
/* eslint-enable react/prop-types, no-unused-vars */

describe('TitleBar', () => {
    it('renders correctly with name and description', () => {
        const store = {
            editDashboard: {
                name: 'Rainbow Dash',
                description: 'A very colorful pony',
            },
        }
        const { container } = render(
            <Provider store={mockStore(store)}>
                <TitleBar />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })

    it('renders correctly when no name or description', () => {
        const store = {
            editDashboard: {
                name: '',
                description: '',
            },
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TitleBar />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
})
