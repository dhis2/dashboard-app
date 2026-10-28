import i18n from '@dhis2/d2-i18n'
import {
    Button,
    IconAdd16,
    IconApps16,
    IconChevronLeft16,
    IconChevronRight16,
    IconSettings16,
    SegmentedControl,
    Tooltip,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import {
    acSetItemConfigInsertPosition,
    acSetLayoutColumns,
    tSetDashboardItems,
    tSetEditGridColumns,
} from '../../actions/editDashboard.js'
import {
    APP,
    EVENT_CHART,
    EVENT_REPORT,
    EVENT_VISUALIZATION,
    MAP,
    REPORTS,
    RESOURCES,
    VISUALIZATION,
} from '../../modules/itemTypes.js'
import {
    sGetEditGridColumns,
    sGetItemConfigInsertPosition,
    sGetLayoutColumns,
} from '../../reducers/editDashboard.js'
import { ItemSearch } from './ItemSelector/AddItemPalette.jsx'
import { LayoutModal } from './LayoutModal.jsx'
import { SettingsFields } from './SettingsDrawer.jsx'
import classes from './styles/BuildSidebar.module.css'

const TABS = [
    { value: 'add', label: i18n.t('Add'), icon: <IconAdd16 /> },
    { value: 'layout', label: i18n.t('Layout'), icon: <IconApps16 /> },
    { value: 'settings', label: i18n.t('Settings'), icon: <IconSettings16 /> },
]

// Type chips scope the search results; "All" also shows text box / spacer / messages
const CHIPS = [
    ['all', i18n.t('All'), null],
    ['vis', i18n.t('Charts & tables'), [VISUALIZATION]],
    ['maps', i18n.t('Maps'), [MAP]],
    ['ll', i18n.t('Line lists'), [EVENT_VISUALIZATION]],
    ['events', i18n.t('Event reports & charts'), [EVENT_REPORT, EVENT_CHART]],
    ['reports', i18n.t('Reports'), [REPORTS]],
    ['resources', i18n.t('Resources'), [RESOURCES]],
    ['apps', i18n.t('Plugins'), [APP]],
]

// Build sidebar variant: everything (add, layout, settings) lives here
const BuildSidebar = ({
    columns,
    gridColumns,
    insertPosition,
    settings,
    onChangeInsertPosition,
    onSaveLayout,
    onSetGridColumns,
}) => {
    const [tab, setTab] = useState('add')
    const [collapsed, setCollapsed] = useState(false)
    const [chip, setChip] = useState('all')
    // Remounting the inline layout form resets its draft (Cancel / after Save)
    const [layoutKey, setLayoutKey] = useState(0)

    const chipTypes = CHIPS.find(([key]) => key === chip)[2]
    const showType = useCallback(
        (type) => !chipTypes || chipTypes.includes(type),
        [chipTypes]
    )

    if (collapsed) {
        return (
            <aside className={cx(classes.sidebar, classes.collapsed)}>
                <Tooltip content={i18n.t('Expand panel')} placement="right">
                    <Button
                        small
                        secondary
                        icon={<IconChevronRight16 />}
                        onClick={() => setCollapsed(false)}
                        aria-label={i18n.t('Expand panel')}
                    />
                </Tooltip>
                {TABS.map((t) => (
                    <Tooltip key={t.value} content={t.label} placement="right">
                        <Button
                            small
                            secondary
                            icon={t.icon}
                            onClick={() => {
                                setTab(t.value)
                                setCollapsed(false)
                            }}
                            aria-label={t.label}
                        />
                    </Tooltip>
                ))}
            </aside>
        )
    }

    return (
        <aside
            className={classes.sidebar}
            aria-label={i18n.t('Build')}
            data-test="build-sidebar"
        >
            <div className={classes.header}>
                <div className={classes.tabs}>
                    <SegmentedControl
                        ariaLabel={i18n.t('Panel')}
                        options={TABS.map(({ value, label }) => ({
                            value,
                            label,
                        }))}
                        selected={tab}
                        onChange={({ value }) => setTab(value)}
                    />
                </div>
                <Tooltip content={i18n.t('Collapse panel')}>
                    <Button
                        small
                        secondary
                        icon={<IconChevronLeft16 />}
                        onClick={() => setCollapsed(true)}
                        aria-label={i18n.t('Collapse panel')}
                    />
                </Tooltip>
            </div>

            {tab === 'add' && (
                <>
                    <div className={classes.add}>
                        <ItemSearch showType={showType}>
                            <div
                                className={classes.chips}
                                role="radiogroup"
                                aria-label={i18n.t('Filter by type')}
                            >
                                {CHIPS.map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        role="radio"
                                        aria-checked={chip === key}
                                        className={cx(classes.chip, {
                                            [classes.chipOn]: chip === key,
                                        })}
                                        onClick={() => setChip(key)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </ItemSearch>
                    </div>
                    <div className={classes.footer}>
                        <span>{i18n.t('New items go to the')}</span>
                        <SegmentedControl
                            ariaLabel={i18n.t('Where to add new items')}
                            options={[
                                { label: i18n.t('Top'), value: 'START' },
                                { label: i18n.t('Bottom'), value: 'END' },
                            ]}
                            selected={insertPosition}
                            onChange={({ value }) =>
                                onChangeInsertPosition(value)
                            }
                        />
                    </div>
                </>
            )}

            {tab === 'layout' && (
                <div className={classes.scroll}>
                    <LayoutModal
                        inline
                        key={layoutKey}
                        columns={columns.length}
                        gridColumns={gridColumns}
                        onSaveLayout={onSaveLayout}
                        onSetGridColumns={onSetGridColumns}
                        onClose={() => setLayoutKey((k) => k + 1)}
                    />
                </div>
            )}

            {tab === 'settings' && (
                <div className={cx(classes.scroll, classes.settings)}>
                    <SettingsFields {...settings} />
                </div>
            )}
        </aside>
    )
}

BuildSidebar.propTypes = {
    settings: PropTypes.shape({
        onDelete: PropTypes.func.isRequired,
        onEditFilters: PropTypes.func.isRequired,
        onTranslate: PropTypes.func.isRequired,
        canDelete: PropTypes.bool,
        hasId: PropTypes.bool,
    }).isRequired,
    onChangeInsertPosition: PropTypes.func.isRequired,
    onSaveLayout: PropTypes.func.isRequired,
    onSetGridColumns: PropTypes.func.isRequired,
    columns: PropTypes.array,
    gridColumns: PropTypes.number,
    insertPosition: PropTypes.string,
}

const mapStateToProps = (state) => ({
    columns: sGetLayoutColumns(state),
    gridColumns: sGetEditGridColumns(state),
    insertPosition: sGetItemConfigInsertPosition(state) || 'END',
})

const mapDispatchToProps = {
    onSaveLayout: (columns) => (dispatch) => {
        dispatch(
            acSetLayoutColumns(
                [...Array(columns).keys()].map((i) => ({ index: i }))
            )
        )
        dispatch(tSetDashboardItems())
    },
    onSetGridColumns: tSetEditGridColumns,
    onChangeInsertPosition: acSetItemConfigInsertPosition,
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildSidebar)
