import { RichTextParser, RichTextEditor } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { acUpdateDashboardItem } from '../../../actions/editDashboard.js'
import { isEditMode, PRINT_LAYOUT } from '../../../modules/dashboardModes.js'
import { sGetEditDashboardItems } from '../../../reducers/editDashboard.js'
import {
    sGetIsPrinting,
    sGetPrintDashboardItems,
} from '../../../reducers/printDashboard.js'
import { sGetSelectedDashboardItems } from '../../../reducers/selected.js'
import ItemHeader from '../ItemHeader/ItemHeader.jsx'
import PrintItemInfo from '../ItemHeader/PrintItemInfo.jsx'
import styles from './styles/TextItem.module.css'

const fullscreenStyle = {
    padding: '24px',
    fontSize: '18px',
    fontStretch: 'normal',
    margin: '0 auto',
    display: 'block',
    lineHeight: '23px',
}

const viewStyle = {
    padding: '10px',
    fontSize: '14px',
    fontStretch: 'normal',
    margin: '0 auto',
    display: 'block',
    lineHeight: '16px',
}

const TextItem = (props) => {
    const {
        item,
        storedItem,
        dashboardMode,
        text,
        isFullscreen,
        acUpdateDashboardItem,
    } = props

    // Edit mode shows the rendered text until clicked; the editor (raw
    // markdown) is only shown while editing, and renders again on click-away
    const [editing, setEditing] = useState(false)
    const editRef = useRef(null)
    const pressRef = useRef(null)

    useEffect(() => {
        if (!editing) {
            return
        }
        const onMouseDown = (e) => {
            // the editor's emoji/mention popovers render in a layer outside
            if (
                editRef.current?.contains(e.target) ||
                e.target.closest?.('[data-test="dhis2-uicore-layer"]')
            ) {
                return
            }
            setEditing(false)
        }
        const onKeyDown = (e) => e.key === 'Escape' && setEditing(false)
        document.addEventListener('mousedown', onMouseDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('mousedown', onMouseDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [editing])

    // A click that ends a drag of the item shouldn't open the editor
    const startEditing = (e) => {
        const press = pressRef.current
        if (press && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 4) {
            return
        }
        setEditing(true)
    }

    const onChangeText = (text) => {
        // Build the update from the canonical store item, not props.item: in the
        // editor props.item carries a display-space shape (x/w scaled to the
        // editor's column resolution). Persisting that would clobber the stored
        // 60-unit shape and the box would shrink on every keystroke.
        const updatedItem = {
            ...(storedItem ?? item),
            text,
        }

        acUpdateDashboardItem(updatedItem)
    }

    const viewItem = () => {
        return (
            <div
                className={cx(styles.content, {
                    [styles.fullscreen]: isFullscreen,
                })}
            >
                <RichTextParser
                    style={isFullscreen ? fullscreenStyle : viewStyle}
                >
                    {text}
                </RichTextParser>
            </div>
        )
    }

    const editItem = () => {
        return (
            <>
                {/* No "Text box" title bar: just the item actions, floating
                    top-right, so the box looks like the published result.
                    Hidden while editing so they don't cover the editor's
                    toolbar. */}
                {!editing && (
                    <div className={styles.floatingHeader}>
                        <ItemHeader
                            title=""
                            itemId={item.id}
                            dashboardMode={dashboardMode}
                        />
                    </div>
                )}
                {editing ? (
                    <div
                        className={cx(styles.content, styles.edit)}
                        ref={editRef}
                    >
                        <RichTextEditor
                            onChange={onChangeText}
                            inputPlaceholder={i18n.t('Add text here')}
                            value={text}
                            initialFocus={true}
                            resizable={false}
                        />
                    </div>
                ) : (
                    <div
                        className={cx(styles.content, styles.rendered)}
                        role="button"
                        tabIndex={0}
                        aria-label={i18n.t('Edit text')}
                        onMouseDown={(e) =>
                            (pressRef.current = { x: e.clientX, y: e.clientY })
                        }
                        onClick={startEditing}
                        onKeyDown={(e) =>
                            (e.key === 'Enter' || e.key === ' ') &&
                            (e.preventDefault(), setEditing(true))
                        }
                    >
                        {text ? (
                            <RichTextParser style={viewStyle}>
                                {text}
                            </RichTextParser>
                        ) : (
                            <p className={styles.placeholder}>
                                {i18n.t('Add text here')}
                            </p>
                        )}
                    </div>
                )}
            </>
        )
    }

    const printItem = () => {
        return (
            <>
                {props.item.shortened ? <PrintItemInfo /> : null}
                <div className={styles.content}>
                    <RichTextParser style={viewStyle}>{text}</RichTextParser>
                </div>
            </>
        )
    }

    let textItem
    if (isEditMode(dashboardMode)) {
        textItem = editItem
    } else if (dashboardMode === PRINT_LAYOUT) {
        textItem = printItem
    } else {
        textItem = viewItem
    }

    return <>{textItem()}</>
}

const mapStateToProps = (state, ownProps) => {
    const isPrintPreview = sGetIsPrinting(state)
    let items
    if (isPrintPreview) {
        items = sGetPrintDashboardItems(state)
    } else if (isEditMode(ownProps.dashboardMode)) {
        items = sGetEditDashboardItems(state)
    } else {
        items = sGetSelectedDashboardItems(state)
    }

    const item = items.find((item) => item.id === ownProps.item.id)

    // Keep raw text in edit mode so we do not overwrite the raw value
    // To avoid server version toggling, try both displayText (>=v43) and text (<=v42)
    // Remove on v42-end-of-life
    const displayText = isEditMode(ownProps.dashboardMode)
        ? item?.text
        : item?.displayText ?? item?.text

    return {
        text: item ? displayText : '',
        // The canonical store item (60-unit shape) so edits preserve size.
        storedItem: item ?? null,
    }
}

TextItem.propTypes = {
    acUpdateDashboardItem: PropTypes.func,
    dashboardMode: PropTypes.string,
    isFullscreen: PropTypes.bool,
    item: PropTypes.object,
    storedItem: PropTypes.object,
    text: PropTypes.string,
}

export default connect(mapStateToProps, {
    acUpdateDashboardItem,
})(TextItem)
