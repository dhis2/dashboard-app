import React from 'react';
import { shallow } from 'enzyme';
import { getStubContext } from '../../../config/testsContext';
import { DashboardsBar, MAX_ROW_COUNT } from '../DashboardsBar';
import ShowMoreButton from '../ShowMoreButton';
import DashboardItemChip from '../DashboardItemChip';
import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
// import ControlBar from 'd2-ui/lib/controlbar/ControlBar';

describe('DashboardsBar', () => {
    let props;
    let shallowDashboardsBar;
    const dashboardsBar = () => {
        if (!shallowDashboardsBar) {
            shallowDashboardsBar = shallow(<DashboardsBar {...props} />, {
                context: getStubContext(),
            });
        }
        return shallowDashboardsBar;
    };

    beforeEach(() => {
        props = {
            controlsStyle: undefined,
            dashboards: undefined,
            name: undefined,
            userRows: 1,
            selectedId: undefined,
            isMaxHeight: false,
            onChangeHeight: undefined,
            onEndDrag: undefined,
            onToggleMaxHeight: undefined,
            onNewClick: undefined,
            onChangeFilterName: undefined,
            onSelectDashboard: undefined,
        };
        shallowDashboardsBar = undefined;
    });

    it('should render DashboardsBar', () => {
        expect(dashboardsBar().find('ControlBar')).toHaveLength(1);
    });

    // describe('when ControlBar props are passed', () => {
    //     beforeEach(() => {
    //         props.onChangeHeight = jest.fn();
    //         props.onEndDrag = jest.fn();
    //     });

    //     it('should pass properties to the ControlBar', () => {
    //         console.log('props here', props.onChangeHeight);

    //         const controlBar = dashboardsBar().find(ControlBar);
    //         console.log('cb ', controlBar.props().onChangeHeight);
    //         expect(controlBar.props().onChangeHeight).toEqual(
    //             props.onChangeHeight
    //         );
    //     });
    // });

    describe('when userRows is MAX_ROW_COUNT', () => {
        beforeEach(() => {
            props.userRows = MAX_ROW_COUNT;
        });

        it('does not render ShowMoreButton', () => {
            expect(dashboardsBar().find(ShowMoreButton).length).toBe(0);
        });
    });

    describe('when userRows is less than MAX_ROW_COUNT', () => {
        beforeEach(() => {
            props.userRows = MAX_ROW_COUNT - 1;
        });
        it('renders ShowMoreButton', () => {
            expect(dashboardsBar().find(ShowMoreButton).length).toBe(1);
        });
    });

    describe('when dashboards are provided', () => {
        beforeEach(() => {
            props.dashboards = [
                {
                    id: 'rainbow123',
                    displayName: 'Rainbow Dash',
                    starred: false,
                },
                {
                    id: 'fluttershy123',
                    displayName: 'Fluttershy',
                    starred: true,
                },
            ];
        });

        it('renders a DashboardItemChip for each dashboard', () => {
            expect(dashboardsBar().find(DashboardItemChip).length).toBe(2);
        });
    });
});
