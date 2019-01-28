import React from 'react';
import { shallow } from 'enzyme';
import ControlBar from '@dhis2/d2-ui-core/control-bar/ControlBar';

import { getStubContext } from '../../../../config/testsContext';
import { MIN_ROW_COUNT } from '../controlBarDimensions';
import { DashboardsBar, MAX_ROW_COUNT } from '../DashboardsBar';
import ShowMoreButton from '../ShowMoreButton';
import DashboardItemChip from '../DashboardItemChip';
import * as api from '../../../api/controlBar';

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
            userRows: MIN_ROW_COUNT,
            selectedId: undefined,
            isMaxHeight: false,
            onChangeHeight: undefined,
            onEndDrag: undefined,
            onToggleMaxHeight: undefined,
            onChangeFilterName: undefined,
        };
        shallowDashboardsBar = undefined;
    });

    it('renders a DashboardsBar', () => {
        expect(dashboardsBar().find('ControlBar')).toHaveLength(1);
    });

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

    describe('when ShowMore button is toggled', () => {
        it('sets the correct value for isMaxHeight property', () => {
            const bar = dashboardsBar();
            const btn = bar.find(ShowMoreButton);
            btn.simulate('click');
            const rerenderedBtn = bar.find(ShowMoreButton);

            expect(btn.props().isMaxHeight).not.toEqual(
                rerenderedBtn.props().isMaxHeight
            );
        });
    });

    describe('when drag ends', () => {
        it('calls the api to post user rows', () => {
            const spy = jest.spyOn(api, 'apiPostControlBarRows');

            const controlBar = dashboardsBar().find(ControlBar);
            controlBar.simulate('endDrag');

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('when controlbar height is changed', () => {
        beforeEach(() => {
            props.onChangeHeight = jest.fn();
            props.userRows = MAX_ROW_COUNT - 1;
        });

        it('triggers onChangeHeight with correct value', () => {
            const controlBar = dashboardsBar().find(ControlBar);
            const impossiblySmallHeightPxls = 0;
            controlBar.simulate('changeHeight', impossiblySmallHeightPxls);
            expect(props.onChangeHeight).toHaveBeenCalled();
        });
    });

    describe('when controlbar height is changed to same value', () => {
        beforeEach(() => {
            props.onChangeHeight = jest.fn();
            props.userRows = MIN_ROW_COUNT;
        });

        it('does not trigger onChangeHeight', () => {
            const controlBar = dashboardsBar().find(ControlBar);
            const impossiblySmallHeightPxls = 0;
            controlBar.simulate('changeHeight', impossiblySmallHeightPxls);
            expect(props.onChangeHeight).not.toHaveBeenCalled();
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

        describe('when selected ID is provided', () => {
            beforeEach(() => {
                props.selectedId = 'fluttershy123';
            });

            it('sets the selected property to true', () => {
                expect(
                    dashboardsBar()
                        .find(DashboardItemChip)
                        .at(1)
                        .props().selected
                ).toBe(true);
            });
        });
    });
});
