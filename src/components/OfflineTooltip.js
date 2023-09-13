import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Tooltip as UiTooltip } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/Tooltip.module.css'

const Tooltip = ({ disabledWhenOffline, disabled, content, children }) => {
    const { isDisconnected: offline } = useDhis2ConnectionStatus()

    const notAllowed = disabled || (disabledWhenOffline && offline)

    return (
        <UiTooltip
            content={content || i18n.t('Not available offline')}
            openDelay={200}
            closeDelay={100}
        >
            {({ onMouseOver, onMouseOut, ref }) => (
                <span
                    className={cx(
                        classes.span,
                        notAllowed && classes.notAllowed
                    )}
                    onMouseOver={() => notAllowed && onMouseOver()}
                    onMouseOut={() => notAllowed && onMouseOut()}
                    ref={ref}
                >
                    {children}
                </span>
            )}
        </UiTooltip>
    )
}

Tooltip.propTypes = {
    children: PropTypes.node,
    content: PropTypes.string,
    disabled: PropTypes.bool,
    disabledWhenOffline: PropTypes.bool,
}

Tooltip.defaultProps = {
    disabled: false,
    disabledWhenOffline: true,
}

export default Tooltip
