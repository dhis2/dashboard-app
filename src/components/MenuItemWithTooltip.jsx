import { OfflineTooltip } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const MenuItemWithTooltip = ({
    disabledWhenOffline,
    tooltip,
    label,
    disabled,
    ...rest
}) => {
    const { isDisconnected: offline } = useDhis2ConnectionStatus()

    const tooltipContent =
        disabledWhenOffline && offline
            ? i18n.t('Not available offline')
            : tooltip

    const notAllowed = disabled || (disabledWhenOffline && offline)

    return (
        <MenuItem
            dense
            disabled={notAllowed}
            label={
                <OfflineTooltip
                    content={tooltipContent}
                    disabled={disabled}
                    disabledWhenOffline={disabledWhenOffline}
                >
                    {label}
                </OfflineTooltip>
            }
            {...rest}
        />
    )
}

MenuItemWithTooltip.propTypes = {
    disabled: PropTypes.bool,
    disabledWhenOffline: PropTypes.bool,
    label: PropTypes.string,
    tooltip: PropTypes.string,
}

MenuItemWithTooltip.defaultProps = {
    disabled: false,
    disabledWhenOffline: true,
    tooltip: '',
}

export default MenuItemWithTooltip
