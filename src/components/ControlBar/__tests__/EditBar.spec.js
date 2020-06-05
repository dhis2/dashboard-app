import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@dhis2/ui';

import { EditBar } from '../EditBar';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog';
import { getStubContext } from '../../../setupTests';

const mockDashboardModels = {
    rainbow: {
        id: 'rainbow123',
    },
};

jest.mock('../../../api/dashboards', () => ({
    apiFetchDashboard: id => Promise.resolve(mockDashboardModels[id]),
}));

/* eslint-disable react/display-name */
jest.mock('@dhis2/d2-ui-translation-dialog', () => () => {
    return <div className="mock-dhis2-translation-dialog" />;
});
/* eslint-enable react/display-name */

describe('EditBar', () => {
    let props;
    let shallowEditBar;
    const editBar = () => {
        const context = getStubContext();

        if (!shallowEditBar) {
            shallowEditBar = shallow(<EditBar {...props} />, {
                context,
            });
        }
        return shallowEditBar;
    };

    beforeEach(() => {
        props = {
            style: {},
            onSave: undefined,
            onDiscardChanges: undefined,
            dashboardId: undefined,
            deleteAccess: undefined,
            updateAccess: undefined,
        };
        shallowEditBar = undefined;
    });

    it('renders the EditBar', () => {
        expect(editBar()).toMatchSnapshot();
    });

    describe('when update access is false', () => {
        beforeEach(() => {
            props.updateAccess = false;
        });

        it('renders only the Discard button', () => {
            expect(editBar()).toMatchSnapshot();
        });
    });

    describe('when update access is true', () => {
        beforeEach(() => {
            props.updateAccess = true;
        });

        describe('when no dashboard id property', () => {
            beforeEach(() => {
                props.onSave = jest.fn(() => ({ then: () => {} }));
                props.onDiscardChanges = jest.fn();
            });

            it('renders Save and Discard buttons but no dialogs', () => {
                const wrapper = editBar();

                return Promise.resolve().then(() => {
                    expect(wrapper).toMatchSnapshot();
                });
            });

            it('triggers the save action', () => {
                editBar()
                    .find(Button)
                    .filterWhere(n => n.childAt(0).text() === 'Save changes')
                    .simulate('click');

                expect(props.onSave).toHaveBeenCalled();
            });

            it('triggers the discard action', () => {
                editBar()
                    .find(Button)
                    .filterWhere(
                        n => n.childAt(0).text() === 'Exit without saving'
                    )
                    .simulate('click');
                expect(props.onDiscardChanges).toHaveBeenCalled();
            });
        });

        describe('when dashboard id property provided', () => {
            beforeEach(() => {
                props.dashboardId = 'rainbow';
            });

            it('renders Save, Translate and Discard buttons and the TranslationDialog but not ConfirmDeleteDialog', () => {
                const wrapper = editBar();

                return Promise.resolve().then(() => {
                    expect(wrapper).toMatchSnapshot();
                });
            });

            describe('when TRANSLATE button is clicked', () => {
                const getAsyncWrapper = () => {
                    const wrapper = editBar();

                    return Promise.resolve().then(() => {
                        wrapper.update();
                        return wrapper;
                    });
                };

                it('shows the translate dialog', done => {
                    getAsyncWrapper().then(wrapper => {
                        expect(wrapper).toMatchSnapshot();

                        wrapper
                            .find(Button)
                            .filterWhere(
                                n => n.childAt(0).text() === 'Translate'
                            )
                            .simulate('click');

                        expect(wrapper).toMatchSnapshot();
                        done();
                    });
                });

                describe('when translations saved', () => {
                    beforeEach(() => {
                        props.onTranslate = jest.fn();
                    });

                    it('triggers onTranslationsSaved', done => {
                        getAsyncWrapper()
                            .then(wrapper => {
                                wrapper
                                    .find('.translation-dialog')
                                    .simulate('translationSaved', [
                                        {
                                            locale: 'ponyLang',
                                            property: 'NAME',
                                            value: 'Regnbue',
                                        },
                                    ]);
                            })
                            .then(() => {
                                expect(props.onTranslate).toHaveBeenCalled();
                                expect(props.onTranslate).toHaveBeenCalledWith(
                                    'rainbow',
                                    'Regnbue'
                                );
                                done();
                            });
                    });
                });
            });

            describe('when deleteAccess is true', () => {
                beforeEach(() => {
                    props.deleteAccess = true;
                    props.onDelete = jest.fn(() => ({ then: () => {} }));
                });

                it('renders Translate, Delete, and Discard buttons and ConfirmDeleteDialog', () => {
                    expect(editBar()).toMatchSnapshot();
                });

                it('shows the confirm delete dialog when delete button clicked', () => {
                    const wrapper = editBar();
                    expect(
                        wrapper.find(ConfirmDeleteDialog).prop('open')
                    ).toEqual(false);

                    wrapper
                        .find(Button)
                        .filterWhere(n => n.childAt(0).text() === 'Delete')
                        .simulate('click');

                    expect(
                        wrapper.find(ConfirmDeleteDialog).prop('open')
                    ).toEqual(true);
                    expect(props.onDelete).not.toHaveBeenCalled();
                });

                it('triggers onDelete when delete confirmed', () => {
                    const dlg = editBar().find(ConfirmDeleteDialog);
                    dlg.simulate('deleteConfirmed');

                    expect(dlg.prop('open')).toEqual(false);
                    expect(props.onDelete).toHaveBeenCalled();
                });

                it('does not trigger onDelete when delete not confirmed', () => {
                    const dlg = editBar().find(ConfirmDeleteDialog);
                    dlg.simulate('continueEditing');

                    expect(dlg.prop('open')).toEqual(false);
                    expect(props.onDelete).not.toHaveBeenCalled();
                });
            });
        });
    });
});
