import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import Info from './Info';
import D2TextLink from '../widgets/D2TextLink';
import D2ContentEditable from '../widgets/D2ContentEditable';
import * as fromReducers from '../reducers';
import { orObject, orArray } from '../util';
import {
    acSetSelectedEdit,
    acSetSelectedShowDescription,
    acAddDashboardItem,
} from '../actions';
import { sGetSelectedId } from '../reducers/selected';
import { sGetSelectedDashboard } from '../reducers';
import { getYMax } from '../ItemGrid/gridUtil';

import './TitleBar.css';

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
        top: 2,
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
                    placeholder={'Unnamed dashboard'}
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

const mapStateToProps = state => {
    const { fromSelected, sGetSelectedDashboard } = fromReducers;
    const { sGetSelectedEdit, sGetSelectedShowDescription } = fromSelected;

    const selectedDashboard = orObject(sGetSelectedDashboard(state));

    const loremIpsum =
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';

    return {
        state,
        props: {
            name: selectedDashboard.name,
            description: selectedDashboard.description || loremIpsum,
            starred: selectedDashboard.starred,
            edit: sGetSelectedEdit(state),
            showDescripton: sGetSelectedShowDescription(state),
        },
    };
};

const mapDispatchToProps = dispatch => ({
    dispatch,
    props: {
        onBlur: e => console.log('dashboard name: ', e.target.value),
        onEditClick: () => dispatch(acSetSelectedEdit(true)),
        onInfoClick: isShow => dispatch(acSetSelectedShowDescription(isShow)),
    },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const dashboardItems = orArray(
        orObject(sGetSelectedDashboard(stateProps.state)).dashboardItems
    );

    const yValue = getYMax(dashboardItems);
    const dashboardId = sGetSelectedId(stateProps.state);

    const p = {
        ...stateProps.props,
        ...dispatchProps.props,
        onAddClick: () =>
            dispatchProps.dispatch(
                acAddDashboardItem(dashboardId, yValue, {
                    id: 'VffWmdKFHSq',
                    name: 'ANC: ANC IPT 1 Coverage last 12 months districts',
                    type: 'CHART',
                })
            ),
    };

    console.log('TITLEBAR props', p);
    return p;
};

const TitleBarCt = connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    TitleBar
);

export default TitleBarCt;
