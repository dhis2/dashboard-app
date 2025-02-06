import { useDataEngine, useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { apiGetDataStatistics } from '../../api/dataStatistics.js'
import DashboardLink from './DashboardLink.jsx'
import styles from './styles/StartScreen.module.css'

const StartScreen = ({ username }) => {
    const [mostViewedDashboards, setMostViewedDashboards] = useState([])
    const dataEngine = useDataEngine()
    const { isConnected: online } = useDhis2ConnectionStatus()

    useEffect(() => {
        async function populateMostViewedDashboards(dataEngine) {
            const mostViewedDashboardsResult = await apiGetDataStatistics(
                dataEngine,
                username
            )
            const dashboards = mostViewedDashboardsResult.dashboard

            if (dashboards && dashboards.length) {
                setMostViewedDashboards(dashboards)
            }
        }
        populateMostViewedDashboards(dataEngine)
    }, [username, online])

    const getContent = () => (
        <div data-test="start-screen">
            <div className={styles.section}>
                <h3 className={styles.title}>{i18n.t('Getting started')}</h3>
                <ul className={styles.guide}>
                    <li className={styles.guideItem}>
                        {i18n.t(
                            'Search for and open saved dashboards from the top bar.'
                        )}
                    </li>
                    <li className={styles.guideItem}>
                        {i18n.t(
                            'Click a dashboard chip to open it. Get back to this screen from the "More" menu.'
                        )}
                    </li>
                    <li className={styles.guideItem}>
                        {i18n.t('Create a new dashboard with the + button.')}
                    </li>
                </ul>
            </div>
            {mostViewedDashboards.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.title}>
                        {i18n.t('Your most viewed dashboards')}
                    </h3>
                    {mostViewedDashboards.map((dashboard, index) => (
                        <p key={index}>
                            <DashboardLink {...dashboard} />
                        </p>
                    ))}
                </div>
            )}
        </div>
    )

    return (
        <div className={styles.outer}>
            <div className={styles.inner}>{getContent()}</div>
        </div>
    )
}

StartScreen.propTypes = {
    username: PropTypes.string,
}

export default StartScreen
