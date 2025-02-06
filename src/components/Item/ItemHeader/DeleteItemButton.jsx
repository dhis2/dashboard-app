import i18n from '@dhis2/d2-i18n'
import { colors, Button, Tooltip, IconDelete24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const DeleteItemButton = ({ onClick }) => (
    <Tooltip content={i18n.t('Remove this item')} placement="bottom">
        <Button
            secondary
            small
            onClick={onClick}
            icon={<IconDelete24 color={colors.red600} />}
            dataTest="delete-item-button"
        />
    </Tooltip>
)

DeleteItemButton.propTypes = {
    onClick: PropTypes.func,
}

export default DeleteItemButton
