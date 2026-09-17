import { visTypeIcons } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    InputField,
    colors,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { acUpdateDashboardItem } from '../../actions/editDashboard.js'
import {
    itemTypeMap,
    getItemIcon,
    VISUALIZATION,
} from '../../modules/itemTypes.js'
import useDebounce from '../../modules/useDebounce.js'

const searchQuery = {
    results: {
        resource: 'dashboards/search',
        params: ({ searchTerm, maxItems }) => ({
            q: searchTerm,
            count: 25,
            max: maxItems,
        }),
    },
}

const VizIcon = ({ itemType, visType }) => {
    if (itemType === VISUALIZATION && visTypeIcons[visType]) {
        const Icon = visTypeIcons[visType]
        return <Icon color={colors.grey600} />
    }
    const Icon = getItemIcon(itemType)
    return Icon ? <Icon color={colors.grey600} /> : null
}

VizIcon.propTypes = {
    itemType: PropTypes.string,
    visType: PropTypes.string,
}

const ChangeVisualizationModal = ({ item, onClose }) => {
    const dispatch = useDispatch()
    const [filter, setFilter] = useState('')
    const debouncedFilter = useDebounce(filter, 350)

    const typeInfo = itemTypeMap[item.type]
    const { endPointName, propName, pluralTitle } = typeInfo

    const { data, refetch } = useDataQuery(searchQuery, { lazy: true })

    useEffect(() => {
        refetch({ searchTerm: debouncedFilter, maxItems: [item.type] })
    }, [debouncedFilter, item.type, refetch])

    const results = data?.results?.[endPointName] || []

    const currentVizId = item[propName]?.id

    const handleSelect = (viz) => {
        dispatch(
            acUpdateDashboardItem({
                ...item,
                [propName]: {
                    id: viz.id,
                    name: viz.displayName || viz.name,
                    displayName: viz.displayName || viz.name,
                },
            })
        )
        onClose()
    }

    return (
        <Modal onClose={onClose} position="middle">
            <ModalTitle>
                {i18n.t('Change visualization')}
            </ModalTitle>
            <ModalContent>
                <InputField
                    dense
                    type="text"
                    value={filter}
                    onChange={({ value }) => setFilter(value)}
                    placeholder={i18n.t('Search {{type}}', {
                        type: pluralTitle.toLowerCase(),
                    })}
                    dataTest="change-viz-search"
                />
                <div style={{ marginBlockStart: 8, maxBlockSize: 300, overflow: 'auto' }}>
                    {results.map((viz) => (
                        <button
                            key={viz.id}
                            type="button"
                            onClick={() => handleSelect(viz)}
                            disabled={viz.id === currentVizId}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                width: '100%',
                                padding: '6px 12px',
                                border: 'none',
                                borderRadius: 3,
                                background: viz.id === currentVizId
                                    ? 'var(--colors-grey200)'
                                    : 'transparent',
                                textAlign: 'start',
                                cursor: viz.id === currentVizId ? 'default' : 'pointer',
                                fontSize: 14,
                            }}
                            data-test="change-viz-option"
                        >
                            <VizIcon itemType={item.type} visType={viz.type} />
                            <span>
                                {viz.displayName || viz.name}
                                {viz.id === currentVizId && (
                                    <span style={{ color: 'var(--colors-grey600)', marginInlineStart: 8 }}>
                                        {i18n.t('(current)')}
                                    </span>
                                )}
                            </span>
                        </button>
                    ))}
                    {data && !results.length && (
                        <p style={{ padding: '8px 12px', color: 'var(--colors-grey600)' }}>
                            {i18n.t('No results')}
                        </p>
                    )}
                </div>
            </ModalContent>
            <ModalActions>
                <Button secondary onClick={onClose}>
                    {i18n.t('Cancel')}
                </Button>
            </ModalActions>
        </Modal>
    )
}

ChangeVisualizationModal.propTypes = {
    item: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ChangeVisualizationModal
