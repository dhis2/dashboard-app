import { useDataQuery } from '@dhis2/app-runtime'
import { Layer, Popper, FlyoutMenu } from '@dhis2/ui'
import React, { useState, useEffect, createRef } from 'react'
import { itemTypeMap, getDefaultItemCount } from '../../../modules/itemTypes.js'
import useDebounce from '../../../modules/useDebounce.js'
import CategorizedMenuGroup from './CategorizedMenuGroup.jsx'
import ItemSearchField from './ItemSearchField.jsx'
import { singleItems, categorizedItems } from './selectableItems.js'
import SinglesMenuGroup from './SinglesMenuGroup.jsx'
import classes from './styles/ItemSelector.module.css'

const dashboardSearchQuery = {
    items: {
        resource: 'dashboards/search',
        params: ({ searchTerm = '', count = 11, maxItems = [] }) => ({
            q: searchTerm,
            count,
            max: maxItems,
        }),
    },
}

const ItemSelector = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [filter, setFilter] = useState('')
    const [items, setItems] = useState(null)
    const [maxOptions, setMaxOptions] = useState(new Set())
    const debouncedFilterText = useDebounce(filter, 350)

    const { data, refetch } = useDataQuery(dashboardSearchQuery, {
        lazy: true,
    })

    useEffect(() => data?.items && setItems(data.items), [data])

    useEffect(() => {
        refetch({
            searchTerm: debouncedFilterText,
            maxItems: Array.from(maxOptions),
        })
    }, [debouncedFilterText, maxOptions, refetch])

    const closeMenu = () => {
        setIsOpen(false)
        setFilter('')
        setMaxOptions(new Set())
    }

    const openMenu = () => setIsOpen(true)

    const getCategorizedMenuGroups = () => {
        return categorizedItems
            .filter((type) => {
                const itemType = itemTypeMap[type]
                return items && items[itemType.endPointName]
            })
            .map((type) => {
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
        singleItems.map((category) => (
            <SinglesMenuGroup key={category.id} category={category} />
        ))

    const getMenuGroups = () =>
        getCategorizedMenuGroups().concat(getSinglesMenuGroups())

    const updateMaxOptions = (type) => {
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
