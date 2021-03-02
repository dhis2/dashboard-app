import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import TableIcon from '@material-ui/icons/ViewList'
import ChartIcon from '@material-ui/icons/InsertChart'
import MapIcon from '@material-ui/icons/Public'
import {
    CHART,
    MAP,
    REPORT_TABLE,
    EVENT_CHART,
    EVENT_REPORT,
    isTrackerDomainType,
    hasMapView,
} from '../../../../modules/itemTypes'
import { MenuItem, colors } from '@dhis2/ui'

const iconFill = { fill: colors.grey600 }

const ViewAsMenuItems = ({ type, activeType, onActiveTypeChanged }) => {
    const isTrackerType = isTrackerDomainType(type)

    const onViewTable = () =>
        onActiveTypeChanged(isTrackerType ? EVENT_REPORT : REPORT_TABLE)

    const onViewChart = () =>
        onActiveTypeChanged(isTrackerType ? EVENT_CHART : CHART)

    const onViewMap = () => onActiveTypeChanged(MAP)

    return (
        <>
            {activeType !== CHART && activeType !== EVENT_CHART && (
                <MenuItem
                    dense
                    label={i18n.t('View as Chart')}
                    onClick={onViewChart}
                    icon={<ChartIcon style={iconFill} />}
                />
            )}
            {activeType !== REPORT_TABLE && activeType !== EVENT_REPORT && (
                <MenuItem
                    dense
                    label={i18n.t('View as Table')}
                    onClick={onViewTable}
                    icon={<TableIcon style={iconFill} />}
                />
            )}
            {hasMapView(type) && activeType !== MAP && (
                <MenuItem
                    dense
                    label={i18n.t('View as Map')}
                    onClick={onViewMap}
                    icon={<MapIcon style={iconFill} />}
                />
            )}
        </>
    )
}

ViewAsMenuItems.propTypes = {
    activeType: PropTypes.string,
    type: PropTypes.string,
    onActiveTypeChanged: PropTypes.func,
}

export default ViewAsMenuItems
