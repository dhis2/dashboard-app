import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { HeightIcon } from './GridUnitsPopup.jsx'
import { NumberField } from './SizeToolbar.jsx'
import classes from './styles/ItemGrid.module.css'

const MultiSelectToolbar = ({
    count,
    canEditHeight,
    canSetSameHeight,
    isEqualHeight,
    height,
    maxHeight,
    onSetHeight,
    onSetSameHeight,
    onDelete,
}) => (
    <div
        className={classes.multiSelectToolbar}
        data-test="multi-select-toolbar"
    >
        {canEditHeight && (
            <NumberField
                icon={<HeightIcon />}
                value={height}
                min={1}
                placeholder="–"
                nullBaseline={maxHeight}
                onCommit={onSetHeight}
            />
        )}
        <div className={classes.multiSelectActions}>
            <ButtonStrip>
                {canSetSameHeight && !isEqualHeight && (
                    <Button
                        small
                        secondary
                        onClick={onSetSameHeight}
                        dataTest="multi-select-set-same-height"
                    >
                        {i18n.t('Set same height')}
                    </Button>
                )}
                <Button
                    small
                    secondary
                    destructive
                    onClick={onDelete}
                    dataTest="multi-select-delete"
                >
                    {i18n.t('Remove {{count}} items', { count })}
                </Button>
            </ButtonStrip>
        </div>
    </div>
)

MultiSelectToolbar.propTypes = {
    count: PropTypes.number.isRequired,
    canEditHeight: PropTypes.bool,
    canSetSameHeight: PropTypes.bool,
    height: PropTypes.number,
    isEqualHeight: PropTypes.bool,
    maxHeight: PropTypes.number,
    onDelete: PropTypes.func,
    onSetHeight: PropTypes.func,
    onSetSameHeight: PropTypes.func,
}

export default MultiSelectToolbar
