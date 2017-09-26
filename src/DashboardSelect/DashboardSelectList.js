import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import IconStar from 'material-ui/svg-icons/toggle/star';

const DashboardselectListItem = ({ dashboard, onClick }) => {
    const styles = {
        chip: {
            margin: 3,
            height: '30px',
            cursor: 'pointer',
        },
        labelStyle: {
            fontSize: '13px',
            color: '#333',
            fontWeight: 500,
            lineHeight: '30px',
        },
    };

    return (
        <Chip
            onClick={onClick}
            style={styles.chip}
            labelStyle={styles.labelStyle}
        >
            {dashboard.starred ? <Avatar color="#444" style={{ height: '30px', width: '30px' }} icon={<IconStar />} /> : ''}
            {dashboard.name}
        </Chip>
    );
};

DashboardselectListItem.propTypes = {
    dashboard: PropTypes.object,
    onClick: PropTypes.func,
};

DashboardselectListItem.defaultProps = {
    dashboard: {},
    onClick: Function.prototype,
};

// Component

const DashboardselectList = ({ dashboards, onClickDashboard }) => {
    const wrapper = {
        display: 'flex',
        flexWrap: 'wrap',
    };

    return (
        <div>
            <div style={wrapper}>
                {dashboards.map(d => (
                    <DashboardselectListItem key={d.id} dashboard={d} onClick={() => onClickDashboard(d.id)} />
                ))}
            </div>
        </div>
    );
};

DashboardselectList.propTypes = {
    dashboards: PropTypes.array,
    onClickDashboard: PropTypes.func,
};

DashboardselectList.defaultProps = {
    dashboards: [],
    onClickDashboard: Function.prototype,
};

export default DashboardselectList;
