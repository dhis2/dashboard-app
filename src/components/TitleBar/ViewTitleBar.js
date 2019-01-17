import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import i18n from 'd2-i18n';
import SharingDialog from '@dhis2/d2-ui-sharing-dialog';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';

import { orObject } from '../../modules/util';
import { tStarDashboard } from '../../actions/dashboards';
import { acSetSelectedShowDescription } from '../../actions/selected';
import FilterDialog from '../ItemFilter/ItemFilter';
import FlatButton from '../../widgets/FlatButton';
import Info from './Info';
import {
    sGetSelectedId,
    sGetSelectedShowDescription,
} from '../../reducers/selected';
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards';
import { sGetFilterKeys } from '../../reducers/itemFilter';
import { colors } from '../../modules/colors';

const NO_DESCRIPTION = i18n.t('No description');

const styles = {
    actions: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '20px',
    },
    starIcon: {
        fill: colors.muiDefaultGrey,
    },
    textButton: {
        minWidth: '30px',
        top: '1px',
    },
    editLink: {
        display: 'inline-block',
        verticalAlign: 'top',
        textDecoration: 'none',
    },
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
                    color: colors.white,
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
            classes,
        } = this.props;

        const titleStyle = Object.assign({}, style.title, {
            cursor: 'default',
            userSelect: 'text',
            top: '7px',
        });

        const StarIcon = starred ? Star : StarBorder;

        return (
            <Fragment>
                <div className={classes.titleBar}>
                    <span style={titleStyle}>{name}</span>
                    <div className={classes.actions}>
                        <div
                            className={classes.titleBarIcon}
                            onClick={onStarClick}
                        >
                            <StarIcon className={classes.starIcon} />
                        </div>
                        <div className={classes.titleBarIcon}>
                            <Info onClick={onInfoClick} />
                        </div>
                        <span style={{ marginLeft: '10px' }}>
                            {access.update ? (
                                <Link
                                    className={classes.editLink}
                                    to={`/${id}/edit`}
                                >
                                    <FlatButton className={classes.textButton}>
                                        Edit
                                    </FlatButton>
                                </Link>
                            ) : null}

                            {access.manage ? (
                                <FlatButton
                                    className={classes.textButton}
                                    onClick={this.toggleSharingDialog}
                                >
                                    Share
                                </FlatButton>
                            ) : null}
                            <FlatButton
                                className={classes.textButton}
                                onClick={this.toggleFilterDialog}
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
                            style.description,
                            !description ? { color: '#888' } : {}
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
    const id = sGetSelectedId(state);
    const dashboard = orObject(sGetDashboardById(state, id));

    return {
        id,
        name: dashboard.displayName,
        description: dashboard.displayDescription,
        dashboardItems: sGetDashboardItems(state),
        showDescription: sGetSelectedShowDescription(state),
        starred: dashboard.starred,
        access: orObject(dashboard.access),
        itemFilterKeys: sGetFilterKeys(state),
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

export default connect(
    mapStateToProps,
    null,
    mergeProps
)(withStyles(styles)(ViewTitleBar));

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
