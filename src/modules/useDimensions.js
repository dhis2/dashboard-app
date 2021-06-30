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
            !dimensions.length &&
            doFetch &&
            userSettings.keyAnalysisDisplayProperty
        ) {
            fetchDimensions()
        }
    }, [dimensions, doFetch, userSettings.keyAnalysisDisplayProperty])

    return dimensions
}

export default useDimensions
