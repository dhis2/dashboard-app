import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import i18n from '@dhis2/d2-i18n';
import SharingDialog from '@dhis2/d2-ui-sharing-dialog';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';

import { orObject } from '../../modules/util';
import { tStarDashboard } from '../../actions/dashboards';
import { acSetSelectedShowDescription } from '../../actions/selected';
import FilterSelector from '../ItemFilter/FilterSelector';
import { Button, colors } from '@dhis2/ui-core';
import Info from './Info';
import {
    sGetSelectedId,
    sGetSelectedShowDescription,
} from '../../reducers/selected';
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards';
import { acSetForceLoadAll } from '../../actions/dashboards';

import classes from './styles/ViewTitleBar.module.css';

const NO_DESCRIPTION = i18n.t('No description');

class ViewTitleBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sharingDialogIsOpen: false,
        };
    }

    showPrintSPView = () => {
        this.props.setForceLoadAll(true);
        const appComponent = document.getElementsByClassName('app-wrapper')[0];
        appComponent.classList.add('printview');
    };

    showPrintLayoutView = () => {
        this.props.setForceLoadAll(true);
        const unsorteditems = Array.from(
            document.getElementsByClassName('react-grid-item')
        );
        const items = unsorteditems.sort((a, b) => {
            if (a.y < b.y) {
                return -2;
            } else if (a.y === b.y) {
                if (a.x < b.x) {
                    return -1;
                }
            }

            return 1;
        });

        const pageList = [{ y: 200 }, { y: 800 }, { y: 1400 }];
        const pageHeight = 600;
        items.forEach(i =>
            console.log(
                'item.style',
                i.style.getPropertyValue('transform'),
                i.style.getPropertyValue('height')
            )
        );
    };

    toggleSharingDialog = () =>
        this.setState({ sharingDialogIsOpen: !this.state.sharingDialogIsOpen });

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

        const titleStyle = Object.assign({}, style.title, {
            cursor: 'default',
            userSelect: 'text',
            top: '7px',
        });

        const StarIcon = starred ? Star : StarBorder;

        return (
            <>
                <div className={classes.titleBar}>
                    <span style={titleStyle}>{name}</span>
                    <div className={classes.actions}>
                        <div
                            className={classes.titleBarIcon}
                            onClick={() => onStarClick(id, starred)}
                        >
                            <StarIcon style={{ fill: colors.grey600 }} />
                        </div>
                        <div className={classes.titleBarIcon}>
                            <Info
                                onClick={() => onInfoClick(showDescription)}
                            />
                        </div>
                        <div className={classes.buttons}>
                            {access.update ? (
                                <Link
                                    className={classes.editLink}
                                    to={`/${id}/edit`}
                                >
                                    <Button>{i18n.t('Edit')}</Button>
                                </Link>
                            ) : null}
                            {access.manage ? (
                                <span style={{ marginRight: '4px' }}>
                                    <Button onClick={this.toggleSharingDialog}>
                                        {i18n.t('Share')}
                                    </Button>
                                </span>
                            ) : null}
                            <span style={{ marginRight: '4px' }}>
                                <FilterSelector />
                            </span>
                            <button onClick={this.showPrintSPView}>
                                Print SP view
                            </button>
                            <button onClick={this.showPrintLayoutView}>
                                Print Layout view
                            </button>
                        </div>
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
            </>
        );
    }
}

ViewTitleBar.propTypes = {
    access: PropTypes.object,
    description: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    setForceLoadAll: PropTypes.func,
    showDescription: PropTypes.bool,
    starred: PropTypes.bool,
    style: PropTypes.object,
    onInfoClick: PropTypes.func,
    onStarClick: PropTypes.func,
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setForceLoadAll: val => dispatch(acSetForceLoadAll(val)),
        onStarClick: (id, starred) => dispatch(tStarDashboard(id, !starred)),
        onInfoClick: showDescription =>
            dispatch(acSetSelectedShowDescription(!showDescription)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewTitleBar);
