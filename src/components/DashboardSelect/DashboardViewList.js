import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import IconStar from 'material-ui/svg-icons/toggle/star';

const Item = ({ dashboard, onClick }) => {
    const _styles = {
        chip: {
            margin: 3,
            height: '30px',
            cursor: 'pointer'
        },
        labelStyle: {
            fontSize: '13px',
            color: '#333',
            fontWeight: 500,
            lineHeight: '30px'
        }
    };

    return (
        <Chip
            onClick={onClick}
            style={_styles.chip}
            labelStyle={_styles.labelStyle}
        >
            {dashboard.starred ? <Avatar color="#444" style={{height: '30px', width: '30px'}} icon={<IconStar/>}/> : ''}
            {dashboard.name}
        </Chip>
    );
};

Item.propTypes = {
    dashboard: PropTypes.object,
    onClick: PropTypes.func,
};

export default function DashboardViewList({ dashboards, onClickDashboard, selectedId }) {

    const icon = {
        width: '13px',
        height: '13px',
        position: 'relative',
        top: '2px',
        paddingRight: '4px'
    };

    const wrapper = {
        display: 'flex',
        flexWrap: 'wrap'
    };

    return (
        <div>
            <div style={wrapper}>
                {dashboards.map(d => {
                    return (
                        <Item key={d.id} dashboard={d} onClick={() => onClickDashboard(d.id)} />
                    );
                })}
            </div>
        </div>
    );
}

DashboardViewList.propTypes = {
    dashboards: PropTypes.array,
    onClickDashboard: PropTypes.func,
    selectedId: PropTypes.string,
};