import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
import Button from 'd2-ui/lib/button/Button';
import TranslationDialog from 'd2-ui/lib/i18n/TranslationDialog.component';
import { colors } from '../colors';
import { tSaveDashboard, acClearEditDashboard } from '../actions/editDashboard';
import { sGetEditDashboard } from '../reducers/editDashboard';
import { CONTROL_BAR_ROW_HEIGHT, getOuterHeight } from './ControlBarContainer';
import { apiFetchSelected } from '../api/dashboards';

const styles = {
    save: {
        borderRadius: '2px',
        backgroundColor: colors.royalBlue,
        color: colors.lightGrey,
        fontWeight: '500',
        boxShadow:
            '0 0 2px 0 rgba(0,0,0,0.12), 0 2px 2px 0 rgba(0,0,0,0.24), 0 0 8px 0 rgba(0,0,0,0.12), 0 0 8px 0 rgba(0,0,0,0.24)',
    },
    discard: {
        color: colors.royalBlue,
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '14px',
        fontWeight: 500,
        textTransform: 'uppercase',
        padding: '5px',
        height: '36px',
        cursor: 'pointer',
    },
    buttonBar: {
        height: CONTROL_BAR_ROW_HEIGHT,
        paddingTop: '14px',
        marginLeft: '15px',
        marginRight: '15px',
    },
};

class EditBar extends Component {
    state = {
        translationDialogIsOpen: false,
        dashboardModel: undefined,
    };

    componentDidMount() {
        apiFetchSelected(this.props.dashboardId).then(dashboardModel =>
            this.setState({ dashboardModel })
        );
    }

    toggleTranslationDialog = () => {
        this.setState({
            translationDialogIsOpen: !this.state.translationDialogIsOpen,
        });
    };

    translationDialog = () =>
        this.state.dashboardModel ? (
            <TranslationDialog
                open={this.state.translationDialogIsOpen}
                onRequestClose={this.toggleTranslationDialog}
                objectToTranslate={this.state.dashboardModel}
                fieldsToTranslate={['name', 'description']}
                // TODO handle messages in snackbar
                onTranslationSaved={msg =>
                    console.log('translation update response', msg)
                }
                onTranslationError={err =>
                    console.log('translation update error', err)
                }
            />
        ) : null;

    render() {
        const { style, onSave, onDiscard } = this.props;
        const controlBarHeight = getOuterHeight(1, false);

        return (
            <Fragment>
                <ControlBar
                    height={controlBarHeight}
                    editMode={true}
                    expandable={false}
                >
                    <div style={styles.buttonBar}>
                        <div style={style.leftControls}>
                            <Button style={styles.save} onClick={onSave}>
                                Save Changes
                            </Button>
                            <Button onClick={this.toggleTranslationDialog}>
                                Translate
                            </Button>
                        </div>
                        <div style={style.rightControls}>
                            <button style={styles.discard} onClick={onDiscard}>
                                Exit without saving
                            </button>
                        </div>
                    </div>
                </ControlBar>
                {this.translationDialog()}
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    dashboardId: sGetEditDashboard(state).id,
});

const mapDispatchToProps = dispatch => {
    return {
        onSave: () => {
            dispatch(tSaveDashboard());
        },
        onDiscard: () => {
            dispatch(acClearEditDashboard());
        },
    };
};

const EditBarCt = connect(mapStateToProps, mapDispatchToProps)(EditBar);

export default EditBarCt;
