import { IntersectionDetector } from '@dhis2-ui/intersection-detector'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/EndIntersectionDetector.module.css'

export const EndIntersectionDetector = ({ rootRef, onEndReached }) => {
    return (
        <div className={styles.container}>
            <IntersectionDetector
                rootRef={rootRef}
                onChange={({ isIntersecting }) =>
                    isIntersecting && onEndReached()
                }
            />
        </div>
    )
}

EndIntersectionDetector.propTypes = {
    rootRef: PropTypes.shape({
        current: PropTypes.instanceOf(HTMLElement),
    }).isRequired,
    onEndReached: PropTypes.func.isRequired,
}
