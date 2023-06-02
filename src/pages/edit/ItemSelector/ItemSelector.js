import { useDataEngine } from '@dhis2/app-runtime'
import { Layer, Popper, FlyoutMenu } from '@dhis2/ui'
import React, { useState, useEffect, createRef } from 'react'
import { itemTypeMap, getDefaultItemCount } from '../../../modules/itemTypes'
import useDebounce from '../../../modules/useDebounce'
import CategorizedMenuGroup from './CategorizedMenuGroup'
import { getDashboardsQQuery } from './dashboardsQQuery'
import ItemSearchField from './ItemSearchField'
import { singleItems, categorizedItems } from './selectableItems'
import SinglesMenuGroup from './SinglesMenuGroup'
import classes from './styles/ItemSelector.module.css'

const ItemSelector = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [filter, setFilter] = useState('')
    const [items, setItems] = useState(null)
    const [maxOptions, setMaxOptions] = useState(new Set())
    const dataEngine = useDataEngine()
    const debouncedFilterText = useDebounce(filter, 350)

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
                <Layer onClick={closeMenu}>
                    <Popper reference={inputRef} placement="bottom-start">
                        <div className={classes.popover}>
                            <FlyoutMenu
                                className={classes.menu}
                                dataTest="item-menu"
                                maxWidth="700px"
                            >
                                {getMenuGroups()}
                            </FlyoutMenu>
                        </div>
                    </Popper>
                </Layer>
            )}
        </>
    )
}

export default ItemSelector
