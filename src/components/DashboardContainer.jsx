import cx from 'classnames'
import PropTypes from 'prop-types'
import React, {
    useRef,
    useState,
    useEffect,
    createContext,
    useContext,
} from 'react'
import { useSelector } from 'react-redux'
import { sGetSelectedIsEmbedded } from '../reducers/selected.js'
import classes from './styles/DashboardContainer.module.css'

const ContainerWidthContext = createContext(0)

const DashboardContainer = ({ children }) => {
    const [containerWidth, setContainerWidth] = useState(0)
    const ref = useRef(null)
    const isEmbeddedDashboard = useSelector(sGetSelectedIsEmbedded)

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            setContainerWidth(entries[0].contentRect.width)
        })
        resizeObserver.observe(ref.current)

        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    return (
        <div
            className={cx(classes.container, 'dashboard-scroll-container', {
                [classes.embeddedDashboard]: isEmbeddedDashboard,
            })}
            data-test="inner-scroll-container"
        >
            <div ref={ref} className={classes.contentWrap}>
                <ContainerWidthContext.Provider value={containerWidth}>
                    {children}
                </ContainerWidthContext.Provider>
            </div>
        </div>
    )
}

DashboardContainer.propTypes = {
    children: PropTypes.node,
}

export const useContainerWidth = () => useContext(ContainerWidthContext)
export default DashboardContainer
