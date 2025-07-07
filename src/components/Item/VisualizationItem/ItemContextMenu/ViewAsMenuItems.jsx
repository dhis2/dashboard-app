import { VIS_TYPE_OUTLIER_TABLE } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { IconVisualizationColumn16, IconTable16, IconWorld16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    CHART,
    MAP,
    REPORT_TABLE,
    EVENT_CHART,
    EVENT_REPORT,
    EVENT_VISUALIZATION,
    isTrackerDomainType,
    hasMapView,
} from '../../../../modules/itemTypes.js'
import MenuItem from '../../../MenuItemWithTooltip.jsx'
import getThematicMapViews from '../getThematicMapViews.js'

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

    const notSupported =
        (type === MAP && !getThematicMapViews(visualization)) ||
        (type === CHART && visualization.type === VIS_TYPE_OUTLIER_TABLE)

    const getNotSupportedMessage = (viewAs) => {
        if (type === MAP && !getThematicMapViews(visualization)) {
            return viewAs === 'chart'
                ? i18n.t("This map can't be displayed as a chart")
                : i18n.t("This map can't be displayed as a pivot table")
        }

        if (type === CHART && visualization.type === VIS_TYPE_OUTLIER_TABLE) {
            return viewAs === 'table'
                ? i18n.t(
                      "This visualization can't be displayed as a pivot table"
                  )
                : i18n.t("This visualization can't be displayed as a map")
        }

        return null
    }

    return (
        <>
            {![CHART, EVENT_CHART].includes(activeType) && (
                <MenuItem
                    tooltip={getNotSupportedMessage('chart')}
                    label={i18n.t('View as Chart')}
                    onClick={onViewChart}
                    disabled={notSupported}
                    icon={<IconVisualizationColumn16 />}
                />
            )}
            {![REPORT_TABLE, EVENT_REPORT, EVENT_VISUALIZATION].includes(
                activeType
            ) && (
                <MenuItem
                    tooltip={getNotSupportedMessage('table')}
                    label={i18n.t('View as Pivot table')}
                    onClick={onViewTable}
                    disabled={notSupported}
                    icon={<IconTable16 />}
                />
            )}
            {hasMapView(type) && activeType !== MAP && (
                <MenuItem
                    tooltip={getNotSupportedMessage('map')}
                    label={i18n.t('View as Map')}
                    onClick={onViewMap}
                    disabled={notSupported}
                    icon={<IconWorld16 />}
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
