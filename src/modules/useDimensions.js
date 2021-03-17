import { useState, useEffect } from 'react'
import {
    apiFetchDimensions,
    getDimensionById,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'

import getFilteredDimensions from './getFilteredDimensions'
import { useUserSettings } from '../components/UserSettingsProvider'

const PE_OU_DIMENSIONS = [
    getDimensionById(DIMENSION_ID_PERIOD),
    getDimensionById(DIMENSION_ID_ORGUNIT),
]

let theDimensions = []

const useDimensions = (open = true) => {
    const [dimensions, setDimensions] = useState(theDimensions) // eslint-disable-line
    const dataEngine = useDataEngine()
    const { userSettings } = useUserSettings()

    useEffect(() => {
        const fetchDimensions = async () => {
            try {
                const unfilteredDimensions = await apiFetchDimensions(
                    dataEngine,
                    userSettings.keyAnalysisDisplayProperty
                )

                theDimensions = PE_OU_DIMENSIONS.concat(
                    getFilteredDimensions(unfilteredDimensions)
                )

                setDimensions(theDimensions)
            } catch (e) {
                console.error(e)
            }
        }

        if (
            userSettings.keyAnalysisDisplayProperty &&
            open === true &&
            !theDimensions.length
        ) {
            fetchDimensions()
        }
    }, [userSettings, open, theDimensions])

    return theDimensions
}

export default useDimensions
