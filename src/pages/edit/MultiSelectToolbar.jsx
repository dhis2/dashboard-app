import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/ItemGrid.module.css'

const MultiSelectToolbar = ({
    count,
    isEqualHeight,
    onSetSameHeight,
    onClear,
}) => (
    <div
        className={classes.multiSelectToolbar}
        data-test="multi-select-toolbar"
    >
        <span className={classes.multiSelectCount}>
            {i18n.t('{{count}} items selected', {
                count,
                defaultValue: '{{count}} item selected',
                defaultValue_plural: '{{count}} items selected',
            })}
        </span>
        {isEqualHeight && (
            <span className={classes.multiSelectHint}>
                {i18n.t(
                    'Drag the bottom edge of any selected item to resize them together'
                )}
            </span>
        )}
        <div className={classes.multiSelectActions}>
            <ButtonStrip>
                {!isEqualHeight && (
                    <Button
                        small
                        primary
                        onClick={onSetSameHeight}
                        dataTest="multi-select-set-same-height"
                    >
                        {i18n.t('Set same height')}
                    </Button>
                )}
                <Button
                    small
                    secondary
                    onClick={onClear}
                    dataTest="multi-select-clear"
                >
                    {i18n.t('Clear selection')}
                </Button>
            </ButtonStrip>
        </div>
    </div>
)

MultiSelectToolbar.propTypes = {
    count: PropTypes.number.isRequired,
    isEqualHeight: PropTypes.bool,
    onClear: PropTypes.func,
    onSetSameHeight: PropTypes.func,
}

export default MultiSelectToolbar
