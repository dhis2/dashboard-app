import React from 'react'

/* eslint-disable react/prop-types */
const isSingleValue = () => false
const isYearOverYear = () => false
const getAdaptedUiLayoutByType = () => ({})
const apiFetchDimensions = Function.prototype
const visTypeIcons = () => []

const getDimensionById = (id) => {
    const dims = {
        pe: {
            id: DIMENSION_ID_PERIOD,
            name: 'Period',
            iconName: 'PeriodIcon',
            icon: <div className="pe-icon" />,
        },
        ou: {
            id: DIMENSION_ID_ORGUNIT,
            name: 'Organisation unit',
            iconName: 'OrgUnitIcon',
            icon: <div className="ou-icon" />,
        },
    }
    return dims[id]
}

const PeriodDimension = function Mock({ children, ...props }) {
    return (
        <div className="analytics-periodDimension" {...props}>
            {children}
        </div>
    )
}
const OrgUnitDimension = function Mock({ children, ...props }) {
    return (
        <div className="ui-orgUnitDimension" {...props}>
            {children}
        </div>
    )
}
const DynamicDimension = function Mock({ children, ...props }) {
    return (
        <div className="ui-dynamicDimension" {...props}>
            {children}
        </div>
    )
}
const DimensionsPanel = function Mock({ children, ...props }) {
    return (
        <div className="ui-dimensionsPanel" {...props}>
            {children}
        </div>
    )
}
const DIMENSION_ID_DATA = 'dx'
const DIMENSION_ID_PERIOD = 'pe'
const DIMENSION_ID_ORGUNIT = 'ou'

const DAILY = 'DAILY'
const WEEKLY = 'WEEKLY'
const WEEKLYWED = 'WEEKLYWED'
const WEEKLYTHU = 'WEEKLYTHU'
const WEEKLYSAT = 'WEEKLYSAT'
const WEEKLYSUN = 'WEEKLYSUN'
const BIWEEKLY = 'BIWEEKLY'
const MONTHLY = 'MONTHLY'
const BIMONTHLY = 'BIMONTHLY'

const VIS_TYPE_GAUGE = 'GAUGE'
const VIS_TYPE_PIE = 'PIE'
const VIS_TYPE_PIVOT_TABLE = 'PIVOT_TABLE'
const VIS_TYPE_COLUMN = 'COLUMN'

const AXIS_ID_COLUMNS = 'columns'
const AXIS_ID_ROWS = 'rows'
const AXIS_ID_FILTERS = 'filters'

export {
    DIMENSION_ID_DATA,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
    DAILY,
    WEEKLY,
    WEEKLYWED,
    WEEKLYTHU,
    WEEKLYSAT,
    WEEKLYSUN,
    BIWEEKLY,
    MONTHLY,
    BIMONTHLY,
    VIS_TYPE_GAUGE,
    VIS_TYPE_PIE,
    VIS_TYPE_PIVOT_TABLE,
    VIS_TYPE_COLUMN,
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    DimensionsPanel,
    OrgUnitDimension,
    DynamicDimension,
    PeriodDimension,
    isSingleValue,
    isYearOverYear,
    getAdaptedUiLayoutByType,
    apiFetchDimensions,
    visTypeIcons,
    getDimensionById,
}

/* eslint-enable react/prop-types */
