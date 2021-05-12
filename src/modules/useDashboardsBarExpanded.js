import { useState, useCallback } from 'react'

export const useDashboardsBarExpanded = initialState => {
    const [dashboardsBarExpanded, setDashboardsBarExpanded] = useState(
        initialState
    )

    const updateExpanded = useCallback(val => setDashboardsBarExpanded(val), [
        setDashboardsBarExpanded,
    ])

    return [dashboardsBarExpanded, updateExpanded]
}
