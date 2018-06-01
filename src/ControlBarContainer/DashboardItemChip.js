import React from 'react'
import MuiChip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
import IconStar from 'material-ui/svg-icons/toggle/star'
import { colors } from '../colors'

const chipTheme = {
    default: {
        labelColor: colors.black,
        backgroundColor: colors.lightGrey
    },
    primary: {
        labelColor: colors.black,
        backgroundColor: colors.lightGrey
    },
    accent: {
        labelColor: colors.white,
        backgroundColor: colors.mediumGreen
    }
}

const chipDimension = '30px'

const avatar = selected => {
    const avatarProps = {
        color: colors.white,
        backgroundColor: selected ? 'transparent' : colors.lightMediumGrey,
        style: {
            height: chipDimension,
            width: chipDimension
        }
    }

    return <Avatar icon={<IconStar />} {...avatarProps} />
}

const DashboardItemChip = ({ starred, selected, label, onClick }) => {
    const chipColorProps = selected
        ? chipTheme.accent
        : starred
            ? chipTheme.primary
            : chipTheme.default

    const labelStyle = {
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: chipDimension
    }

    const style = {
        margin: 3,
        height: chipDimension,
        cursor: 'pointer'
    }

    const props = {
        style,
        labelStyle,
        onClick,
        ...chipColorProps
    }

    return (
        <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
            <MuiChip {...props}>
                {starred ? avatar(selected) : null}
                {label}
            </MuiChip>
        </div>
    )
}

export default DashboardItemChip
