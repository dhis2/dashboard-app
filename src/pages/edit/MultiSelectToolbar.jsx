import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, IconCross16, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/ItemGrid.module.css'

const MultiSelectToolbar = ({
    count,
    isEqualHeight,
    canSwap,
    onSetSameHeight,
    onSwapPositions,
    onDelete,
    onClear,
}) => (
    <div
        className={classes.multiSelectToolbar}
        data-test="multi-select-toolbar"
    >
        <span className={classes.multiSelectCount}>
            {i18n.t('{{count}} selected', {
                count,
                defaultValue: '{{count}} selected',
                defaultValue_plural: '{{count}} selected',
            })}
        </span>
        <div className={classes.multiSelectActions}>
            <ButtonStrip>
                {canSwap && (
                    <Button
                        small
                        onClick={onSwapPositions}
                        dataTest="multi-select-swap-positions"
                    >
                        {i18n.t('Swap positions')}
                    </Button>
                )}
                {!isEqualHeight && (
                    <Button
                        small
                        onClick={onSetSameHeight}
                        dataTest="multi-select-set-same-height"
                    >
                        {i18n.t('Set same height')}
                    </Button>
                )}
                <Button
                    small
                    destructive
                    onClick={onDelete}
                    dataTest="multi-select-delete"
                >
                    {i18n.t('Delete')}
                </Button>
            </ButtonStrip>
        </div>
        <button
            type="button"
            className={classes.multiSelectClose}
            onClick={onClear}
            aria-label={i18n.t('Clear selection')}
            data-test="multi-select-clear"
        >
            <IconCross16 color={colors.grey700} />
        </button>
    </div>
)

MultiSelectToolbar.propTypes = {
    count: PropTypes.number.isRequired,
    canSwap: PropTypes.bool,
    isEqualHeight: PropTypes.bool,
    onClear: PropTypes.func,
    onDelete: PropTypes.func,
    onSetSameHeight: PropTypes.func,
    onSwapPositions: PropTypes.func,
}

export default MultiSelectToolbar
