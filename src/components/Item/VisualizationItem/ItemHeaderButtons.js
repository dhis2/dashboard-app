import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Popover from '@material-ui/core/Popover';
import { isSingleValue } from '@dhis2/analytics';
import { Button, Menu, MenuItem, Divider } from '@dhis2/ui-core';
import i18n from '@dhis2/d2-i18n';
import TableIcon from '@material-ui/icons/ViewList';
import ChartIcon from '@material-ui/icons/InsertChart';
import MapIcon from '@material-ui/icons/Public';
import LaunchIcon from '@material-ui/icons/Launch';

import { acRemoveDashboardItem } from '../../actions/editDashboard';
import DeleteItemButton from './DeleteItemButton';
import { ThreeDots, SpeechBubble } from './assets/icons';
import { pluginIsAvailable, getLink } from './VisualizationItem/plugin';
import {
    CHART,
    REPORT_TABLE,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    isTrackerDomainType,
    hasMapView,
    getAppName,
} from '../../modules/itemTypes';

import classes from './styles/ItemHeaderButtons.module.css';

const ItemHeaderButtons = props => {
    const [anchorEl, setAnchorEl] = useState(null);

    const {
        item,
        visualization,
        onSelectActiveType,
        d2,
        editMode,
        activeType,
        acRemoveDashboardItem,
    } = props;

    const onViewTable = () => {
        onSelectActiveType(
            isTrackerDomainType(item.type) ? EVENT_REPORT : REPORT_TABLE
        );
        handleClose();
    };

    const onViewChart = () => {
        onSelectActiveType(
            isTrackerDomainType(item.type) ? EVENT_CHART : CHART
        );
        handleClose();
    };

    const onViewMap = () => {
        onSelectActiveType(MAP);
        handleClose();
    };

    const itemHasTableView = () => {
        const type = visualization.type || item.type;
        return !type.match(/^YEAR_OVER_YEAR/);
    };

    const itemHasMapView = () => {
        const type = visualization.type || item.type;
        return hasMapView(item.type) && !type.match(/^YEAR_OVER_YEAR/);
    };

    const handleMenuClick = (_, event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleInterpretationClick = () => {
        props.onToggleFooter();
        if (anchorEl !== null) {
            handleClose();
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const canViewAs = !isSingleValue(props.visualization.type);

    const ViewAsMenuItems = () => (
        <>
            <MenuItem
                dense
                active={activeType === CHART}
                label={i18n.t('View as Chart')}
                onClick={onViewChart}
                icon={<ChartIcon />}
            />
            {itemHasTableView() && (
                <MenuItem
                    dense
                    active={[REPORT_TABLE, EVENT_REPORT].includes(activeType)}
                    label={i18n.t('View as Table')}
                    onClick={onViewTable}
                    icon={<TableIcon />}
                />
            )}
            {itemHasMapView() && (
                <MenuItem
                    dense
                    active={activeType === MAP}
                    label={i18n.t('View as Map')}
                    onClick={onViewMap}
                    icon={<MapIcon />}
                />
            )}
        </>
    );

    const ViewModeActions = () => (
        <>
            <Button
                small
                secondary
                active={props.activeFooter}
                onClick={handleInterpretationClick}
            >
                <SpeechBubble />
            </Button>
            <Button small secondary onClick={handleMenuClick}>
                <ThreeDots />
            </Button>
            <Popover
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                    horizontal: 'left',
                    vertical: 'bottom',
                }}
                transformOrigin={{
                    horizontal: 'left',
                    vertical: 'top',
                }}
                disableAutoFocus={true}
                disableRestoreFocus={true}
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
                        icon={<LaunchIcon />}
                        label={i18n.t(`View in ${getAppName(item.type)} app`)}
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
    );

    const handleDeleteItem = () => acRemoveDashboardItem(item.id);

    const interpretationMenuLabel = props.activeFooter
        ? i18n.t(`Hide interpretations and details`)
        : i18n.t(`View interpretations and details`);

    return (
        <>
            <div className={classes.itemActionsWrap}>
                {!editMode && pluginIsAvailable(item, visualization) && (
                    <ViewModeActions />
                )}
                {editMode && <DeleteItemButton onClick={handleDeleteItem} />}
            </div>
        </>
    );
};

ItemHeaderButtons.propTypes = {
    acRemoveDashboardItem: PropTypes.func,
    activeFooter: PropTypes.bool,
    activeType: PropTypes.string,
    d2: PropTypes.object,
    editMode: PropTypes.bool,
    item: PropTypes.object,
    visualization: PropTypes.object,
    onSelectActiveType: PropTypes.func,
    onToggleFooter: PropTypes.func,
};

const mapDispatchToProps = {
    acRemoveDashboardItem,
};

export default connect(
    null,
    mapDispatchToProps
)(ItemHeaderButtons);
