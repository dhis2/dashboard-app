import { OfflineTooltip } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    IconApps16,
    IconArrowDown16,
    IconArrowUp16,
    IconChevronDown16,
    Tooltip,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { connect } from 'react-redux'
import {
    acSetItemConfigInsertPosition,
    acSetLayoutColumns,
    tSetDashboardItems,
    tSetEditGridColumns,
} from '../../actions/editDashboard.js'
import {
    sGetEditGridColumns,
    sGetItemConfigInsertPosition,
    sGetLayoutColumns,
} from '../../reducers/editDashboard.js'
import InlineButton from './InlineButton.jsx'
import AddItemPalette from './ItemSelector/AddItemPalette.jsx'
import { LayoutModal } from './LayoutModal.jsx'
import classes from './styles/OneBarAddTools.module.css'

const OneBarAddTools = ({
    columns,
    gridColumns,
    insertPosition,
    onChangeInsertPosition,
    onSaveLayout,
    onSetGridColumns,
}) => {
    const { isDisconnected: offline } = useDhis2ConnectionStatus()
    const [showLayoutModal, setShowLayoutModal] = useState(false)
    const layoutButtonRef = useRef(null)

    return (
        <div className={classes.bar} data-test="add-items-bar">
            <AddItemPalette />

            <div className={classes.divider} />

            <div className={classes.group}>
                <OfflineTooltip>
                    <span ref={layoutButtonRef}>
                        <InlineButton
                            icon={<IconApps16 />}
                            iconRight={<IconChevronDown16 />}
                            disabled={offline}
                            onClick={() => setShowLayoutModal(!showLayoutModal)}
                        >
                            {columns.length
                                ? i18n.t('Fixed · {{count}} columns', {
                                      count: columns.length,
                                  })
                                : i18n.t('Flexible')}
                        </InlineButton>
                    </span>
                </OfflineTooltip>
                <div
                    className={classes.positionToggle}
                    role="radiogroup"
                    aria-label={i18n.t('Where to add new items')}
                    data-test="add-position-control"
                >
                    {[
                        [
                            'START',
                            <IconArrowUp16 key="i" />,
                            i18n.t('New items go to the start'),
                        ],
                        [
                            'END',
                            <IconArrowDown16 key="i" />,
                            i18n.t('New items go to the end'),
                        ],
                    ].map(([value, icon, label]) => (
                        <Tooltip key={value} content={label}>
                            <button
                                type="button"
                                role="radio"
                                aria-checked={insertPosition === value}
                                aria-label={label}
                                className={cx(classes.positionOption, {
                                    [classes.positionOptionOn]:
                                        insertPosition === value,
                                })}
                                onClick={() => onChangeInsertPosition(value)}
                            >
                                {icon}
                            </button>
                        </Tooltip>
                    ))}
                </div>
            </div>

            {showLayoutModal && (
                <LayoutModal
                    anchor={layoutButtonRef}
                    onClose={() => setShowLayoutModal(false)}
                    columns={columns.length}
                    gridColumns={gridColumns}
                    onSaveLayout={onSaveLayout}
                    onSetGridColumns={onSetGridColumns}
                />
            )}
        </div>
    )
}

OneBarAddTools.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(OneBarAddTools)
