import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconChevronDown16, Input, Layer, Menu, Popper } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useEffect, createRef } from 'react'
import { itemTypeMap, getDefaultItemCount, VISUALIZATION } from '../../../modules/itemTypes.js'
import useDebounce from '../../../modules/useDebounce.js'
import InlineButton from '../InlineButton.jsx'
import CategorizedMenuGroup from './CategorizedMenuGroup.jsx'
import { defaultSearchItemTypes } from './selectableItems.js'
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

const ItemSelector = ({
    types = defaultSearchItemTypes,
    compact = false,
    hideIfEmpty = false,
    label,
    icon,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [filter, setFilter] = useState('')
    const [items, setItems] = useState(null)
    const [hasItems, setHasItems] = useState(!hideIfEmpty)
    const [maxOptions, setMaxOptions] = useState(new Set())
    const debouncedFilterText = useDebounce(filter, 350)

    const { data, refetch } = useDataQuery(dashboardSearchQuery, {
        lazy: true,
    })

    useEffect(() => {
        if (!data?.items) {
            return
        }

        setItems(data.items)

        if (hideIfEmpty && !debouncedFilterText) {
            setHasItems(
                types.some(
                    (type) =>
                        data.items[itemTypeMap[type].endPointName]?.length
                )
            )
        }
    }, [data, debouncedFilterText, hideIfEmpty, types])

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

    const toggleMenu = () => {
        if (isOpen) {
            closeMenu()
        } else {
            setIsOpen(true)
        }
    }

    const updateMaxOptions = (type) => {
        if (type) {
            const options = new Set(maxOptions)
            options.has(type) ? options.delete(type) : options.add(type)
            setMaxOptions(options)
        } else {
            setMaxOptions(new Set())
        }
    }

    const getCategorizedMenuGroups = () =>
        types
            .filter((type) => {
                const itemType = itemTypeMap[type]
                return items?.[itemType.endPointName]
            })
            .map((type) => {
                const itemType = itemTypeMap[type]
                const itemCount = getDefaultItemCount(type)
                const allItems = items[itemType.endPointName]
                const hasMore = allItems.length > itemCount
                const displayItems = maxOptions.has(type)
                    ? allItems
                    : allItems.slice(0, itemCount)

                return (
                    <CategorizedMenuGroup
                        key={type}
                        type={type}
                        title={
                            type === VISUALIZATION
                                ? i18n.t('Aggregate')
                                : itemType.pluralTitle
                        }
                        items={displayItems}
                        onChangeItemsLimit={updateMaxOptions}
                        hasMore={hasMore}
                        hideDivider={compact}
                    />
                )
            })

    const inputRef = createRef()

    if (hideIfEmpty && !hasItems) {
        return null
    }

    return (
        <>
            <span className={classes.trigger} ref={inputRef}>
                <InlineButton
                    icon={icon}
                    iconRight={<IconChevronDown16 />}
                    onClick={toggleMenu}
                >
                    {label}
                </InlineButton>
            </span>
            {isOpen && (
                <Layer onBackdropClick={closeMenu}>
                    <Popper reference={inputRef} placement="bottom-start">
                        <div
                            className={
                                compact
                                    ? `${classes.popover} ${classes.popoverCompact}`
                                    : classes.popover
                            }
                        >
                            <div
                                className={classes.header}
                                onMouseDown={(event) => event.preventDefault()}
                            >
                                <Input
                                    name="Item search"
                                    type="text"
                                    dense
                                    autoFocus
                                    value={filter}
                                    onChange={({ value }) => setFilter(value)}
                                    placeholder={i18n.t('Search')}
                                />
                            </div>
                            <div
                                className={
                                    compact
                                        ? `${classes.menu} ${classes.menuCompact}`
                                        : `${classes.menu} ${classes.menuTall}`
                                }
                                data-test="item-menu"
                            >
                                <Menu dense>{getCategorizedMenuGroups()}</Menu>
                            </div>
                        </div>
                    </Popper>
                </Layer>
            )}
        </>
    )
}

ItemSelector.propTypes = {
    label: PropTypes.string.isRequired,
    compact: PropTypes.bool,
    hideIfEmpty: PropTypes.bool,
    icon: PropTypes.node,
    types: PropTypes.arrayOf(PropTypes.string),
}

export default ItemSelector
