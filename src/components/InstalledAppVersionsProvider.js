import { useCachedDataQuery } from '@dhis2/analytics'
import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useContext, useState, useEffect, createContext } from 'react'

export const InstalledAppVersionsCtx = createContext({})

const DV_APP_KEY = 'data-visualizer'
const LL_APP_KEY = 'line-listing'
const MAPS_APP_KEY = 'maps'

const InstalledAppVersionsProvider = ({ children }) => {
    const [appVersions, setAppVersions] = useState([])
    const { baseUrl } = useConfig()
    const { apps } = useCachedDataQuery()
    let bundledApps = []

    const findAppVersion = (appKey) =>
        apps.find((app) => app.key === appKey)?.version ||
        bundledApps.find((app) => app.name === appKey)?.version ||
        '0.0.0'

    useEffect(() => {
        async function fetchVersions() {
            const url = new URL(
                'dhis-web-apps/apps-bundle.json',
                baseUrl === '..'
                    ? window.location.href.split('dhis-web-dashboard/')[0]
                    : `${baseUrl}/`
            )

            try {
                const response = await fetch(url.href, {
                    credentials: 'include',
                })

                if (!response.ok) {
                    throw new Error('Unable to fetch bundled apps')
                } else {
                    bundledApps = await response.json()
                }
            } catch (error) {
                console.error(error)

                throw error
            }

            setAppVersions({
                dataVisualizerAppVersion: findAppVersion(DV_APP_KEY),
                lineListingAppVersion: findAppVersion(LL_APP_KEY),
                mapsAppVersion: findAppVersion(MAPS_APP_KEY),
            })
        }

        fetchVersions()
    }, [])

    return (
        <InstalledAppVersionsCtx.Provider value={appVersions}>
            {children}
        </InstalledAppVersionsCtx.Provider>
    )
}

InstalledAppVersionsProvider.propTypes = {
    children: PropTypes.node,
}

export default InstalledAppVersionsProvider

export const useInstalledAppVersions = () => useContext(InstalledAppVersionsCtx)
