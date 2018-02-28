import React from 'react';

import 'jest-enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
import { getStubContext } from '../../../config/testsContext';
import DashboardsBar from '../DashboardsBar';
// import ControlBar from 'd2-ui/lib/controlbar/ControlBar';

Enzyme.configure({ adapter: new Adapter() });

describe('DashboardsBar', () => {
    const renderWithProps = props =>
        shallow(<DashboardsBar {...props} />, {
            context: getStubContext(),
        });

    it('should render DashboardsBar', () => {
        const wrapper = renderWithProps({});

        const bar = wrapper.find('ControlBar');
        expect(bar).toHaveLength(1);
        // expect(div.childAt(0).type()).toBe(ControlBar);
    });
});
