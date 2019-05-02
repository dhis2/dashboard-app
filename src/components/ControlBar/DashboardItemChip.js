import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Chip } from '@dhis2/ui-core';
import IconStar from '@material-ui/icons/Star';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';

import { colors } from '../../modules/colors';
import { apiPostDataStatistics } from '../../api/dataStatistics';

const styles = {
    chip: {
        margin: '3px',
    },
    link: {
        display: 'inline-block',
        verticalAlign: 'top',
        textDecoration: 'none',
        color: colors.mediumGrey,
    },
};

const DashboardItemChip = ({
    starred,
    selected,
    label,
    dashboardId,
    classes,
}) => {
    const chipProps = {
        label,
        selected,
        className: classes.chip,
    };

    if (starred) {
        chipProps.icon = <IconStar fontSize="small" />;
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
            <Chip {...chipProps} />
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
