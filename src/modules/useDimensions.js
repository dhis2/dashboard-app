import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetDimensions } from '../actions/dimensions'
import { apiFetchDimensions } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'

import getFilteredDimensions from './getFilteredDimensions'
import { useUserSettings } from '../components/UserSettingsProvider'

const useDimensions = (open = true) => {
    const dataEngine = useDataEngine()
    const { userSettings } = useUserSettings()
    const dimensions = useSelector(state => state.dimensions)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchDimensions = async () => {
            try {
                const unfilteredDimensions = await apiFetchDimensions(
                    dataEngine,
                    userSettings.keyAnalysisDisplayProperty
                )

                dispatch(
                    acSetDimensions(getFilteredDimensions(unfilteredDimensions))
                )
            } catch (e) {
                console.error(e)
            }
        }

        if (
            userSettings.keyAnalysisDisplayProperty &&
            open === true &&
            !dimensions.length
        ) {
            fetchDimensions()
        }
    }, [userSettings, open, dimensions])

    return dimensions
}

export default useDimensions
