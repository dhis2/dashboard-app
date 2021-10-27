import { useDataEngine, useOnlineStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconDashboardWindow16, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGetDataStatistics } from '../../api/dataStatistics'
import styles from './styles/StartScreen.module.css'

const StartScreen = ({ username }) => {
    const [mostViewedDashboards, setMostViewedDashboards] = useState([])
    const dataEngine = useDataEngine()
    const { online } = useOnlineStatus()

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
        if (online) {
            populateMostViewedDashboards(dataEngine)
        }
    }, [username, online])

    const getContent = () => (
        <div data-test="start-screen">
            <div className={styles.section}>
                <h3
                    className={styles.title}
                    data-test="start-screen-primary-section-title"
                >
                    {i18n.t('Getting started')}
                </h3>
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
                    <h3
                        className={styles.title}
                        data-test="start-screen-secondary-section-title"
                    >
                        {i18n.t('Your most viewed dashboards')}
                    </h3>
                    {mostViewedDashboards.map((dashboard, index) => (
                        <p
                            key={index}
                            data-test="start-screen-most-viewed-list-item"
                        >
                            <Link
                                className={styles.dashboard}
                                to={`/${dashboard.id}`}
                                data-test="dashboard-chip"
                            >
                                <span className={styles.icon}>
                                    <IconDashboardWindow16
                                        color={colors.grey600}
                                    />
                                </span>
                                <span>{dashboard.name}</span>
                            </Link>
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
