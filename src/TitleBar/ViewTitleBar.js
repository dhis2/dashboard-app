import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { t } from 'i18next';
import SharingDialog from 'd2-ui/lib/sharing/SharingDialog.component';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import FilterDialog from '../ItemFilter/ItemFilter';
import Info from './Info';
import D2TextLink from '../widgets/D2TextLink';
import * as fromReducers from '../reducers';
import {
    fromEditDashboard,
    fromSelected,
    fromDashboards,
    fromItemFilter,
} from '../actions';
import { orObject } from '../util';

const NO_DESCRIPTION = t('No description');

const viewStyle = {
    textLink: {
        fontSize: 15,
        fontWeight: 500,
        color: '#006ed3',
    },
    textLinkHover: {
        color: '#3399f8',
    },
    titleBarIcon: {
        marginLeft: 5,
        position: 'relative',
        top: 1,
        cursor: 'pointer',
    },
    titleBarLink: {
        marginLeft: 25,
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
            <div
                style={{ marginLeft: '20px', cursor: 'pointer' }}
                onClick={this.toggleFilterDialog}
            >
                <div
                    style={{
                        color: '#fff',
                        fontWeight: 500,
                        backgroundColor: '#444',
                        padding: '5px 7px',
                        borderRadius: '3px',
                    }}
                >
                    {len} {len > 1 ? 'filters' : 'filter'} applied
                </div>
            </div>
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
            top: '1px',
        });

        return (
            <Fragment>
                <div className="titlebar" style={styles.titleBar}>
                    <div style={titleStyle}>
                        <div style={{ userSelect: 'text' }}>{name}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={styles.titleBarIcon} onClick={onStarClick}>
                            <SvgIcon icon={starred ? 'Star' : 'StarBorder'} />
                        </div>
                        <div style={styles.titleBarIcon}>
                            <Info onClick={onInfoClick} />
                        </div>
                        {access.update ? (
                            <div style={styles.titleBarLink}>
                                <D2TextLink
                                    text={'Edit'}
                                    style={styles.textLink}
                                    hoverStyle={styles.textLinkHover}
                                    onClick={onEditClick}
                                />
                            </div>
                        ) : null}
                        <div style={styles.titleBarLink}>
                            <D2TextLink
                                text={'Share'}
                                style={styles.textLink}
                                hoverStyle={styles.textLinkHover}
                                onClick={this.toggleSharingDialog}
                            />
                        </div>
                        <div style={styles.titleBarLink}>
                            <D2TextLink
                                text={'Filter'}
                                style={styles.textLink}
                                hoverStyle={styles.textLinkHover}
                                onClick={this.toggleFilterDialog}
                            />
                        </div>
                        {this.renderItemFilterLabel()}
                    </div>
                </div>
                {showDescription ? (
                    <div
                        className="dashboard-description"
                        style={Object.assign(
                            {},
                            styles.description,
                            !description ? styles.noDescription : {}
                        )}
                    >
                        {description || NO_DESCRIPTION}
                    </div>
                ) : null}
                {id ? (
                    <SharingDialog
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
            dispatch(fromEditDashboard.acSetEditDashboard(selectedDashboard));
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
