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
import MenuItem from '../../../MenuItemWithTooltip.js'
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

    const notSupported = type === MAP && !getThematicMapViews(visualization)

    return (
        <>
            {![CHART, EVENT_CHART].includes(activeType) && (
                <MenuItem
                    tooltip={
                        notSupported
                            ? i18n.t("This map can't be displayed as a chart")
                            : null
                    }
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
                    tooltip={
                        notSupported
                            ? i18n.t("This map can't be displayed as a table")
                            : null
                    }
                    label={i18n.t('View as Table')}
                    onClick={onViewTable}
                    disabled={notSupported}
                    icon={<IconTable16 />}
                />
            )}
            {hasMapView(type) && activeType !== MAP && (
                <MenuItem
                    label={i18n.t('View as Map')}
                    onClick={onViewMap}
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
