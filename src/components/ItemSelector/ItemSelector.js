import React, { useState, useEffect, createRef } from 'react'
import { Popover, FlyoutMenu } from '@dhis2/ui'
import { useDataEngine } from '@dhis2/app-runtime'
import ItemSearchField from './ItemSearchField'
import CategorizedMenuGroup from './CategorizedMenuGroup'
import SinglesMenuGroup from './SinglesMenuGroup'
import { singleItems, categorizedItems } from './selectableItems'
import { itemTypeMap, getDefaultItemCount } from '../../modules/itemTypes'
import useDebounce from '../../modules/useDebounce'
import { getDashboardsQQuery } from '../../api/dashboardsQ'

import classes from './styles/ItemSelector.module.css'

const ItemSelector = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [filter, setFilter] = useState('')
    const [items, setItems] = useState(null)
    const [maxOptions, setMaxOptions] = useState(new Set())
    const dataEngine = useDataEngine()
    const debouncedFilterText = useDebounce(filter, 200)

    useEffect(() => {
        const query = getDashboardsQQuery(
            debouncedFilterText,
            Array.from(maxOptions)
        )

        dataEngine.query({ items: query }).then(res => setItems(res.items))
    }, [debouncedFilterText, maxOptions])

    const closeMenu = () => {
        setIsOpen(false)
        setFilter('')
        setMaxOptions(new Set())
    }

    const openMenu = () => setIsOpen(true)

    const getCategorizedMenuGroups = () => {
        return categorizedItems
            .filter(type => {
                const itemType = itemTypeMap[type]
                return items && items[itemType.endPointName]
            })
            .map(type => {
                const itemType = itemTypeMap[type]
                const itemCount = getDefaultItemCount(type)
                const allItems = items[itemType.endPointName]
                const hasMore = allItems.length > itemCount
                const displayItems = maxOptions.has(itemType.id)
                    ? allItems
                    : allItems.slice(0, itemCount)

                return (
                    <CategorizedMenuGroup
                        key={type}
                        type={type}
                        title={itemType.pluralTitle}
                        items={displayItems}
                        onChangeItemsLimit={updateMaxOptions}
                        hasMore={hasMore}
                    />
                )
            })
    }
    const getSinglesMenuGroups = () =>
        singleItems.map(category => (
            <SinglesMenuGroup key={category.id} category={category} />
        ))

    const getMenuGroups = () =>
        getCategorizedMenuGroups().concat(getSinglesMenuGroups())

    const updateMaxOptions = type => {
        if (type) {
            const options = new Set(maxOptions)
            options.has(type) ? options.delete(type) : options.add(type)
            setMaxOptions(options)
        } else {
            setMaxOptions(new Set())
        }
    }

    const updateFilter = ({ value }) => setFilter(value)

    const inputRef = createRef()

    return (
        <>
            <span ref={inputRef}>
                <ItemSearchField
                    value={filter}
                    onChange={updateFilter}
                    onFocus={openMenu}
                />
            </span>
            {isOpen && (
                <Popover
                    reference={inputRef}
                    placement="bottom-start"
                    onClickOutside={closeMenu}
                    arrow={false}
                    maxWidth={700}
                >
                    <div className={classes.popover}>
                        <FlyoutMenu
                            className={classes.menu}
                            dataTest="item-menu"
                            maxWidth="700px"
                        >
                            {getMenuGroups()}
                        </FlyoutMenu>
                    </div>
                </Popover>
            )}
        </>
    )
}

export default ItemSelector
