import i18n from '@dhis2/d2-i18n'
import { Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/ItemSearchField.module.css'

const ItemSearchField = props => (
    <>
        <div className={classes.label}>
            Search for items to add to this dashboard
        </div>
        <Input
            name="Dashboard item search"
            label={i18n.t('Search for items to add to this dashboard')}
            type="text"
            onChange={props.onChange}
            onFocus={props.onFocus}
            value={props.value}
            dataTest="item-search"
            placeholder={i18n.t('Search for visualizations, reports and more')}
        />
    </>
)

ItemSearchField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
}

export default ItemSearchField
