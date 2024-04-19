import { apiFetchDimensions } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetDimensions } from '../actions/dimensions'
import { useUserSettings } from '../components/UserSettingsProvider'
import getFilteredDimensions from './getFilteredDimensions'

const useDimensions = doFetch => {
    const dataEngine = useDataEngine()
    const { userSettings } = useUserSettings()
    const dimensions = useSelector(state => state.dimensions)
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
        dataEngine,
        dispatch,
    ])

    return dimensions
}

export default useDimensions
