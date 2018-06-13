import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import i18n from 'd2-i18n';
import SharingDialog from 'd2-ui-sharing';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import FilterDialog from '../ItemFilter/ItemFilter';
import Info from './Info';
import FlatButton from '../widgets/FlatButton';
import * as fromReducers from '../reducers';
import { orObject } from '../util';
import { tStarDashboard } from '../actions/dashboards';
import { acSetSelectedShowDescription } from '../actions/selected';

const NO_DESCRIPTION = i18n.t('No description');

const viewStyle = {
    titleBar: {
        display: 'flex',
        alignItems: 'flex-start',
    },
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
                                <Link
                                    style={{
                                        display: 'inline-block',
                                        verticalAlign: 'top',
                                        textDecoration: 'none',
                                    }}
                                    to={`/${id}/edit`}
                                >
                                    <FlatButton
                                        style={{ minWidth: '30px', top: '1px' }}
                                    >
                                        Edit
                                    </FlatButton>
                                </Link>
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
    const { fromSelected, fromDashboards, fromItemFilter } = fromReducers;
    const id = fromSelected.sGetSelectedId(state);
    const dashboard = orObject(fromDashboards.sGetById(state, id));

    return {
        id,
        name: dashboard.displayName,
        description: dashboard.displayDescription,
        dashboardItems: fromDashboards.sGetItems(state),
        showDescription: fromSelected.sGetSelectedShowDescription(state),
        starred: dashboard.starred,
        access: orObject(dashboard.access),
        itemFilterKeys: fromItemFilter.sGetFilterKeys(state),
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { id, starred, showDescription } = stateProps;
    const { dispatch } = dispatchProps;

    return {
        ...stateProps,
        ...ownProps,
        onStarClick: () => dispatch(tStarDashboard(id, !starred)),
        onInfoClick: () =>
            dispatch(acSetSelectedShowDescription(!showDescription)),
    };
};

export default connect(mapStateToProps, null, mergeProps)(ViewTitleBar);

ViewTitleBar.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    starred: PropTypes.bool,
    showDescription: PropTypes.bool,
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
