import React from 'react';
import PropTypes from 'prop-types';
import MuiChip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import IconStar from '@material-ui/icons/Star';
import { Link } from 'react-router-dom';

import { colors } from '../../modules/colors';

const chipTheme = {
    default: {
        labelColor: colors.black,
        backgroundColor: colors.lightGrey,
    },
    primary: {
        labelColor: colors.black,
        backgroundColor: colors.lightGrey,
    },
    accent: {
        labelColor: colors.white,
        backgroundColor: colors.mediumGreen,
    },
};

const d = '30px';

const avatar = selected => {
    const avatarProps = {
        color: colors.white,
        backgroundColor: selected ? 'transparent' : colors.lightMediumGrey,
        style: { height: d, width: d },
    };

    return <Avatar icon={<IconStar />} {...avatarProps} />;
};

const DashboardItemChip = ({ starred, selected, label, dashboardId }) => {
    const chipColorProps = selected
        ? chipTheme.accent
        : starred
        ? chipTheme.primary
        : chipTheme.default;

    const labelStyle = { fontSize: '14px', fontWeight: 400, lineHeight: d };
    const style = { margin: 3, height: d, cursor: 'pointer' };

    const props = {
        style,
        labelStyle,
        ...chipColorProps,
    };

    return (
        <Link
            style={{
                display: 'inline-block',
                verticalAlign: 'top',
                textDecoration: 'none',
            }}
            to={`/${dashboardId}`}
        >
            <MuiChip {...props}>
                {starred ? avatar(selected) : null}
                {label}
            </MuiChip>
        </Link>
    );
};

DashboardItemChip.propTypes = {
    starred: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
};

export default DashboardItemChip;
