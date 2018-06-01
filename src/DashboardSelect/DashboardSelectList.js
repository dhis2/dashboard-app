import React from 'react'
import PropTypes from 'prop-types'

import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'

import IconStar from 'material-ui/svg-icons/toggle/star'

const DashboardSelectListItem = ({ dashboard, onClick }) => {
    const styles = {
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
    }

    return (
        <Chip
            onClick={onClick}
            style={styles.chip}
            labelStyle={styles.labelStyle}
        >
            {dashboard.starred ? (
                <Avatar
                    color="#444"
                    style={{ height: '30px', width: '30px' }}
                    icon={<IconStar />}
                />
            ) : (
                ''
            )}
            {dashboard.name}
        </Chip>
    )
}

DashboardSelectListItem.propTypes = {
    dashboard: PropTypes.object,
    onClick: PropTypes.func
}

DashboardSelectListItem.defaultProps = {
    dashboard: {},
    onClick: Function.prototype
}

// Component

const DashboardSelectList = ({ dashboards, onClick }) => {
    const wrapper = {
        display: 'flex',
        flexWrap: 'wrap'
    }

    return (
        <div style={wrapper}>
            {dashboards.map(d => (
                <DashboardSelectListItem
                    key={d.id}
                    dashboard={d}
                    onClick={() => onClick(d.id)}
                />
            ))}
        </div>
    )
}

DashboardSelectList.propTypes = {
    dashboards: PropTypes.array,
    onClick: PropTypes.func
}

DashboardSelectList.defaultProps = {
    dashboards: [],
    onClick: Function.prototype
}

export default DashboardSelectList
