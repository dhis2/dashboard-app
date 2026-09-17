import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import classes from './styles/ItemGrid.module.css'

const POPUP_CURSOR_OFFSET_PX = 0

const WidthIcon = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 13 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M-5.68248e-07 13L0 -5.68248e-07L13 0L13 13L-5.68248e-07 13ZM4 1L1 0.999999L0.999999 12L4 12L4 1ZM5 1L5 12L8 12L8 1L5 1ZM9 1L9 12L12 12L12 1L9 1Z"
            fill="currentColor"
        />
    </svg>
)

const HeightIcon = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 13 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M13 13H0V0H13V13ZM1 9V12H12V9H1ZM1 8H12V5H1V8ZM1 4H12V1H1V4Z"
            fill="currentColor"
        />
    </svg>
)

const GridUnitsPopup = forwardRef((_props, ref) => {
    const elRef = useRef(null)
    const [{ w, h }, setGridUnits] = useState({ w: 0, h: 0 })

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
            setGridUnits({ w, h })
            el.style.display = 'flex'
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
        >
            <span className={classes.gridUnitsPopupUnit}>
                <WidthIcon />
                {w}
            </span>
            <span className={classes.gridUnitsPopupUnit}>
                <HeightIcon />
                {h}
            </span>
        </div>,
        document.body
    )
})

GridUnitsPopup.displayName = 'GridUnitsPopup'

export default GridUnitsPopup
