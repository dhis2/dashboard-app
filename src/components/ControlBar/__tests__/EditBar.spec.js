import React from 'react';
import { shallow } from 'enzyme';
import ControlBar from '@dhis2/d2-ui-core/control-bar/ControlBar';
import TranslationDialog from '@dhis2/d2-ui-translation-dialog';

import ConfirmDeleteDialog from '../ConfirmDeleteDialog';
import FlatButton from '../../../widgets/FlatButton';
import { EditBar } from '../EditBar';
import { getStubContext } from '../../../../config/testsContext';

const mockDashboardModels = {
    rainbow: {
        id: 'rainbow123',
    },
};

jest.mock('../../../api/dashboards', () => ({
    apiFetchDashboard: id => Promise.resolve(mockDashboardModels[id]),
}));

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

    const asyncExpectComponentExists = (Component, exists) => {
        const wrapper = editBar();

        return Promise.resolve().then(() => {
            expect(wrapper.find(Component)).toHaveLength(exists ? 1 : 0);
        });
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

    it('renders a ControlBar', () => {
        expect(editBar().find(ControlBar)).toHaveLength(1);
    });

    describe('when update access is false', () => {
        beforeEach(() => {
            props.updateAccess = false;
        });

        it('renders the Discard button', () => {
            expect(editBar().find('.discard-button')).toHaveLength(1);
        });

        it('does not render the Save, Translate or Delete buttons', () => {
            const wrapper = editBar();
            ['.translate-button', '.delete-button', '.save-button'].forEach(
                btnClass => expect(wrapper.find(btnClass)).toHaveLength(0)
            );
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

            it('renders Save button', () => {
                const saveBtn = editBar().find('.save-button');

                expect(saveBtn).toHaveLength(1);
            });

            it('triggers the save action', () => {
                editBar()
                    .find('.save-button')
                    .simulate('click');

                expect(props.onSave).toHaveBeenCalled();
            });

            it('renders Discard button', () => {
                const discardBtn = editBar().find('.discard-button');
                expect(discardBtn).toHaveLength(1);
            });

            it('triggers the discard action', () => {
                editBar()
                    .find('.discard-button')
                    .simulate('click');
                expect(props.onDiscardChanges).toHaveBeenCalled();
            });

            it('does not render a TranslationDialog', () => {
                return asyncExpectComponentExists(TranslationDialog, false);
            });

            it('does not render a ConfirmDeleteDialog', () => {
                return asyncExpectComponentExists(ConfirmDeleteDialog, false);
            });

            describe('when discard button clicked', () => {
                it('triggers the onDiscardChanges function', () => {
                    editBar()
                        .find('.discard-button')
                        .filterWhere(n => {
                            return (
                                n.childAt(0).text() === 'Exit without saving'
                            );
                        })
                        .simulate('click');

                    expect(props.onDiscardChanges).toHaveBeenCalled();
                });
            });
        });

        describe('when dashboard id property provided', () => {
            beforeEach(() => {
                props.dashboardId = 'rainbow';
            });

            it('renders a TranslationDialog', () => {
                return asyncExpectComponentExists(TranslationDialog, true);
            });

            it('does not render a ConfirmDeleteDialog', () => {
                return asyncExpectComponentExists(ConfirmDeleteDialog, false);
            });

            it('renders Translate button', () => {
                const btn = editBar().find('.translate-button');
                expect(btn).toHaveLength(1);
            });

            it('renders Discard button', () => {
                const btn = editBar().find('.discard-button');
                expect(btn).toHaveLength(1);
            });

            describe('when TRANSLATE button is clicked', () => {
                const getAsyncWrapper = () => {
                    const wrapper = editBar();

                    return Promise.resolve().then(() => {
                        wrapper.update();
                        return wrapper;
                    });
                };

                it('shows the translate dialog', () => {
                    getAsyncWrapper().then(wrapper => {
                        expect(
                            wrapper.find(TranslationDialog).prop('open')
                        ).toEqual(false);

                        wrapper
                            .find('.translate-button')
                            .filterWhere(n => {
                                return n.childAt(0).text() === 'Translate';
                            })
                            .simulate('click');

                        expect(
                            wrapper.find(TranslationDialog).prop('open')
                        ).toEqual(true);
                    });
                });

                describe('when translations saved', () => {
                    beforeEach(() => {
                        props.onTranslate = jest.fn();
                    });

                    it('triggers onTranslationsSaved', () => {
                        getAsyncWrapper()
                            .then(wrapper => {
                                wrapper
                                    .find(TranslationDialog)
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
                            });
                    });
                });
            });

            describe('when deleteAccess is true', () => {
                beforeEach(() => {
                    props.deleteAccess = true;
                    props.onDelete = jest.fn(() => ({ then: () => {} }));
                });

                it('renders a ConfirmDeleteDialog', () => {
                    expect(editBar().find(ConfirmDeleteDialog)).toHaveLength(1);
                });

                it('renders Translate, Delete, and Discard buttons', () => {
                    const bar = editBar();
                    [
                        '.translate-button',
                        '.delete-button',
                        '.discard-button',
                    ].forEach(btnClass =>
                        expect(bar.find(btnClass)).toHaveLength(1)
                    );
                });

                it('shows the confirm delete dialog', () => {
                    const wrapper = editBar();
                    expect(
                        wrapper.find(ConfirmDeleteDialog).prop('open')
                    ).toEqual(false);

                    wrapper
                        .find(FlatButton)
                        .filterWhere(n => {
                            return n.childAt(0).text() === 'Delete';
                        })
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
