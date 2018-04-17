import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import i18n from 'd2-i18n';
import SharingDialog from 'd2-ui-sharing';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import FilterDialog from '../ItemFilter/ItemFilter';
import Info from './Info';
import FlatButton from '../widgets/FlatButton';
import * as fromReducers from '../reducers';
import { fromEditDashboard, fromSelected, fromDashboards } from '../actions';
import { orObject } from '../util';

const NO_DESCRIPTION = i18n.t('No description');

const viewStyle = {
    titleBarIcon: {
        marginLeft: 5,
        position: 'relative',
        top: 1,
        cursor: 'pointer',
    },
    noDescription: {
        color: '#888',
    },
};

class ViewTitleBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sharingDialogIsOpen: false,
            filterDialogIsOpen: false,
        };
    }

    toggleSharingDialog = () =>
        this.setState({ sharingDialogIsOpen: !this.state.sharingDialogIsOpen });

    toggleFilterDialog = () =>
        this.setState({ filterDialogIsOpen: !this.state.filterDialogIsOpen });

    renderItemFilterLabel = () => {
        const len = this.props.itemFilterKeys.length;

        return len ? (
            <span
                onClick={this.toggleFilterDialog}
                style={{
                    marginLeft: '20px',
                    cursor: 'pointer',
                    color: '#fff',
                    fontWeight: 500,
                    backgroundColor: '#444',
                    padding: '6px 8px',
                    borderRadius: '3px',
                    position: 'relative',
                    top: '1px',
                }}
            >
                {len} {len > 1 ? 'filters' : 'filter'} applied
            </span>
        ) : (
            ''
        );
    };

    render() {
        const {
            id,
            name,
            description,
            access,
            style,
            showDescription,
            starred,
            onStarClick,
            onEditClick,
            onInfoClick,
        } = this.props;
        const styles = Object.assign({}, style, viewStyle);
        const titleStyle = Object.assign({}, style.title, {
            cursor: 'default',
            userSelect: 'text',
            top: '5px',
        });

        return (
            <Fragment>
                <div className="titlebar" style={styles.titleBar}>
                    <span style={titleStyle}>{name}</span>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '20px',
                        }}
                    >
                        <div style={styles.titleBarIcon} onClick={onStarClick}>
                            <SvgIcon icon={starred ? 'Star' : 'StarBorder'} />
                        </div>
                        <div style={styles.titleBarIcon}>
                            <Info onClick={onInfoClick} />
                        </div>
                        <span style={{ marginLeft: '10px' }}>
                            {access.update ? (
                                <FlatButton
                                    style={{ minWidth: '30px', top: '1px' }}
                                    onClick={onEditClick}
                                >
                                    Edit
                                </FlatButton>
                            ) : null}

                            {access.manage ? (
                                <FlatButton
                                    style={{ minWidth: '30px', top: '1px' }}
                                    onClick={this.toggleSharingDialog}
                                >
                                    Share
                                </FlatButton>
                            ) : null}
                            <FlatButton
                                onClick={this.toggleFilterDialog}
                                style={{ minWidth: '30px', top: '1px' }}
                            >
                                Filter
                            </FlatButton>
                            {this.renderItemFilterLabel()}
                        </span>
                    </div>
                </div>
                {showDescription ? (
                    <div
                        className="dashboard-description"
                        style={Object.assign(
                            { paddingTop: '5px', paddingBottom: '5px' },
                            styles.description,
                            !description ? styles.noDescription : {}
                        )}
                    >
                        {description || NO_DESCRIPTION}
                    </div>
                ) : null}
                {id ? (
                    <SharingDialog
                        d2={this.context.d2}
                        id={id}
                        type="dashboard"
                        open={this.state.sharingDialogIsOpen}
                        onRequestClose={this.toggleSharingDialog}
                    />
                ) : null}
                {id ? (
                    <FilterDialog
                        open={this.state.filterDialogIsOpen}
                        onRequestClose={this.toggleFilterDialog}
                    />
                ) : null}
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    const selectedDashboard = orObject(
        fromReducers.sGetSelectedDashboard(state)
    );

    return {
        selectedDashboard,
        dashboardItems: fromReducers.sGetCurrentDashboardItems(state),
        showDescription: fromReducers.fromSelected.sGetSelectedShowDescription(
            state
        ),
        starred: selectedDashboard.starred,
        access: orObject(selectedDashboard.access),
        itemFilterKeys: fromReducers.fromItemFilter.sGetFilterKeys(state),
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const selectedDashboard = orObject(stateProps.selectedDashboard);
    const { dispatch } = dispatchProps;

    return {
        ...stateProps,
        ...ownProps,
        onStarClick: () =>
            dispatch(
                fromDashboards.tStarDashboard(
                    selectedDashboard.id,
                    !stateProps.starred
                )
            ),
        onEditClick: () => {
            dispatch(
                fromEditDashboard.acSetEditDashboard(
                    selectedDashboard,
                    stateProps.dashboardItems
                )
            );
        },
        onInfoClick: () =>
            dispatch(
                fromSelected.acSetSelectedShowDescription(
                    !stateProps.showDescription
                )
            ),
    };
};

const ViewTitleBarCt = connect(mapStateToProps, null, mergeProps)(ViewTitleBar);

export default ViewTitleBarCt;

ViewTitleBar.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    starred: PropTypes.bool,
    showDescription: PropTypes.bool,
    onEditClick: PropTypes.func.isRequired,
    onInfoClick: PropTypes.func,
};

ViewTitleBar.defaultProps = {
    name: '',
    description: '',
    starred: false,
    showDescription: false,
    onInfoClick: null,
};

ViewTitleBar.contextTypes = {
    d2: PropTypes.object,
};
