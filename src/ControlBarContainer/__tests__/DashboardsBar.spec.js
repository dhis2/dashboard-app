import React from 'react';
import { shallow } from 'enzyme';
import { getStubContext } from '../../../config/testsContext';
import { DashboardsBar } from '../DashboardsBar';
// import ControlBar from 'd2-ui/lib/controlbar/ControlBar';

describe('DashboardsBar', () => {
    const renderWithProps = props =>
        shallow(<DashboardsBar {...props} />, {
            context: getStubContext(),
        });

    it('should render DashboardsBar', () => {
        const props = {
            controlsStyle: {},
            dashboards: [],
            name: 'Rainbow Dash',
            rows: 1,
            selectedId: '123abc',
            isMaxHeight: false,
            onChangeHeight: () => {},
            onEndDrag: () => {},
            onToggleMaxHeight: () => {},
            onNewClick: () => {},
            onChangeFilterName: () => {},
            onSelectDashboard: () => {},
        };
        const wrapper = renderWithProps(props);

        const bar = wrapper.find('ControlBar');

        expect(bar).toHaveLength(1);
        // expect(div.childAt(0).type()).toBe(ControlBar);
    });
});
