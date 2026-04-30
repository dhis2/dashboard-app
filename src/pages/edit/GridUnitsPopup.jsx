import i18n from '@dhis2/d2-i18n'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { createPortal } from 'react-dom'
import classes from './styles/ItemGrid.module.css'

const POPUP_CURSOR_OFFSET_PX = 16

const GridUnitsPopup = forwardRef((_props, ref) => {
    const elRef = useRef(null)

    useImperativeHandle(ref, () => ({
        show: ({ clientX, clientY, w, h }) => {
            const el = elRef.current
            if (!el) {
                return
            }
            el.style.bottom = `${
                window.innerHeight - clientY + POPUP_CURSOR_OFFSET_PX
            }px`
            el.style.right = `${
                window.innerWidth - clientX + POPUP_CURSOR_OFFSET_PX
            }px`
            el.textContent = i18n.t('Cols: {{w}} · Rows: {{h}}', { w, h })
            el.style.display = 'block'
        },
        hide: () => {
            const el = elRef.current
            if (el) {
                el.style.display = 'none'
            }
        },
    }))

    return createPortal(
        <div
            ref={elRef}
            className={classes.gridUnitsPopup}
            style={{ display: 'none' }}
            data-test="dashboard-grid-units-popup"
        />,
        document.body
    )
})

GridUnitsPopup.displayName = 'GridUnitsPopup'

export default GridUnitsPopup
