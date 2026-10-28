import { visTypeIcons } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconSearch16, Modal, colors } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { tSetDashboardItems } from '../../../actions/editDashboard.js'
import {
    APP,
    EVENT_CHART,
    EVENT_REPORT,
    EVENT_VISUALIZATION,
    MAP,
    MESSAGES,
    REPORTS,
    RESOURCES,
    SPACER,
    TEXT,
    VISUALIZATION,
    getDefaultItemCount,
    getItemIcon,
    itemTypeMap,
} from '../../../modules/itemTypes.js'
import useDebounce from '../../../modules/useDebounce.js'
import { tAddListItemContent } from './actions.js'
import { listItemTypes } from './selectableItems.js'
import classes from './styles/AddItemPalette.module.css'

const dashboardSearchQuery = {
    items: {
        resource: 'dashboards/search',
        params: ({ searchTerm = '', maxItems = [] }) => ({
            q: searchTerm,
            count: 11,
            max: maxItems,
        }),
    },
}

// Order in the palette: special items, visualizations, then everything else
const SPECIAL_ITEMS = [
    { type: TEXT, name: i18n.t('Text box'), content: '' },
    { type: SPACER, name: i18n.t('Spacer'), content: '' },
]
const VIS_GROUPS = [
    [VISUALIZATION, i18n.t('Charts and tables')],
    [MAP, i18n.t('Maps')],
    [EVENT_VISUALIZATION, i18n.t('Line lists')],
    [EVENT_REPORT, i18n.t('Event reports')],
    [EVENT_CHART, i18n.t('Event charts')],
]
const OTHER_GROUPS = [
    [RESOURCES, i18n.t('Resources')],
    [REPORTS, i18n.t('Reports')],
    [APP, i18n.t('Plugins')],
]
const OTHER_ITEMS = [
    { type: MESSAGES, name: i18n.t('Messages'), content: 'true' },
]

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)

const matches = (name, q) =>
    !q || name.toLowerCase().includes(q.trim().toLowerCase())

const rowIcon = (type, visType) => {
    const Icon =
        type === VISUALIZATION && visTypeIcons[visType]
            ? visTypeIcons[visType]
            : getItemIcon(type)
    return <Icon color={colors.grey600} />
}

const AddItemPalette = ({ onAddItem, onAddListItem }) => {
    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState('')
    const [active, setActive] = useState(0)
    const [expanded, setExpanded] = useState(new Set())
    const listRef = useRef(null)
    const searchTerm = useDebounce(filter, 350)
    const { data, refetch } = useDataQuery(dashboardSearchQuery, {
        lazy: true,
    })

    useEffect(() => {
        const onKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                setOpen(true)
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    useEffect(() => {
        if (open) {
            refetch({ searchTerm, maxItems: Array.from(expanded) })
        }
    }, [open, searchTerm, expanded, refetch])

    const close = () => {
        setOpen(false)
        setFilter('')
        setActive(0)
        setExpanded(new Set())
    }

    const add = (row) => {
        close()
        if (row.special) {
            return onAddItem({ type: row.type, content: row.special.content })
        }
        if (row.type === APP) {
            return onAddItem({ type: APP, content: row.item.key })
        }
        const content = {
            id: row.item.id,
            name: row.item.displayName || row.item.name,
        }
        listItemTypes.includes(row.type)
            ? onAddListItem(row.type, content)
            : onAddItem({ type: row.type, content })
    }

    const toggleMore = (type) => {
        const next = new Set(expanded)
        next.has(type) ? next.delete(type) : next.add(type)
        setExpanded(next)
    }

    // Flat list of headers + rows; rows are what the keyboard moves through
    const sections = []
    const special = (items, title) => {
        const rows = items
            .filter((s) => matches(s.name, filter))
            .map((s) => ({ type: s.type, name: s.name, special: s }))
        rows.length && sections.push({ title, rows })
    }
    const searched = (groups) =>
        groups.forEach(([type, title]) => {
            const all = data?.items?.[itemTypeMap[type].endPointName] || []
            if (!all.length) {
                return
            }
            const limit = getDefaultItemCount(type)
            const shown = expanded.has(type) ? all : all.slice(0, limit)
            const rows = shown.map((item) => ({
                type,
                item,
                name: item.displayName || item.name,
            }))
            if (all.length > limit) {
                rows.push({
                    type,
                    more: true,
                    name: expanded.has(type)
                        ? i18n.t('Show fewer')
                        : i18n.t('Show more'),
                })
            }
            sections.push({ title, rows })
        })
    special(SPECIAL_ITEMS, i18n.t('Special items'))
    searched(VIS_GROUPS)
    searched(OTHER_GROUPS)
    special(OTHER_ITEMS, i18n.t('Other'))

    const rows = sections.flatMap((s) => s.rows)
    const current = Math.min(active, Math.max(rows.length - 1, 0))

    useEffect(() => {
        listRef.current
            ?.querySelector('[aria-selected="true"]')
            ?.scrollIntoView({ block: 'nearest' })
    }, [current])

    const run = (row) => (row.more ? toggleMore(row.type) : add(row))

    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive(Math.min(current + 1, rows.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive(Math.max(current - 1, 0))
        } else if (e.key === 'Enter' && rows[current]) {
            e.preventDefault()
            run(rows[current])
        }
    }

    let index = -1

    return (
        <>
            <button
                type="button"
                className={classes.trigger}
                onClick={() => setOpen(true)}
                data-test="add-item-palette-trigger"
            >
                <IconSearch16 color={colors.grey600} />
                <span className={classes.triggerLabel}>
                    {i18n.t('Add item…')}
                </span>
                <kbd className={classes.kbd}>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
            {open && (
                <Modal
                    position="top"
                    onClose={close}
                    dataTest="add-item-palette"
                >
                    <div className={classes.palette}>
                        <div className={classes.searchRow}>
                            <IconSearch16 color={colors.grey600} />
                            <input
                                autoFocus
                                className={classes.input}
                                placeholder={i18n.t(
                                    'Search visualizations, maps, reports…'
                                )}
                                value={filter}
                                onChange={(e) => {
                                    setFilter(e.target.value)
                                    setActive(0)
                                }}
                                onKeyDown={onKeyDown}
                                aria-label={i18n.t('Search items to add')}
                            />
                        </div>
                        <div
                            className={classes.list}
                            ref={listRef}
                            role="listbox"
                        >
                            {sections.map((section) => (
                                <div key={section.title}>
                                    <div className={classes.header}>
                                        {section.title}
                                    </div>
                                    {section.rows.map((row) => {
                                        index += 1
                                        const i = index
                                        return (
                                            <button
                                                key={`${row.type}-${
                                                    row.item?.id ||
                                                    row.item?.key ||
                                                    row.name
                                                }`}
                                                type="button"
                                                role="option"
                                                aria-selected={i === current}
                                                className={cx(classes.row, {
                                                    [classes.active]:
                                                        i === current,
                                                    [classes.more]: row.more,
                                                })}
                                                onMouseMove={() =>
                                                    i !== current &&
                                                    setActive(i)
                                                }
                                                onClick={() => run(row)}
                                            >
                                                {!row.more &&
                                                    rowIcon(
                                                        row.type,
                                                        row.item?.type
                                                    )}
                                                <span>{row.name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            ))}
                            {!rows.length && (
                                <div className={classes.empty}>
                                    {i18n.t('No items found')}
                                </div>
                            )}
                        </div>
                        <div className={classes.footer}>
                            <span>{i18n.t('↑ ↓ to move')}</span>
                            <span>{i18n.t('Enter to add')}</span>
                            <span>{i18n.t('Esc to close')}</span>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}

AddItemPalette.propTypes = {
    onAddItem: PropTypes.func.isRequired,
    onAddListItem: PropTypes.func.isRequired,
}

export default connect(null, {
    onAddItem: (item) => (dispatch) => dispatch(tSetDashboardItems(item)),
    onAddListItem: tAddListItemContent,
})(AddItemPalette)
