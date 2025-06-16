import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { RESOURCES } from '../../../../modules/itemTypes.js'
import ListItem from '../Item.jsx'

const mockStore = configureMockStore([])

describe('ListItem component', () => {
    let store

    beforeEach(() => {
        store = mockStore({})
    })

    it('renders correctly in view mode with content items', () => {
        const item = {
            id: 'item1',
            type: RESOURCES,
            shortened: false,
            resources: [
                { id: 'resource1', name: 'Resource 1' },
                { id: 'resource2', name: 'Resource 2' },
            ],
        }

        const { asFragment } = render(
            <Provider store={store}>
                <ListItem
                    item={item}
                    dashboardMode="view"
                    isFullscreen={false}
                    isSlideshowView={false}
                />
            </Provider>
        )

        expect(asFragment()).toMatchSnapshot()
    })

    it('renders correctly in fullscreen mode', () => {
        const item = {
            id: 'item3',
            type: RESOURCES,
            shortened: false,
            resources: [
                { id: 'resource1', name: 'Resource 1' },
                { id: 'resource2', name: 'Resource 2' },
            ],
        }

        const { asFragment } = render(
            <Provider store={store}>
                <ListItem
                    item={item}
                    dashboardMode="view"
                    isFullscreen={true}
                    isSlideshowView={false}
                />
            </Provider>
        )

        expect(asFragment()).toMatchSnapshot()
    })

    it('renders correctly with no content items', () => {
        const item = {
            id: 'item4',
            type: RESOURCES,
            shortened: false,
            resources: [],
        }

        const { asFragment } = render(
            <Provider store={store}>
                <ListItem
                    item={item}
                    dashboardMode="view"
                    isFullscreen={false}
                    isSlideshowView={false}
                />
            </Provider>
        )

        expect(asFragment()).toMatchSnapshot()
    })
})
