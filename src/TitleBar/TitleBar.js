import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import './TitleBar.css';

import Info from './Info';
import D2TextLink from '../widgets/D2TextLink';
import D2ContentEditable from '../widgets/D2ContentEditable';
import * as fromReducers from '../reducers';
import * as fromActions from '../actions';
import { orObject, orArray, loremIpsum } from '../util';
import { getYMax } from '../ItemGrid/gridUtil';

// Component

const styles = {
    titleBarWrapper: {
        padding: '20px 15px 5px 10px',
    },
    titleBar: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    titleBarIcon: {
        marginLeft: 5,
        position: 'relative',
        top: 5,
    },
    titleBarLink: {
        marginLeft: 20,
    },
    title: {
        marginRight: 20,
        position: 'relative',
        top: 1,
    },
    textLink: {
        fontSize: 15,
        fontWeight: 500,
        color: '#006ed3',
    },
    textLinkHover: {
        color: '#3399f8',
    },
    description: {
        paddingTop: 10,
        paddingBottom: 5,
        fontSize: 13,
        color: '#555555',
    },
};

const TitleBar = ({
    name,
    description,
    edit,
    showDescripton,
    starred,
    onBlur,
    onEditClick,
    onInfoClick,
    onAddClick,
}) => (
    <div className="titlebar-wrapper" style={styles.titleBarWrapper}>
        <div className="titlebar" style={styles.titleBar}>
            <div style={styles.title}>
                <D2ContentEditable
                    className="dashboard-title"
                    name={name}
                    onBlur={onBlur}
                    disabled={!edit}
                    placeholder={'Untitled'}
                />
            </div>
            <div style={styles.titleBarIcon}>
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
            <div style={styles.titleBarLink}>
                <D2TextLink
                    text={'Filter'}
                    style={styles.textLink}
                    hoverStyle={styles.textLinkHover}
                />
            </div>
            <div style={styles.titleBarLink}>
                <D2TextLink
                    text={'+ Add item'}
                    style={styles.textLink}
                    hoverStyle={styles.textLinkHover}
                    onClick={onAddClick}
                />
            </div>
        </div>
        {showDescripton || edit ? (
            <div className="description" style={styles.description}>
                {description}
            </div>
        ) : (
            ''
        )}
    </div>
);

TitleBar.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    starred: PropTypes.bool,
    edit: PropTypes.bool,
    showDescripton: PropTypes.bool,
    onBlur: PropTypes.func,
    onEditClick: PropTypes.func.isRequired,
    onInfoClick: PropTypes.func,
};

TitleBar.defaultProps = {
    name: '',
    description: '',
    starred: false,
    edit: false,
    showDescripton: false,
    onBlur: null,
    onInfoClick: null,
};

// Container

const mapStateToProps = state => ({
    selectedDashboard: fromReducers.sGetSelectedDashboard(state),
    edit: fromReducers.fromSelected.sGetSelectedEdit(state),
    showDescripton: fromReducers.fromSelected.sGetSelectedShowDescription(
        state
    ),
});

const mergeProps = (stateProps, dispatchProps) => {
    const { selectedDashboard, edit, showDescription } = stateProps;
    const { dispatch } = dispatchProps;

    const selectedDashboardObject = orObject(selectedDashboard);

    const selectedDashboardItems = orArray(
        selectedDashboardObject.dashboardItems
    );
    const selectedDashboardId = selectedDashboardObject.id;

    const yValue = getYMax(selectedDashboardItems);

    return {
        name: selectedDashboardObject.name,
        description: selectedDashboardObject.description || loremIpsum,
        starred: selectedDashboardObject.starred,
        edit: edit,
        showDescription: showDescription,
        onBlur: name => console.log('dashboard name: ', name),
        onEditClick: () => dispatch(fromActions.acSetSelectedEdit(true)),
        onInfoClick: show =>
            dispatch(fromActions.acSetSelectedShowDescription(show)),
        onAddClick: () =>
            dispatch(
                fromActions.acAddDashboardItem(selectedDashboardId, yValue, {
                    id: 'VffWmdKFHSq',
                    name: 'ANC: ANC IPT 1 Coverage last 12 months districts',
                    type: 'CHART',
                })
            ),
    };
};

const TitleBarCt = connect(mapStateToProps, null, mergeProps)(TitleBar);

export default TitleBarCt;
