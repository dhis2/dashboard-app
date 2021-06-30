import i18n from '@dhis2/d2-i18n'
import {
    MenuItem,
    Tooltip,
    colors,
    IconVisualizationColumn16,
    IconTable16,
    IconWorld16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    CHART,
    MAP,
    REPORT_TABLE,
    EVENT_CHART,
    EVENT_REPORT,
    isTrackerDomainType,
    hasMapView,
} from '../../../../modules/itemTypes'
import getThematicMapViews from '../getThematicMapViews'

const ViewAsMenuItems = ({
    type,
    activeType,
    visualization,
    onActiveTypeChanged,
}) => {
    const isTrackerType = isTrackerDomainType(type)

    const onViewTable = () =>
        onActiveTypeChanged(isTrackerType ? EVENT_REPORT : REPORT_TABLE)

    const onViewChart = () =>
        onActiveTypeChanged(isTrackerType ? EVENT_CHART : CHART)

    const onViewMap = () => onActiveTypeChanged(MAP)

    const isDisabled = type === MAP && !getThematicMapViews(visualization)

    const iconColor = isDisabled ? colors.grey500 : colors.grey600

    const ViewAsChartMenuItem = () => {
        const ChartMenuItem = () => (
            <MenuItem
                dense
                disabled={isDisabled}
                label={i18n.t('View as Chart')}
                onClick={onViewChart}
                icon={<IconVisualizationColumn16 color={iconColor} />}
            />
        )

        if (isDisabled) {
            return (
                <Tooltip
                    content={i18n.t("This map can't be displayed as a chart")}
                >
                    <ChartMenuItem />
                </Tooltip>
            )
        }

        return <ChartMenuItem />
    }

    const ViewAsTableMenuItem = () => {
        const TableMenuItem = () => (
            <MenuItem
                dense
                disabled={isDisabled}
                label={i18n.t('View as Table')}
                onClick={onViewTable}
                icon={<IconTable16 color={iconColor} />}
            />
        )

        if (isDisabled) {
            return (
                <Tooltip
                    content={i18n.t("This map can't be displayed as a table")}
                >
                    <TableMenuItem />
                </Tooltip>
            )
        }

        return <TableMenuItem />
    }

    return (
        <>
            {activeType !== CHART && activeType !== EVENT_CHART && (
                <ViewAsChartMenuItem />
            )}
            {activeType !== REPORT_TABLE && activeType !== EVENT_REPORT && (
                <ViewAsTableMenuItem />
            )}
            {hasMapView(type) && activeType !== MAP && (
                <MenuItem
                    dense
                    label={i18n.t('View as Map')}
                    onClick={onViewMap}
                    icon={<IconWorld16 color={colors.grey600} />}
                />
            )}
        </>
    )
}

ViewAsMenuItems.propTypes = {
    activeType: PropTypes.string,
    type: PropTypes.string,
    visualization: PropTypes.object,
    onActiveTypeChanged: PropTypes.func,
}

export default ViewAsMenuItems
