import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Layer,
    Popper,
    FlyoutMenu,
    MenuItem,
    Divider,
    IconMore16,
    colors,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    acRemoveDashboardItem,
    acSetNewItemSize,
    tSetDashboardItems,
    tSetAllItemsSize,
    tDuplicateDashboardItem,
} from '../../../actions/editDashboard.js'
import { isVisualizationType } from '../../../modules/itemTypes.js'
import ChangeVisualizationModal from '../../../pages/edit/ChangeVisualizationModal.jsx'
import {
    sGetEditDashboardItems,
    sGetLayoutColumns,
} from '../../../reducers/editDashboard.js'
import classes from './styles/ItemHeader.module.css'

const noop = () => Promise.resolve()

const EditItemActions = ({ itemId, onDelete = noop }) => {
    const dispatch = useDispatch()
    const columns = useSelector(sGetLayoutColumns)
    const dashboardItems = useSelector(sGetEditDashboardItems)
    const [menuOpen, setMenuOpen] = useState(false)
    const [changeOpen, setChangeOpen] = useState(false)
    const buttonRef = useRef(null)

    const item = dashboardItems.find((it) => it.id === itemId)
    const canChangeVisualization = item && isVisualizationType(item)

    const onUseSizeForNewItems = () => {
        setMenuOpen(false)
        if (!item) {
            return
        }
        // Freeflow captures width + height; fixed captures height only
        // (width is column-driven). Values are canonical 60-unit shape coords.
        const mode = columns.length ? 'fixed' : 'freeflow'
        const size =
            mode === 'fixed' ? { h: item.h } : { w: item.w, h: item.h }
        dispatch(acSetNewItemSize({ mode, size }))
    }

    const onDeleteItem = (itemId) => {
        onDelete()
            .catch((e) => {
                console.warn('Error in the onRemove plugin callback', e)
            })
            .finally(() => {
                if (!columns.length || dashboardItems.length === 1) {
                    dispatch(acRemoveDashboardItem(itemId))
                } else {
                    dispatch(tSetDashboardItems(null, itemId))
                }
            })
    }

    return (
        <div className={cx(classes.itemActionsWrap, 'edit-item-actions', { 'menu-open': menuOpen })}>
            <span ref={buttonRef}>
                <Button
                    small
                    secondary
                    icon={<IconMore16 color={colors.grey700} />}
                    onClick={() => setMenuOpen(!menuOpen)}
                    dataTest="item-menu-button"
                />
            </span>
            {menuOpen && (
                <Layer onBackdropClick={() => setMenuOpen(false)}>
                    <Popper reference={buttonRef} placement="bottom-end">
                        <FlyoutMenu>
                            {canChangeVisualization && (
                                <MenuItem
                                    dense
                                    label={i18n.t('Change visualization')}
                                    onClick={() => {
                                        setMenuOpen(false)
                                        setChangeOpen(true)
                                    }}
                                    dataTest="change-visualization-button"
                                />
                            )}
                            <MenuItem
                                dense
                                label={i18n.t('Duplicate item')}
                                onClick={() => {
                                    setMenuOpen(false)
                                    dispatch(tDuplicateDashboardItem(itemId))
                                }}
                                dataTest="duplicate-item-button"
                            />
                            <Divider />
                            <MenuItem
                                dense
                                label={
                                    columns.length
                                        ? i18n.t('Use this height for new items')
                                        : i18n.t('Use this size for new items')
                                }
                                onClick={onUseSizeForNewItems}
                                dataTest="set-new-item-size-button"
                            />
                            <MenuItem
                                dense
                                label={
                                    columns.length
                                        ? i18n.t('Use this height for all items')
                                        : i18n.t('Use this size for all items')
                                }
                                onClick={() => {
                                    setMenuOpen(false)
                                    if (item) {
                                        dispatch(
                                            tSetAllItemsSize({
                                                w: item.w,
                                                h: item.h,
                                            })
                                        )
                                    }
                                }}
                                dataTest="set-all-items-size-button"
                            />
                            <Divider />
                            <MenuItem
                                dense
                                destructive
                                label={i18n.t('Delete')}
                                onClick={() => {
                                    setMenuOpen(false)
                                    onDeleteItem(itemId)
                                }}
                                dataTest="delete-item-button"
                            />
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
            {changeOpen && item && (
                <ChangeVisualizationModal
                    item={item}
                    onClose={() => setChangeOpen(false)}
                />
            )}
        </div>
    )
}

EditItemActions.propTypes = {
    itemId: PropTypes.string,
    onDelete: PropTypes.func,
}

export default EditItemActions
