import React from 'react'
import { shallow } from 'enzyme'

import ControlBar from '../ControlBar'

jest.mock('@dhis2/ui', () => {
    return {
        colors: { white: 'white', yellow050: 'yellow' },
    }
})

describe('ControlBar', () => {
    let props
    const children = (
        <div>
            <p>Child</p>
            <p>elements</p>
        </div>
    )

    const renderControlBar = () =>
        shallow(<ControlBar {...props}>{children}</ControlBar>)

    const requestAnimationFrame = callback => callback()

    beforeEach(() => {
        props = {
            height: 32,
            editMode: false,
        }
    })

    it('should render a div', () => {
        expect(renderControlBar().type()).toBe('div')
    })

    it('should contain the specified children', () => {
        expect(renderControlBar().contains(children)).toBe(true)
    })

    it('should render the drag handle when onChangeHeight callback is specified', () => {
        props.onChangeHeight = jest.fn()
        const controlBar = renderControlBar()

        expect(controlBar.children().length).toBe(2)
        expect(controlBar.childAt(1).prop('className')).toBe('draghandle')
    })

    it('should not render the drag handle when no onChangeHeight callback is specified', () => {
        expect(renderControlBar().children().length).toBe(1)
    })

    it('should change the background color in edit mode', () => {
        props.editMode = true

        expect(renderControlBar().props().style.backgroundColor).not.toBe(
            'white'
        )
    })

    it('should call the onChangeHeight callback when the drag handle is dragged', () => {
        // Replace the async DOM function with a sync function that immediately executes the callback
        window.requestAnimationFrame = requestAnimationFrame

        props.onChangeHeight = jest.fn()
        const dragFlap = renderControlBar().childAt(1)

        dragFlap.simulate('mousedown')
        window.dispatchEvent(new MouseEvent('mousemove', { clientY: 1234 }))
        window.dispatchEvent(new Event('mouseup'))

        expect(props.onChangeHeight.mock.calls.length).toBe(1)
    })

    it('should only call the onChangeHeight callback if the height actually changed', () => {
        // Replace the async DOM function with a sync function that immediately executes the callback
        window.requestAnimationFrame = requestAnimationFrame

        props.onChangeHeight = jest.fn()
        const initialHeight = 1234
        const randomMousePosition = 4321
        props.height = initialHeight

        const dragFlap = renderControlBar().childAt(1)

        dragFlap.simulate('mousedown')
        window.dispatchEvent(
            new MouseEvent('mousemove', { clientY: randomMousePosition })
        )
        expect(props.onChangeHeight.mock.calls.length).toBe(1)
        const newHeight = initialHeight - props.onChangeHeight.mock.calls[0][0]

        window.dispatchEvent(
            new MouseEvent('mousemove', {
                clientY: newHeight + randomMousePosition,
            })
        )
        window.dispatchEvent(new Event('mouseup'))

        expect(props.onChangeHeight.mock.calls.length).toBe(1)
    })

    it('should disable CSS transitions while dragging', () => {
        props.onChangeHeight = jest.fn()
        const controlBar = renderControlBar()
        const dragFlap = controlBar.childAt(1)

        expect(controlBar.props().style.transition).not.toBe('none')
        dragFlap.simulate('mousedown')
        expect(controlBar.props().style.transition).toBe('none')

        window.dispatchEvent(new MouseEvent('mouseup'))
        controlBar.update()
        expect(controlBar.props().style.transition).not.toBe('none')
    })

    it('should start listening for mousemove and mouseup events when the drag flap is clicked', () => {
        const spy = jest.spyOn(window, 'addEventListener')

        props.onChangeHeight = jest.fn()
        const dragFlap = renderControlBar().childAt(1)

        dragFlap.last().simulate('mousedown')
        const eventHandlers = window.addEventListener.mock.calls.map(
            args => args[0]
        )
        expect(eventHandlers.includes('mousemove')).toBe(true)
        expect(eventHandlers.includes('mouseup')).toBe(true)

        spy.mockReset()
        spy.mockRestore()
    })
})
