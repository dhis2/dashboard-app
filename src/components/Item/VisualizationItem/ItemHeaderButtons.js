import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { isSingleValue, isYearOverYear } from '@dhis2/analytics';
import { Button, Menu, MenuItem, Divider, colors } from '@dhis2/ui-core';
import i18n from '@dhis2/d2-i18n';
import Popover from '@material-ui/core/Popover';
import TableIcon from '@material-ui/icons/ViewList';
import ChartIcon from '@material-ui/icons/InsertChart';
import MapIcon from '@material-ui/icons/Public';
import LaunchIcon from '@material-ui/icons/Launch';

import { ThreeDots, SpeechBubble } from './assets/icons';
import { pluginIsAvailable, getLink } from './plugin';
import {
    CHART,
    MAP,
    REPORT_TABLE,
    EVENT_CHART,
    EVENT_REPORT,
    isTrackerDomainType,
    hasMapView,
    getAppName,
} from '../../../modules/itemTypes';

const iconFill = { fill: colors.grey600 };

const ItemHeaderButtons = props => {
    const [anchorEl, setAnchorEl] = useState(null);

    const { item, visualization, onSelectActiveType, d2, activeType } = props;

    const isTrackerType = isTrackerDomainType(item.type);

    const onViewTable = () => {
        onSelectActiveType(isTrackerType ? EVENT_REPORT : REPORT_TABLE);
        handleClose();
    };

    const onViewChart = () => {
        onSelectActiveType(isTrackerType ? EVENT_CHART : CHART);
        handleClose();
    };

    const onViewMap = () => {
        onSelectActiveType(MAP);
        handleClose();
    };

    const itemHasMapView = () => hasMapView(item.type);

    const handleMenuClick = (_, event) => setAnchorEl(event.currentTarget);

    const handleInterpretationClick = () => {
        props.onToggleFooter();
        if (anchorEl !== null) {
            handleClose();
        }
    };

    const handleClose = () => setAnchorEl(null);

    const type = visualization.type || item.type;
    const canViewAs = !isSingleValue(type) && !isYearOverYear(type);

    const interpretationMenuLabel = props.activeFooter
        ? i18n.t(`Hide interpretations and details`)
        : i18n.t(`Show interpretations and details`);

    const ViewAsMenuItems = () => (
        <>
            <MenuItem
                dense
                active={activeType === CHART}
                label={i18n.t('View as Chart')}
                onClick={onViewChart}
                icon={<ChartIcon style={iconFill} />}
            />
            <MenuItem
                dense
                active={[REPORT_TABLE, EVENT_REPORT].includes(activeType)}
                label={i18n.t('View as Table')}
                onClick={onViewTable}
                icon={<TableIcon style={iconFill} />}
            />
            {itemHasMapView() && (
                <MenuItem
                    dense
                    active={activeType === MAP}
                    label={i18n.t('View as Map')}
                    onClick={onViewMap}
                    icon={<MapIcon style={iconFill} />}
                />
            )}
        </>
    );

    return pluginIsAvailable(item, visualization) ? (
        <>
            <Button small secondary onClick={handleMenuClick}>
                <ThreeDots />
            </Button>
            <Popover
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorEl={anchorEl}
            >
                <Menu>
                    {canViewAs && (
                        <>
                            <ViewAsMenuItems />
                            <Divider />
                        </>
                    )}
                    <MenuItem
                        dense
                        icon={<LaunchIcon style={{ fill: '#6e7a8a' }} />}
                        label={i18n.t('Open in {{appName}} app', {
                            appName: getAppName(item.type),
                        })}
                        href={getLink(item, d2)}
                        target="_blank"
                    />
                    <MenuItem
                        dense
                        icon={<SpeechBubble />}
                        label={interpretationMenuLabel}
                        onClick={handleInterpretationClick}
                    />
                </Menu>
            </Popover>
        </>
    ) : null;
};

ItemHeaderButtons.propTypes = {
    activeFooter: PropTypes.bool,
    activeType: PropTypes.string,
    d2: PropTypes.object,
    item: PropTypes.object,
    visualization: PropTypes.object,
    onSelectActiveType: PropTypes.func,
    onToggleFooter: PropTypes.func,
};

export default ItemHeaderButtons;
