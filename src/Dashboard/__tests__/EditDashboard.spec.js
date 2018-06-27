import React from 'react';
import { shallow } from 'enzyme';
import { EditDashboard } from '../EditDashboard';
import { DashboardContent } from '../DashboardContent';
import { NoContentMessage } from '../../widgets/NoContentMessage';

describe('EditDashboard', () => {
    let props;
    let shallowEditDashboard;
    const editDashboard = () => {
        if (!shallowEditDashboard) {
            shallowEditDashboard = shallow(<EditDashboard {...props} />);
        }
        return shallowEditDashboard;
    };

    const assertDashboardContent = () => {
        const children = editDashboard()
            .find('.dashboard-wrapper')
            .children();

        expect(children.length).toBe(1);
        expect(children.dive().find(NoContentMessage)).toHaveLength(0);
        expect(children.dive().find(DashboardContent)).toHaveLength(1);
    };

    const assertNoContentMessage = () => {
        const children = editDashboard()
            .find('.dashboard-wrapper')
            .children();

        expect(children.length).toBe(1);
        expect(children.dive().find(NoContentMessage)).toHaveLength(1);
        expect(children.dive().find(DashboardContent)).toHaveLength(0);
    };

    beforeEach(() => {
        props = {
            dashboard: undefined,
            id: undefined,
            updateAccess: undefined,
            items: undefined,
            dashboardsLoaded: undefined,
        };
        shallowEditDashboard = undefined;
    });

    describe('when "dashboardsLoaded" is false', () => {
        it('does not render any children inside the div', () => {
            props.dashboardsLoaded = false;

            expect(
                editDashboard()
                    .find('.dashboard-wrapper')
                    .children().length
            ).toBe(0);
        });
    });

    describe('when "dashboardsLoaded" is true', () => {
        beforeEach(() => {
            props.dashboardsLoaded = true;
        });

        describe('when "id" is null', () => {
            it('does not render any children inside the div', () => {
                props.id = null;
                expect(
                    editDashboard()
                        .find('.dashboard-wrapper')
                        .children().length
                ).toBe(0);
            });
        });

        describe('when id is not null', () => {
            beforeEach(() => {
                props.id = 'abc123';
            });


            describe('when updateAccess is true', () => {
                it('renders DashboardContent', () => {
                    props.updateAccess = true;
                    assertDashboardContent();
                });
            });

            describe('when updateAccess is false', () => {
                it('renders a NoContentMessage', () => {
                    props.updateAccess = false;
                    assertNoContentMessage();
                });
            });
        });
    });
});
