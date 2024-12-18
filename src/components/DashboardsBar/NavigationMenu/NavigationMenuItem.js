import { useDataEngine, useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import { IconStarFilled16, MenuItem, colors } from '@dhis2/ui'
import debounce from 'lodash/debounce.js'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { apiPostDataStatistics } from '../../../api/dataStatistics.js'
import { useCacheableSection } from '../../../modules/useCacheableSection.js'
import { sGetSelectedId } from '../../../reducers/selected.js'
import { IconOfflineSaved } from '../../IconOfflineSaved.js'
import styles from './styles/NavigationMenuItem.module.css'

export const NavigationMenuItem = ({
    close,
    displayName,
    id,
    starred,
    tabIndex,
}) => {
    const history = useHistory()
    const { lastUpdated } = useCacheableSection(id)
    const { isConnected } = useDhis2ConnectionStatus()
    const engine = useDataEngine()
    const selectedId = useSelector(sGetSelectedId)
    const handleClick = useCallback(() => {
        const debouncedPostStatistics = debounce(
            () => apiPostDataStatistics('DASHBOARD_VIEW', id, engine),
            500
        )

        history.push(`/${id}`)
        close()

        if (isConnected) {
            debouncedPostStatistics()
        }
    }, [close, engine, history, id, isConnected])

    return (
        <MenuItem
            dense
            tabIndex={tabIndex}
            onClick={handleClick}
            key={id}
            label={
                <span className={styles.container}>
                    {starred && (
                        <IconStarFilled16
                            dataTest="starred-dashboard"
                            color={colors.grey500}
                        />
                    )}
                    <span className={styles.displayName}>{displayName}</span>
                    {!!lastUpdated && <IconOfflineSaved />}
                </span>
            }
            ariaLabel={displayName}
            className={id === selectedId ? styles.selectedItem : undefined}
        />
    )
}

NavigationMenuItem.propTypes = {
    close: PropTypes.func.isRequired,
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    starred: PropTypes.bool,
    tabIndex: PropTypes.number,
}
