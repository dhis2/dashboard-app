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
const TODAY = 'Two toolbars'
const ONE_TOOLBAR = 'Command palette'
const BUILD_SIDEBAR = 'Build sidebar'
const SPLIT_BAR = 'Single toolbar'
const VARIANTS = {
    [TODAY]: 'today',
    [ONE_TOOLBAR]: 'onebar',
    [BUILD_SIDEBAR]: 'sidebar',
    [SPLIT_BAR]: 'split',
}

const EditVariantContext = createContext('today')

export const useEditVariant = () => useContext(EditVariantContext)

export const EditVariantProvider = ({ children }) => {
    const { layout } = useDialKit(
        'Dashboard creator',
        {
            layout: {
                type: 'select',
                options: [TODAY, SPLIT_BAR, ONE_TOOLBAR, BUILD_SIDEBAR],
            },
        },
        { id: 'dashboard-creator-variant', persist: true }
    )

    return (
        <EditVariantContext.Provider value={VARIANTS[layout] || 'today'}>
            {children}
            <DialRoot position="bottom-right" />
        </EditVariantContext.Provider>
    )
}

EditVariantProvider.propTypes = {
    children: PropTypes.node,
}

// Wraps the canvas in the chosen variant's chrome. Today: action bar + add
// bar. One toolbar: everything in a single row. Build sidebar: title bar +
// left panel for add, layout and settings.
export const EditShell = ({ showAddBar, children }) => {
    const variant = useEditVariant()
    if (variant === 'split') {
        return (
            <>
                <ActionsBar split />
                {children}
            </>
        )
    }
    if (variant === 'today') {
        return (
            <>
                <ActionsBar />
                {showAddBar && <AddItemsBar />}
                {children}
            </>
        )
    }
    return (
        <OneBarActions sidebar={variant === 'sidebar'}>
            {children}
        </OneBarActions>
    )
}

EditShell.propTypes = {
    children: PropTypes.node,
    showAddBar: PropTypes.bool,
}
