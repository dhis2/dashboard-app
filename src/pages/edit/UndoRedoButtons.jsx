import i18n from '@dhis2/d2-i18n'
import { IconRedo16, IconUndo16, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
    acRedoEdit,
    acUndoEdit,
    sGetCanRedo,
    sGetCanUndo,
} from '../../reducers/editHistory.js'
import InlineButton from './InlineButton.jsx'

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)
const UNDO_KEYS = isMac ? '⌘Z' : 'Ctrl+Z'
const REDO_KEYS = isMac ? '⇧⌘Z' : 'Ctrl+Y'

// Text fields, the rich text editor and dialogs keep their own undo
const isOwnUndo = (target) =>
    target.closest?.('input, textarea, select, [contenteditable="true"]') ||
    document.querySelector('[role="dialog"]')

const UndoRedoButtons = ({ canUndo, canRedo, onUndo, onRedo }) => {
    useEffect(() => {
        const onKeyDown = (e) => {
            if (!(e.metaKey || e.ctrlKey) || isOwnUndo(e.target)) {
                return
            }
            const key = e.key.toLowerCase()
            if (key === 'z' && !e.shiftKey) {
                e.preventDefault()
                onUndo()
            } else if ((key === 'z' && e.shiftKey) || key === 'y') {
                e.preventDefault()
                onRedo()
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [onUndo, onRedo])

    return (
        <>
            <Tooltip
                content={`${i18n.t('Undo')} (${UNDO_KEYS})`}
                openDelay={300}
                closeDelay={0}
            >
                <InlineButton
                    icon={<IconUndo16 />}
                    aria-label={i18n.t('Undo')}
                    aria-keyshortcuts={isMac ? 'Meta+Z' : 'Control+Z'}
                    disabled={!canUndo}
                    onClick={onUndo}
                    dataTest="undo-button"
                />
            </Tooltip>
            <Tooltip
                content={`${i18n.t('Redo')} (${REDO_KEYS})`}
                openDelay={300}
                closeDelay={0}
            >
                <InlineButton
                    icon={<IconRedo16 />}
                    aria-label={i18n.t('Redo')}
                    aria-keyshortcuts={isMac ? 'Shift+Meta+Z' : 'Control+Y'}
                    disabled={!canRedo}
                    onClick={onRedo}
                    dataTest="redo-button"
                />
            </Tooltip>
        </>
    )
}

UndoRedoButtons.propTypes = {
    onRedo: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    canRedo: PropTypes.bool,
    canUndo: PropTypes.bool,
}

export default connect(
    (state) => ({ canUndo: sGetCanUndo(state), canRedo: sGetCanRedo(state) }),
    { onUndo: acUndoEdit, onRedo: acRedoEdit }
)(UndoRedoButtons)
