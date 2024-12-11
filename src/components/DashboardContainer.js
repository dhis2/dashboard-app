import cx from 'classnames'
import PropTypes from 'prop-types'
import React, {
    useRef,
    useState,
    useEffect,
    createContext,
    useContext,
} from 'react'
import classes from './styles/DashboardContainer.module.css'

const HasScrollbarContext = createContext(undefined)

const DashboardContainer = ({ children, covered }) => {
    const [hasScrollbar, setHasScrollbar] = useState(false)
    const containerRef = useRef(null)
    const contentWrapRef = useRef(null)

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            const el = containerRef.current
            if (!el) {
                throw new Error('Could not find scroll container')
            }
            /* This first condition is true in mobile portrait when there is
             * a scrollbar on the outer scroll-container */
            const isNarrowerThanWindow = window.innerWidth > el.offsetWidth
            const hasInnerScrollbar = el.scrollHeight > el.clientHeight
            setHasScrollbar(isNarrowerThanWindow || hasInnerScrollbar)
        })
        resizeObserver.observe(contentWrapRef.current)

        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    return (
        <div
            className={cx(
                classes.container,
                'dashboard-scroll-container',
                covered && classes.covered
            )}
            ref={containerRef}
            data-test="inner-scroll-container"
        >
            <div ref={contentWrapRef} className={classes.contentWrap}>
                <HasScrollbarContext.Provider value={hasScrollbar}>
                    {children}
                </HasScrollbarContext.Provider>
            </div>
        </div>
    )
}

DashboardContainer.propTypes = {
    children: PropTypes.node,
    covered: PropTypes.bool,
}

export const useContainerHasScrollbar = () => useContext(HasScrollbarContext)
export default DashboardContainer
