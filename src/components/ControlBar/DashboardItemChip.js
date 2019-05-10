import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Chip, colors } from '@dhis2/ui-core';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';

import StarIcon from '../../icons/Star';
import { apiPostDataStatistics } from '../../api/dataStatistics';

const styles = {
    chip: {
        margin: '3px',
    },
    link: {
        color: colors.grey600,
        display: 'inline-block',
        textDecoration: 'none',
        verticalAlign: 'top',
    },
    icon: {
        height: '20px',
        marginTop: '2px',
        width: '20px',
    },
    selected: {
        fill: colors.white,
    },
    unselected: {
        fill: colors.grey700,
    },
};

export const DashboardItemChip = ({
    starred,
    selected,
    label,
    dashboardId,
    classes,
}) => {
    const chipProps = {
        selected,
        className: classes.chip,
    };

    if (starred) {
        const selectedState = selected ? classes.selected : classes.unselected;
        chipProps.icon = (
            <StarIcon className={`${classes.icon} ${selectedState}`} />
        );
    }

    return (
        <Link
            className={classes.link}
            to={`/${dashboardId}`}
            onClick={debounce(
                () => apiPostDataStatistics('DASHBOARD_VIEW', dashboardId),
                500
            )}
        >
            <Chip {...chipProps}>{label}</Chip>
        </Link>
    );
};

DashboardItemChip.propTypes = {
    starred: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    dashboardId: PropTypes.string.isRequired,
};

export default withStyles(styles)(DashboardItemChip);
