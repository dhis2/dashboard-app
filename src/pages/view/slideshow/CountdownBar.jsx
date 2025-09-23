import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/CountdownBar.module.css'

const FULL_INLINE_SIZE = 32

const CountdownBar = ({ msPerSlide, slideMsRemaining }) => {
    const percentRemaining = msPerSlide > 0 ? slideMsRemaining / msPerSlide : 0
    const inlineSize = Math.max(
        0,
        Math.min(FULL_INLINE_SIZE, percentRemaining * FULL_INLINE_SIZE)
    )

    return (
        <>
            <div
                className={styles.progress}
                style={{
                    inlineSize: `${inlineSize}px`,
                    animationDuration: `${slideMsRemaining}ms`,
                }}
            />
            <div className={styles.clipper} />
        </>
    )
}

CountdownBar.propTypes = {
    msPerSlide: PropTypes.number,
    slideMsRemaining: PropTypes.number,
}

export default CountdownBar
