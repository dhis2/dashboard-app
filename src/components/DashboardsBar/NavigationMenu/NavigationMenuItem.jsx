import { useDataEngine, useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconCross16, IconStarFilled16, MenuItem, colors } from '@dhis2/ui'
import debounce from 'lodash/debounce.js'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { apiPostDataStatistics } from '../../../api/dataStatistics.js'
import { useCacheableSection } from '../../../modules/useCacheableSection.js'
import { sGetSelectedId } from '../../../reducers/selected.js'
import { IconOfflineSaved } from '../../IconOfflineSaved.jsx'
import styles from './styles/NavigationMenuItem.module.css'

export const NavigationMenuItem = ({
    close,
    displayName,
    id,
    starred,
    onRemove,
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

    const handleRemove = useCallback(
        (event) => {
            event.stopPropagation()
            onRemove(id)
        },
        [id, onRemove]
    )

    return (
        <MenuItem
            dense
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
                    {/*
                        Known limitation: this button is focusable markup
                        inside role="menuitem", which ARIA forbids, and
                        MenuItem's ariaLabel flattens the subtree for name
                        computation, so this control's own label may not be
                        announced by screen readers. Not fixable from here
                        without changes to @dhis2/ui's MenuItem.
                    */}
                    {onRemove && (
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={handleRemove}
                            data-test="remove-recent-dashboard"
                            aria-label={i18n.t(
                                'Remove {{- name}} from Recent',
                                { name: displayName }
                            )}
                        >
                            <IconCross16 />
                        </button>
                    )}
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
    onRemove: PropTypes.func,
}
