import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Tooltip } from '@dhis2/ui'
import { ChevronDown, ChevronUp } from './assets/icons'

import classes from './styles/ShowMoreButton.module.css'

export const SHOWMORE_BAR_HEIGHT = 16

const ShowMoreButton = ({ onClick, isMaxHeight, disabled }) => {
    const containerRef = useRef(null)
    const buttonLabel = isMaxHeight
        ? i18n.t('Show fewer dashboards')
        : i18n.t('Show more dashboards')

    const onButtonClicked = () => {
        // The click may happen on the button svg or path
        // element. This triggers the mouseout on the button
        // element to ensure that the tooltip is removed
        const buttonEl = containerRef.current.children[0]
        const event = new MouseEvent('mouseout', {
            bubbles: true,
            cancelable: false,
        })

        onClick()
        buttonEl.dispatchEvent(event)
    }

    return (
        <div className={classes.container} ref={containerRef}>
            {disabled ? (
                <div className={classes.disabled}>
                    <ChevronDown />
                </div>
            ) : (
                <Tooltip content={buttonLabel} placement="bottom">
                    {({ onMouseOver, onMouseOut, ref }) => (
                        <button
                            className={classes.showMore}
                            onClick={onButtonClicked}
                            data-test="showmore-button"
                            aria-label={buttonLabel}
                            ref={ref}
                            onMouseOver={onMouseOver}
                            onMouseOut={onMouseOut}
                        >
                            {isMaxHeight ? <ChevronUp /> : <ChevronDown />}
                        </button>
                    )}
                </Tooltip>
            )}
        </div>
    )
}

ShowMoreButton.propTypes = {
    disabled: PropTypes.bool,
    isMaxHeight: PropTypes.bool,
    onClick: PropTypes.func,
}

export default ShowMoreButton
