import { OfflineTooltip } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    IconApps16,
    IconChevronDown16,
    IconEmptyFrame16,
    IconFileDocument16,
    IconLink16,
    IconMail16,
    IconTerminalWindow16,
    IconTextBox16,
    IconVisualizationColumn16,
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
    APP,
    MESSAGES,
    REPORTS,
    RESOURCES,
    SPACER,
    TEXT,
} from '../../modules/itemTypes.js'
import {
    sGetEditGridColumns,
    sGetItemConfigInsertPosition,
    sGetLayoutColumns,
} from '../../reducers/editDashboard.js'
import { InsertPositionIcon } from './assets/InsertPositionIcon.jsx'
import InlineButton from './InlineButton.jsx'
import ItemSelector from './ItemSelector/ItemSelector.jsx'
import { LayoutModal } from './LayoutModal.jsx'
import classes from './styles/AddItemsBar.module.css'
import UndoRedoButtons from './UndoRedoButtons.jsx'

// Labelled button, or (inline) icon-only with the label as tooltip + name
const AddButton = ({ inline, icon, label, onClick, disabled }) =>
    inline ? (
        <Tooltip content={label} openDelay={300} closeDelay={0}>
            <InlineButton
                icon={icon}
                aria-label={label}
                onClick={onClick}
                disabled={disabled}
            />
        </Tooltip>
    ) : (
        <InlineButton icon={icon} onClick={onClick} disabled={disabled}>
            {label}
        </InlineButton>
    )

AddButton.propTypes = {
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    inline: PropTypes.bool,
    onClick: PropTypes.func,
}

// inline: the middle section of the Split single bar — sits inside the
// toolbar, every add button but Visualizations (and Layout) is icon-only
const AddItemsBar = ({
    inline,
    columns,
    gridColumns,
    insertPosition,
    onAddMessages,
    onAddSpacer,
    onAddTextBox,
    onChangeInsertPosition,
    onSaveLayout,
    onSetGridColumns,
}) => {
    const { isDisconnected: offline } = useDhis2ConnectionStatus()
    const [showLayoutModal, setShowLayoutModal] = useState(false)
    const iconOnly = inline
    // Layout opens as a dropdown under its button
    const layoutButtonRef = useRef(null)

    return (
        <div
            className={cx(classes.bar, { [classes.inline]: inline })}
            data-test="add-items-bar"
        >
            {/* Search for items to add */}
            {/* Today: undo/redo lead the toolbar */}
            {!inline && (
                <>
                    <div className={classes.group}>
                        <UndoRedoButtons />
                    </div>
                    <div className={classes.divider} />
                </>
            )}
            <div className={classes.searchGroup}>
                <ItemSelector
                    icon={<IconVisualizationColumn16 />}
                    label={i18n.t('Visualizations')}
                />
                <AddButton
                    inline={iconOnly}
                    icon={<IconTextBox16 />}
                    label={i18n.t('Text box')}
                    onClick={onAddTextBox}
                />
                <AddButton
                    inline={iconOnly}
                    icon={<IconEmptyFrame16 />}
                    label={i18n.t('Spacer')}
                    onClick={onAddSpacer}
                />
                <ItemSelector
                    compact
                    iconOnly={iconOnly}
                    types={[RESOURCES]}
                    icon={<IconLink16 />}
                    label={i18n.t('Resources')}
                />
                <ItemSelector
                    compact
                    iconOnly={iconOnly}
                    types={[REPORTS]}
                    icon={<IconFileDocument16 />}
                    label={i18n.t('Reports')}
                />
                <ItemSelector
                    compact
                    hideIfEmpty
                    iconOnly={iconOnly}
                    types={[APP]}
                    icon={<IconTerminalWindow16 />}
                    label={i18n.t('Plugins')}
                />
                <AddButton
                    inline={iconOnly}
                    icon={<IconMail16 />}
                    label={i18n.t('Messages')}
                    onClick={onAddMessages}
                />
            </div>

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
                            {i18n.t('Layout')}
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
                            <InsertPositionIcon key="i" />,
                            i18n.t('New items go to the start'),
                        ],
                        [
                            'END',
                            <InsertPositionIcon key="i" end />,
                            i18n.t('New items go to the end'),
                        ],
                    ].map(([value, icon, label]) => (
                        <Tooltip
                            key={value}
                            content={label}
                            openDelay={300}
                            closeDelay={0}
                        >
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

AddItemsBar.propTypes = {
    onAddMessages: PropTypes.func.isRequired,
    onAddSpacer: PropTypes.func.isRequired,
    onAddTextBox: PropTypes.func.isRequired,
    onChangeInsertPosition: PropTypes.func.isRequired,
    onSaveLayout: PropTypes.func.isRequired,
    onSetGridColumns: PropTypes.func.isRequired,
    columns: PropTypes.array,
    gridColumns: PropTypes.number,
    inline: PropTypes.bool,
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
    onAddSpacer: () => (dispatch) =>
        dispatch(tSetDashboardItems({ type: SPACER, content: '' })),
    onAddTextBox: () => (dispatch) =>
        dispatch(tSetDashboardItems({ type: TEXT, content: '' })),
    onAddMessages: () => (dispatch) =>
        dispatch(tSetDashboardItems({ type: MESSAGES, content: 'true' })),
}

export default connect(mapStateToProps, mapDispatchToProps)(AddItemsBar)
