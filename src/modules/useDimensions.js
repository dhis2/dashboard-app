import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetDimensions } from '../actions/dimensions'
import { apiFetchDimensions } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'

import getFilteredDimensions from './getFilteredDimensions'
import { useUserSettings } from '../components/UserSettingsProvider'

const useDimensions = doFetch => {
    const dataEngine = useDataEngine()
    const { keyAnalysisDisplayProperty } = useUserSettings().userSettings
    const dimensions = useSelector(state => state.dimensions)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchDimensions = async () => {
            try {
                const unfilteredDimensions = await apiFetchDimensions(
                    dataEngine,
                    keyAnalysisDisplayProperty
                )

                dispatch(
                    acSetDimensions(getFilteredDimensions(unfilteredDimensions))
                )
            } catch (e) {
                console.error(e)
            }
        }

        if (!dimensions.length && doFetch && keyAnalysisDisplayProperty) {
            fetchDimensions()
        }
    }, [dimensions, doFetch, keyAnalysisDisplayProperty])

    return dimensions
}

export default useDimensions
