import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import { MenuItem, Divider } from '@dhis2/ui-core'

import HeaderMenuItem from './HeaderMenuItem'
import ContentMenuItem from './ContentMenuItem'

import { tAddListItemContent } from './actions'
import { acAddDashboardItem } from '../../actions/editDashboard'
import { getItemUrl, APP, VISUALIZATION } from '../../modules/itemTypes'
import { categorizedItems, listItemTypes } from './selectableItems'

import classes from './styles/CategorizedMenuGroup.module.css'

class CategorizedMenuGroup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            seeMore: false,
        }
    }

    addItem = item => () => {
        const { type, acAddDashboardItem, tAddListItemContent } = this.props

        if (type === APP) {
            acAddDashboardItem({ type, content: item.key })
        } else {
            const newItem = {
                id: item.id,
                name: item.displayName || item.name,
            }

            if (listItemTypes.includes(type)) {
                tAddListItemContent(type, newItem)
            } else {
                acAddDashboardItem({ type, content: newItem })
            }
        }
    }

    toggleSeeMore = () => {
        this.setState({ seeMore: !this.state.seeMore })

        this.props.onChangeItemsLimit(this.props.type)
    }

    render() {
        const { title, type, items, hasMore } = this.props
        return (
            <>
                <HeaderMenuItem title={title} />
                {items.map(item => {
                    const itemUrl = getItemUrl(type, item, this.context.d2)
                    return (
                        <ContentMenuItem
                            key={item.id || item.key}
                            type={type}
                            visType={type === VISUALIZATION ? item.type : type}
                            name={item.displayName || item.name}
                            onInsert={this.addItem(item)}
                            url={itemUrl}
                        />
                    )
                })}
                {hasMore ? (
                    <MenuItem
                        dense
                        key={`showmore${title}`}
                        onClick={this.toggleSeeMore}
                        label={
                            <button className={classes.showMoreButton}>
                                {this.state.seeMore
                                    ? i18n.t('Show fewer')
                                    : i18n.t('Show more')}
                            </button>
                        }
                    />
                ) : null}
                <Divider margin="8px 0px" />
            </>
        )
    }
}

CategorizedMenuGroup.propTypes = {
    items: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(categorizedItems).isRequired,
    onChangeItemsLimit: PropTypes.func.isRequired,
    acAddDashboardItem: PropTypes.func,
    hasMore: PropTypes.bool,
    tAddListItemContent: PropTypes.func,
}

CategorizedMenuGroup.contextTypes = {
    d2: PropTypes.object.isRequired,
}

export default connect(null, {
    acAddDashboardItem,
    tAddListItemContent,
})(CategorizedMenuGroup)
