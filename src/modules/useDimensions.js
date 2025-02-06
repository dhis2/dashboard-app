import { apiFetchDimensions } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetDimensions } from '../actions/dimensions.js'
import { useUserSettings } from '../components/UserSettingsProvider.jsx'
import getFilteredDimensions from './getFilteredDimensions.js'

const useDimensions = (doFetch) => {
    const dataEngine = useDataEngine()
    const { userSettings } = useUserSettings()
    const dimensions = useSelector((state) => state.dimensions)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchDimensions = async () => {
            try {
                const unfilteredDimensions = await apiFetchDimensions(
                    dataEngine,
                    userSettings.displayProperty
                )

                dispatch(
                    acSetDimensions(getFilteredDimensions(unfilteredDimensions))
                )
            } catch (e) {
                console.error(e)
            }
        }

        if (!dimensions.length && doFetch && userSettings.displayProperty) {
            fetchDimensions()
        }
    }, [
        dimensions,
        doFetch,
        userSettings.displayProperty,
        dispatch,
        dataEngine,
    ])

    return dimensions
}

export default useDimensions
