import React from 'react';
import { shallow } from 'enzyme';

import ControlBar from '../ControlBar';

describe('ControlBar', () => {
    const renderControlBar = (props, children = <div />) =>
        shallow(<ControlBar {...props}>{children}</ControlBar>);
    const noop = () => {};
    const requestAnimationFrame = callback => callback();

    it('should render a div', () => {
        expect(renderControlBar({}).type()).toBe('div');
    });

    it('should contain the specified children', () => {
        const children = (
            <div>
                <p>Child</p>
                <p>elements</p>
            </div>
        );
        expect(
            shallow(<ControlBar>{children}</ControlBar>).contains(children)
        ).toBe(true);
    });

    it('should render the drag handle when onChangeHeight callback is specified', () => {
        const controlBar = renderControlBar({
            onChangeHeight: jest.fn(),
        });

        expect(controlBar.children().length).toBe(2);
        expect(controlBar.childAt(1).prop('className')).toBe('draghandle');
    });

    it('should not render the drag handle when no onChangeHeight callback is specified', () => {
        expect(renderControlBar({}).children().length).toBe(1);
    });

    it('should change the background color in edit mode', () => {
        const bar = renderControlBar({ editMode: true });

        expect(bar.props().style.background).not.toBe('white');
    });

    it('should call the onChangeHeight callback when the drag handle is dragged', () => {
        // Replace the async DOM function with a sync function that immediately executes the callback
        window.requestAnimationFrame = requestAnimationFrame;

        const onChangeHeightFn = jest.fn();
        const dragFlap = renderControlBar({
            onChangeHeight: onChangeHeightFn,
        }).childAt(1);

        dragFlap.simulate('mousedown');
        window.dispatchEvent(new MouseEvent('mousemove', { clientY: 1234 }));
        window.dispatchEvent(new Event('mouseup'));

        expect(onChangeHeightFn.mock.calls.length).toBe(1);
    });

    it('should only call the onChangeHeight callback if the height actually changed', () => {
        // Replace the async DOM function with a sync function that immediately executes the callback
        window.requestAnimationFrame = requestAnimationFrame;

        const onChangeHeightFn = jest.fn();
        // Do not double check this math...
        const initialHeight = 1234;
        const randomMousePosition = 4321;

        const dragFlap = renderControlBar({
            height: initialHeight,
            onChangeHeight: onChangeHeightFn,
        }).childAt(1);

        dragFlap.simulate('mousedown');
        window.dispatchEvent(
            new MouseEvent('mousemove', { clientY: randomMousePosition })
        );
        expect(onChangeHeightFn.mock.calls.length).toBe(1);
        const newHeight = initialHeight - onChangeHeightFn.mock.calls[0][0];

        window.dispatchEvent(
            new MouseEvent('mousemove', {
                clientY: newHeight + randomMousePosition,
            })
        );
        window.dispatchEvent(new Event('mouseup'));

        expect(onChangeHeightFn.mock.calls.length).toBe(1);
    });

    it('should disable CSS transitions while dragging', () => {
        const onChangeHeightFn = jest.fn();
        const controlBar = renderControlBar({
            onChangeHeight: onChangeHeightFn,
        });
        const dragFlap = controlBar.childAt(1);

        expect(controlBar.props().style.transition).not.toBe('none');
        dragFlap.simulate('mousedown');
        expect(controlBar.props().style.transition).toBe('none');

        window.dispatchEvent(new MouseEvent('mouseup'));
        controlBar.update();
        expect(controlBar.props().style.transition).not.toBe('none');
    });

    it('should complain if an invalid height is specified', () => {
        jest.spyOn(console, 'error').mockImplementation(noop);
        const c = console; // Circumvent eslint

        renderControlBar({ height: 0 });
        expect(c.error.mock.calls.length).toBe(1);

        c.error.mockRestore();
    });

    it('should start listening for mousemove and mouseup events when the drag flap is clicked', () => {
        const spy = jest.spyOn(window, 'addEventListener');

        const onChangeHeightFn = jest.fn();
        const dragFlap = renderControlBar({
            onChangeHeight: onChangeHeightFn,
        }).childAt(1);

        dragFlap.last().simulate('mousedown');
        const eventHandlers = window.addEventListener.mock.calls.map(
            args => args[0]
        );
        expect(eventHandlers.includes('mousemove')).toBe(true);
        expect(eventHandlers.includes('mouseup')).toBe(true);

        spy.mockReset();
        spy.mockRestore();
    });
});
