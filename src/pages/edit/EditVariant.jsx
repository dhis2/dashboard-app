import { DialRoot, useDialKit } from 'dialkit'
// eslint-disable-next-line import/no-unresolved -- resolved via the package's exports map
import 'dialkit/styles.css'
import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'
import ActionsBar from './ActionsBar.jsx'
import AddItemsBar from './AddItemsBar.jsx'
import OneBarActions from './OneBarActions.jsx'

// Prototype switch between editor layouts, driven by a DialKit panel.
// shortcut: lives only in the edit pages; remove with the losing variant.
const TODAY = 'Today'
const ONE_TOOLBAR = 'One toolbar'

const EditVariantContext = createContext('today')

export const useEditVariant = () => useContext(EditVariantContext)

export const EditVariantProvider = ({ children }) => {
    const { layout } = useDialKit(
        'Dashboard creator',
        { layout: { type: 'select', options: [TODAY, ONE_TOOLBAR] } },
        { id: 'dashboard-creator-variant', persist: true }
    )

    return (
        <EditVariantContext.Provider
            value={layout === ONE_TOOLBAR ? 'onebar' : 'today'}
        >
            {children}
            <DialRoot position="bottom-left" />
        </EditVariantContext.Provider>
    )
}

EditVariantProvider.propTypes = {
    children: PropTypes.node,
}

// Today: action bar + add bar. One toolbar: everything in a single row.
export const EditToolbars = ({ showAddBar }) =>
    useEditVariant() === 'onebar' ? (
        <OneBarActions />
    ) : (
        <>
            <ActionsBar />
            {showAddBar && <AddItemsBar />}
        </>
    )

EditToolbars.propTypes = {
    showAddBar: PropTypes.bool,
}
