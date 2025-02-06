import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { sGetIsEditing } from '../../../reducers/editDashboard.js'
import { sGetNamedItemFilters } from '../../../reducers/itemFilters.js'
import {
    sGetPrintDashboardName,
    sGetPrintDashboardDescription,
} from '../../../reducers/printDashboard.js'
import {
    sGetSelectedDisplayName,
    sGetSelectedDisplayDescription,
} from '../../../reducers/selected.js'
import { sGetShowDescription } from '../../../reducers/showDescription.js'
import classes from './styles/Item.module.css'

const PrintTitlePageItem = ({
    name,
    description,
    itemFilters,
    showDescription,
}) => {
    const getItemFilterList = () => {
        const listItems = itemFilters.map(({ name, values }) => (
            <li className={classes.filterListItem} key={name}>
                {name}: {values.map((val) => val.name).join(', ')}
            </li>
        ))

        return <ul className={classes.filterList}>{listItems}</ul>
    }

    return (
        <div className={classes.titlePage}>
            <p className={classes.name}>{name}</p>
            {showDescription && description && (
                <p className={classes.description}>{description}</p>
            )}
            {itemFilters.length > 0 && (
                <>
                    <p className={classes.filterTitle}>
                        {i18n.t('Filters applied')}
                    </p>
                    {getItemFilterList()}
                </>
            )}
        </div>
    )
}

PrintTitlePageItem.propTypes = {
    description: PropTypes.string,
    itemFilters: PropTypes.array,
    name: PropTypes.string,
    showDescription: PropTypes.bool,
}

PrintTitlePageItem.defaultProps = {
    description: '',
    name: '',
    showDescription: false,
}

const mapStateToProps = (state) => {
    const isEditMode = sGetIsEditing(state)

    const name = isEditMode
        ? sGetPrintDashboardName(state) || i18n.t('Untitled dashboard')
        : sGetSelectedDisplayName(state)

    const description = isEditMode
        ? sGetPrintDashboardDescription(state)
        : sGetSelectedDisplayDescription(state)

    return {
        name,
        description,
        itemFilters: sGetNamedItemFilters(state),
        showDescription: sGetShowDescription(state),
    }
}

export default connect(mapStateToProps)(PrintTitlePageItem)
