import { useOnlineStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/ButtonWithTooltip.module.css'

const ButtonWithTooltip = ({
    disabledWhenOffline,
    tooltip,
    children,
    ...rest
}) => {
    const { online } = useOnlineStatus()

    const notAllowed = disabledWhenOffline && !online

    return (
        <Tooltip
            content={tooltip || i18n.t('Not available offline')}
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
                    <Button disabled={notAllowed} {...rest}>
                        {children}
                    </Button>
                </span>
            )}
        </Tooltip>
    )
}

ButtonWithTooltip.propTypes = {
    children: PropTypes.node,
    disabledWhenOffline: PropTypes.bool,
    tooltip: PropTypes.string,
}

ButtonWithTooltip.defaultProps = {
    disabledWhenOffline: true,
}

export default ButtonWithTooltip
