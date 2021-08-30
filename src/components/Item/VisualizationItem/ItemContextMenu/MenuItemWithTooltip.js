import { useOnlineStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { MenuItem, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/MenuItemWithTooltip.module.css'

const MenuItemWithTooltip = ({
    disabledWhenOffline,
    tooltip,
    label,
    ...rest
}) => {
    const { offline } = useOnlineStatus()

    const tooltipContent =
        disabledWhenOffline && offline
            ? i18n.t('Not available offline')
            : tooltip

    const notAllowed = disabledWhenOffline && offline

    const getLabelWithTooltip = () => {
        return (
            <Tooltip content={tooltipContent} openDelay={200} closeDelay={100}>
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
                        {label}
                    </span>
                )}
            </Tooltip>
        )
    }

    return (
        <MenuItem
            dense
            disabled={notAllowed}
            label={getLabelWithTooltip()}
            {...rest}
        />
    )
}

MenuItemWithTooltip.propTypes = {
    disabledWhenOffline: PropTypes.bool,
    label: PropTypes.string,
    tooltip: PropTypes.string,
}

MenuItemWithTooltip.defaultProps = {
    disabledWhenOffline: true,
    tooltip: '',
}

export default MenuItemWithTooltip
