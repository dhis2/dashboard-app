import { OfflineTooltip } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    IconApps16,
    IconEmptyFrame16,
    IconFileDocument16,
    IconLink16,
    IconMail16,
    IconTerminalWindow16,
    IconTextBox16,
    IconVisualizationColumn16,
    SegmentedControl,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
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
import InlineButton from './InlineButton.jsx'
import ItemSelector from './ItemSelector/ItemSelector.jsx'
import { LayoutModal } from './LayoutModal.jsx'
import classes from './styles/AddItemsBar.module.css'

const AddItemsBar = ({
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

    return (
        <div className={classes.bar} data-test="add-items-bar">
            {/* Search for items to add */}
            <div className={classes.searchGroup}>
                <ItemSelector
                    icon={<IconVisualizationColumn16 />}
                    label={i18n.t('Visualizations')}
                />
                <InlineButton
                    icon={<IconTextBox16 />}
                    onClick={onAddTextBox}
                >
                    {i18n.t('Text box')}
                </InlineButton>
                <InlineButton
                    icon={<IconEmptyFrame16 />}
                    onClick={onAddSpacer}
                >
                    {i18n.t('Spacer')}
                </InlineButton>
                <ItemSelector
                    compact
                    types={[RESOURCES]}
                    icon={<IconLink16 />}
                    label={i18n.t('Resources')}
                />
                <ItemSelector
                    compact
                    types={[REPORTS]}
                    icon={<IconFileDocument16 />}
                    label={i18n.t('Reports')}
                />
                <ItemSelector
                    compact
                    hideIfEmpty
                    types={[APP]}
                    icon={<IconTerminalWindow16 />}
                    label={i18n.t('Plugins')}
                />
                <InlineButton
                    icon={<IconMail16 />}
                    onClick={onAddMessages}
                >
                    {i18n.t('Messages')}
                </InlineButton>
            </div>

            <div className={classes.divider} />

            <div className={classes.group}>
                <OfflineTooltip>
                    <InlineButton
                        icon={<IconApps16 />}
                        disabled={offline}
                        onClick={() => setShowLayoutModal(true)}
                    >
                        {i18n.t('Layout')}
                    </InlineButton>
                </OfflineTooltip>
                <SegmentedControl
                    ariaLabel={i18n.t('Where to add new items')}
                    dataTest="add-position-control"
                    options={[
                        {
                            label: i18n.t('Add to start'),
                            value: 'START',
                        },
                        {
                            label: i18n.t('Add to end'),
                            value: 'END',
                        },
                    ]}
                    selected={insertPosition}
                    onChange={({ value }) => onChangeInsertPosition(value)}
                />
            </div>

            {showLayoutModal && (
                <LayoutModal
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
