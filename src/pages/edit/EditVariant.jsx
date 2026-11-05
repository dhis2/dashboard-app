import PropTypes from 'prop-types'
import React from 'react'
import ActionsBar from './ActionsBar.jsx'
import AddItemsBar from './AddItemsBar.jsx'
import OneBarActions from './OneBarActions.jsx'

// Editor layout. Fixed to Two toolbars ('today') for sharing; the other
// variants ('split', 'onebar', 'sidebar') stay in the code and can be tried
// by changing this value.
// shortcut: hard-coded switch; delete the losing variants once one is picked
const VARIANT = 'today'

export const useEditVariant = () => VARIANT

export const EditVariantProvider = ({ children }) => children

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
