import i18n from '@dhis2/d2-i18n'
import { InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const ItemSearchField = props => (
    <InputField
        name="Dashboard item search"
        label={i18n.t('Search for items to add to this dashboard')}
        type="text"
        onChange={props.onChange}
        onFocus={props.onFocus}
        value={props.value}
        dataTest="item-search"
    />
)

ItemSearchField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
}

export default ItemSearchField
