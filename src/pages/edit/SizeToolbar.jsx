import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { WidthIcon, HeightIcon } from './GridUnitsPopup.jsx'
import classes from './styles/ItemGrid.module.css'

// A number field that's comfortable to type into: it holds its own text while
// focused (so you can clear it / type multi-digit values without the controlled
// value snapping back), and commits a clamped value as you go. Native up/down
// arrows (keyboard and the field's spinner) work out of the box.
export const NumberField = ({
    icon,
    value,
    min,
    max,
    placeholder,
    nullBaseline,
    onCommit,
}) => {
    const toText = (v) => (v === null || v === undefined ? '' : String(v))
    const [text, setText] = useState(toText(value))
    const focusedRef = useRef(false)

    useEffect(() => {
        if (!focusedRef.current) {
            setText(toText(value))
        }
    }, [value])

    const commit = (raw) => {
        const n = parseInt(raw, 10)
        if (Number.isNaN(n)) {
            return
        }
        const clamped = Math.max(min, max ? Math.min(n, max) : n)
        onCommit(clamped)
    }

    const isBlank = value === null || value === undefined
    const hasBaseline = nullBaseline !== null && nullBaseline !== undefined

    // While the field is blank (mismatched values), steer the native step — both
    // the keyboard arrows and the spinner buttons — to start from the baseline
    // (e.g. the biggest height) by making that the field's min. Stepping up or
    // down from empty then lands on the baseline instead of jumping to 1.
    const effectiveMin = isBlank && hasBaseline ? nullBaseline : min

    return (
        <label className={classes.sizeToolbarUnit}>
            {icon}
            <input
                type="number"
                className={classes.sizeToolbarInput}
                value={text}
                min={effectiveMin}
                max={max}
                placeholder={placeholder}
                onFocus={() => {
                    focusedRef.current = true
                }}
                onBlur={() => {
                    focusedRef.current = false
                    setText(toText(value))
                }}
                onChange={(e) => {
                    setText(e.target.value)
                    commit(e.target.value)
                }}
            />
        </label>
    )
}

NumberField.propTypes = {
    icon: PropTypes.node,
    max: PropTypes.number,
    min: PropTypes.number,
    nullBaseline: PropTypes.number,
    placeholder: PropTypes.string,
    value: PropTypes.number,
    onCommit: PropTypes.func,
}

const SizeToolbar = ({ w, h, maxW, style, onChange }) => (
    <div
        className={classes.sizeToolbar}
        style={style}
        data-test="dashboard-size-toolbar"
    >
        <NumberField
            icon={<WidthIcon />}
            value={w}
            min={1}
            max={maxW}
            onCommit={(next) => onChange({ w: next, h })}
        />
        <NumberField
            icon={<HeightIcon />}
            value={h}
            min={1}
            onCommit={(next) => onChange({ w, h: next })}
        />
    </div>
)

SizeToolbar.propTypes = {
    h: PropTypes.number,
    maxW: PropTypes.number,
    style: PropTypes.object,
    w: PropTypes.number,
    onChange: PropTypes.func,
}

export default SizeToolbar
