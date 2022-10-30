import i18n from '@dhis2/d2-i18n'
import { MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { OfflineTooltip } from '../online-status-fakes/FakeOfflineTooltip.js'
import { useOnlineStatus } from '../online-status-fakes/useFakeOnlineStatus.js'

const MenuItemWithTooltip = ({
    disabledWhenOffline,
    tooltip,
    label,
    disabled,
    ...rest
}) => {
    const { offline } = useOnlineStatus()

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
