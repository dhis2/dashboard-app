import i18n from '@dhis2/d2-i18n'
import { Tooltip, IconChevronDown24, IconChevronUp24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
// import { IconChevronDown24, ChevronUp } from './assets/icons.js'
import classes from './styles/ShowMoreButton.module.css'

const ShowMoreButton = ({ onClick, dashboardBarIsExpanded, disabled }) => {
    const containerRef = useRef(null)
    const buttonLabel = dashboardBarIsExpanded
        ? i18n.t('Show fewer dashboards')
        : i18n.t('Show more dashboards')

    const onButtonClicked = () => {
        // The click may happen on the svg or path
        // element of the button icon.
        // In that case it is necessary to trigger
        // the mouseout on the button element
        // to ensure that the tooltip is removed
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
                    <IconChevronDown24 />
                </div>
            ) : (
                <Tooltip
                    content={buttonLabel}
                    placement="top"
                    openDelay={800}
                    closeDelay={0}
                >
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
                            {dashboardBarIsExpanded ? (
                                <IconChevronUp24 />
                            ) : (
                                <IconChevronDown24 />
                            )}
                        </button>
                    )}
                </Tooltip>
            )}
        </div>
    )
}

ShowMoreButton.propTypes = {
    dashboardBarIsExpanded: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
}

export default ShowMoreButton
