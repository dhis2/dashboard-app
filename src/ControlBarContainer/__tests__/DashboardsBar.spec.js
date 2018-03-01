import React from 'react';
import { shallow } from 'enzyme';
import { getStubContext } from '../../../config/testsContext';
import DashboardsBar from '../DashboardsBar';
// import ControlBar from 'd2-ui/lib/controlbar/ControlBar';

describe('DashboardsBar', () => {
    const renderWithProps = props =>
        shallow(<DashboardsBar {...props} />, {
            context: getStubContext(),
        });

    it('should render DashboardsBar', () => {
        const wrapper = renderWithProps({});

        const bar = wrapper.find('ControlBar');
        console.log('bar', bar);

        expect(bar).toHaveLength(1);
        // expect(div.childAt(0).type()).toBe(ControlBar);
    });
});
