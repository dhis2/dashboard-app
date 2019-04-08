import React from 'react';
import { shallow } from 'enzyme';

import { getStubContext } from '../../../setupTests';
import { MIN_ROW_COUNT } from '../controlBarDimensions';
import { DashboardsBar, MAX_ROW_COUNT } from '../DashboardsBar';
import ShowMoreButton from '../ShowMoreButton';
import DashboardItemChip from '../DashboardItemChip';
import * as api from '../../../api/controlBar';

jest.mock('@dhis2/d2-ui-core/control-bar/ControlBar', () => props => {
    return (
        <div
            className="mock-dhis2-controlbar"
            onChangeHeight={val => props.onChangeHeight(val)}
            onEndDrag={props.onEndDrag}
        >
            {props.children}
        </div>
    );
});

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

    it('renders a DashboardsBar with no items', () => {
        expect(dashboardsBar()).toMatchSnapshot();
    });

    it('does not render ShowMoreButton when userRows is MAX_ROW_COUNT', () => {
        props.userRows = MAX_ROW_COUNT;
        expect(dashboardsBar()).toMatchSnapshot();
    });

    it('renders ShowMoreButton when userRows is less than MAX_ROW_COUNT', () => {
        props.userRows = MAX_ROW_COUNT - 1;
        expect(dashboardsBar()).toMatchSnapshot();
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

    it('calls the api to post user rows when drag ends', () => {
        const spy = jest.spyOn(api, 'apiPostControlBarRows');

        const controlBar = dashboardsBar();
        controlBar.simulate('endDrag');

        expect(spy).toHaveBeenCalled();
    });

    it('triggers onChangeHeight when controlbar height is changed', () => {
        props.onChangeHeight = jest.fn();
        props.userRows = MAX_ROW_COUNT - 1;
        const dbr = dashboardsBar();

        const newPixelHeight = 200; // should be equivalent to 4 rows
        dbr.simulate('changeHeight', newPixelHeight);
        expect(props.onChangeHeight).toHaveBeenCalled();
        expect(props.onChangeHeight).toHaveBeenCalledWith(4);
    });

    it('does not trigger onChangeHeight when controlbar height is changed to similar value', () => {
        props.onChangeHeight = jest.fn();
        props.userRows = MIN_ROW_COUNT;

        const dbr = dashboardsBar();

        const newPixelHeight = 50; //should result in 1 row, same as current
        dbr.simulate('changeHeight', newPixelHeight);
        expect(props.onChangeHeight).not.toHaveBeenCalled();
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

        it('renders DashboardItemChips for each item on dashboard', () => {
            expect(dashboardsBar()).toMatchSnapshot();
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
