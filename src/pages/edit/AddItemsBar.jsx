import { OfflineTooltip } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    IconApps16,
    IconEmptyFrame16,
    IconTextBox16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
    acSetLayoutColumns,
    tSetDashboardItems,
    tSetEditGridColumns,
} from '../../actions/editDashboard.js'
import { SPACER, TEXT } from '../../modules/itemTypes.js'
import {
    sGetLayoutColumns,
    sGetEditGridColumns,
} from '../../reducers/editDashboard.js'
import InlineButton from './InlineButton.jsx'
import ItemSelector from './ItemSelector/ItemSelector.jsx'
import { LayoutModal } from './LayoutModal.jsx'
import classes from './styles/AddItemsBar.module.css'

const AddItemsBar = ({
    columns,
    gridColumns,
    onAddSpacer,
    onAddTextBox,
    onSaveLayout,
    onSetGridColumns,
}) => {
    const { isDisconnected: offline } = useDhis2ConnectionStatus()
    const [showLayoutModal, setShowLayoutModal] = useState(false)

    return (
        <div className={classes.bar} data-test="add-items-bar">
            {/* Search for items to add */}
            <div className={classes.searchGroup}>
                <div className={classes.searchField}>
                    <ItemSelector />
                </div>
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
    onAddSpacer: PropTypes.func.isRequired,
    onAddTextBox: PropTypes.func.isRequired,
    onSaveLayout: PropTypes.func.isRequired,
    onSetGridColumns: PropTypes.func.isRequired,
    columns: PropTypes.array,
    gridColumns: PropTypes.number,
}

const mapStateToProps = (state) => ({
    columns: sGetLayoutColumns(state),
    gridColumns: sGetEditGridColumns(state),
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
    onAddSpacer: () => (dispatch) =>
        dispatch(tSetDashboardItems({ type: SPACER, content: '' })),
    onAddTextBox: () => (dispatch) =>
        dispatch(tSetDashboardItems({ type: TEXT, content: '' })),
}

export default connect(mapStateToProps, mapDispatchToProps)(AddItemsBar)
