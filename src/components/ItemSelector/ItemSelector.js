import React, { useState, useEffect, createRef } from 'react'
import PropTypes from 'prop-types'
import { Popover, FlyoutMenu } from '@dhis2/ui'

import ItemSearchField from './ItemSearchField'
import CategorizedMenuGroup from './CategorizedMenuGroup'
import SinglesMenuGroup from './SinglesMenuGroup'
import { singleItems, categorizedItems } from './selectableItems'
import { itemTypeMap, getDefaultItemCount } from '../../modules/itemTypes'

import classes from './styles/ItemSelector.module.css'

// eslint-disable-next-line no-empty-pattern
const ItemSelector = ({}, context) => {
    const [isOpen, setIsOpen] = useState(false)
    const [filter, setFilter] = useState('')
    const [items, setItems] = useState(null)
    const [maxOptions, setMaxOptions] = useState(new Set())

    useEffect(() => {
        fetchItems()
    }, [])

    const closeMenu = () => {
        setIsOpen(false)
        setFilter('')
    }

    const openMenu = () => setIsOpen(true)

    const getCategorizedMenuGroups = () =>
        categorizedItems
            .filter(type => {
                const itemType = itemTypeMap[type]
                return items && items[itemType.endPointName]
            })
            .map(type => {
                const itemType = itemTypeMap[type]
                const itemCount = getDefaultItemCount(type)
                const allItems = items[itemType.endPointName]
                const hasMore = allItems.length > itemCount
                const theitems = maxOptions.has(itemType.id)
                    ? allItems
                    : allItems.slice(0, itemCount)

                return (
                    <CategorizedMenuGroup
                        key={type}
                        type={type}
                        title={itemType.pluralTitle}
                        items={theitems}
                        onChangeItemsLimit={fetchItems}
                        hasMore={hasMore}
                    />
                )
            })

    const getSinglesMenuGroups = () =>
        singleItems.map(category => (
            <SinglesMenuGroup key={category.id} category={category} />
        ))

    const getMenuGroups = () =>
        getCategorizedMenuGroups().concat(getSinglesMenuGroups())

    const fetchItems = async type => {
        if (type) {
            const newOptions = new Set(maxOptions)

            newOptions.has(type)
                ? newOptions.delete(type)
                : newOptions.add(type)

            setMaxOptions(newOptions)
        } else {
            setMaxOptions(new Set())
        }

        let queryString = '?count=11'
        if ([...maxOptions.values()].length) {
            queryString += '&max=' + [...maxOptions.values()].join('&max=')
        }

        const filterStr = filter ? `/${filter}` : ''

        context.d2.Api.getApi()
            .get(`dashboards/q${filterStr}${queryString}`)
            .then(response => setItems(response))
            .catch(console.error)
    }

    const inputRef = createRef()

    return (
        <>
            <span ref={inputRef}>
                <ItemSearchField
                    value={filter}
                    onChange={setFilter}
                    onFocus={openMenu}
                />
            </span>
            {isOpen && (
                <Popover
                    reference={inputRef}
                    placement="bottom-start"
                    onClickOutside={closeMenu}
                    arrow={false}
                    maxWidth="700px"
                >
                    <FlyoutMenu
                        className={classes.menu}
                        dataTest={'dhis2-dashboard-item-menu'}
                        maxWidth="700px"
                    >
                        {getMenuGroups()}
                    </FlyoutMenu>
                </Popover>
            )}
        </>
    )
}

ItemSelector.contextTypes = {
    d2: PropTypes.object.isRequired,
}

export default ItemSelector
