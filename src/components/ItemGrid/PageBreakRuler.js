import React from 'react'
import PropTypes from 'prop-types'

import classes from './styles/PageBreakRuler.module.css'

const PageBreakRuler = ({ pageCount }) => {
    // for A4 landscape (297x210mm)
    // 794 px = (21cm / 2.54) * 96 pixels/inch
    // 1122 px = 29.7 /2.54 * 96 pixels/inch
    // then subtract the top and bottom margins
    const margin = 10 * 2
    // const pageHeight = 794 - margin
    const pageHeight = 640 + margin
    // const pageWidth = 1122 - margin
    // const pageWidthPx = `${pageWidth}px`

    const pageBreaks = Array(pageCount)
        .fill(null)
        .map((u, i) => {
            return (
                <div
                    key={`${i}-pagebreak`}
                    className={classes.horizontalBreak}
                    style={{
                        top: pageHeight * (i + 1) + 20 * i,
                    }}
                />
            )
        })

    return (
        <>
            {pageBreaks}
            <div className={classes.rightMargin} />
        </>
    )
}

PageBreakRuler.propTypes = {
    pageCount: PropTypes.number,
}

export default PageBreakRuler
