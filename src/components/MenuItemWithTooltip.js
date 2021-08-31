import { useOnlineStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import Tooltip from './Tooltip'

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

    return (
        <MenuItem
            dense
            disabled={notAllowed}
            label={<Tooltip content={tooltipContent}>{label}</Tooltip>}
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
