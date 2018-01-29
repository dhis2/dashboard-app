import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import Info from './Info';
import D2TextLink from '../widgets/D2TextLink';
import * as fromReducers from '../reducers';
import { fromEditDashboard, fromSelected } from '../actions';
import { orObject, eventHandlerWrapper } from '../util';
import { tStarDashboard } from '../actions/dashboards';

const NO_DESCRIPTION = 'No description';

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
        marginLeft: 20,
    },
    noDescription: {
        color: '#888',
    },
};

const ViewTitleBar = ({
    name,
    description,
    style,
    showDescription,
    starred,
    onStarClick,
    onEditClick,
    onInfoClick,
}) => {
    const styles = Object.assign({}, style, viewStyle);

    return (
        <Fragment>
            <div className="titlebar" style={styles.titleBar}>
                <div style={styles.title}>
                    <div style={{ userSelect: 'text' }}>{name}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={styles.titleBarIcon} onClick={onStarClick}>
                        <SvgIcon icon={starred ? 'Star' : 'StarBorder'} />
                    </div>
                    <div style={styles.titleBarIcon}>
                        <Info onClick={onInfoClick} />
                    </div>
                    <div style={styles.titleBarLink}>
                        <D2TextLink
                            text={'Edit'}
                            style={styles.textLink}
                            hoverStyle={styles.textLinkHover}
                            onClick={onEditClick}
                        />
                    </div>
                    <div style={styles.titleBarLink}>
                        <D2TextLink
                            text={'Share'}
                            style={styles.textLink}
                            hoverStyle={styles.textLinkHover}
                        />
                    </div>
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
        </Fragment>
    );
};

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
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const selectedDashboard = orObject(stateProps.selectedDashboard);
    const { dispatch } = dispatchProps;

    return {
        ...stateProps,
        ...ownProps,
        onStarClick: eventHandlerWrapper(
            dispatch,
            tStarDashboard(selectedDashboard.id, !stateProps.starred)
        ),
        onEditClick: () => {
            dispatch(fromSelected.acSetSelectedEdit(true));
            dispatch(fromEditDashboard.acSetEditDashboard(selectedDashboard));
        },
        onInfoClick: eventHandlerWrapper(
            dispatch,
            fromSelected.acSetSelectedShowDescription(
                !stateProps.showDescription
            )
        ),
    };
};

const ViewTitleBarCt = connect(mapStateToProps, null, mergeProps)(ViewTitleBar);

export default ViewTitleBarCt;

ViewTitleBar.propTypes = {
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
