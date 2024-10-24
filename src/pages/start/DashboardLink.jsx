import { IconDashboardWindow16, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { OfflineSaved } from '../../components/DashboardsBar/assets/icons.jsx'
import { useCacheableSection } from '../../modules/useCacheableSection.js'
import styles from './styles/DashboardLink.module.css'

const DashboardLink = ({ id, name }) => {
    const { isCached } = useCacheableSection(id)

    return (
        <Link className={styles.dashboard} to={`/${id}`}>
            <span className={styles.icon}>
                <IconDashboardWindow16 color={colors.grey600} />
            </span>
            <span>{name}</span>
            {isCached && <OfflineSaved className={styles.adornment} />}
        </Link>
    )
}

DashboardLink.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
}

export default DashboardLink
