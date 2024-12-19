import i18n from '@dhis2/d2-i18n'
import { Divider, spacers, CenteredContent } from '@dhis2/ui'
import debounce from 'lodash/debounce.js'
import pick from 'lodash/pick.js'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { getVisualizationName } from '../modules/item.js'
import {
    APP,
    MESSAGES,
    RESOURCES,
    REPORTS,
    isVisualizationType,
} from '../modules/itemTypes.js'
import ItemHeader from './Item/ItemHeader/ItemHeader.js'

const defaultDebounceMs = 100
const defaultBufferFactor = 0.25
const observerConfig = { attributes: true, childList: false, subtree: false }

const getItemHeader = ({ item, apps }) => {
    if (isVisualizationType(item)) {
        const title = getVisualizationName(item)
        return <ItemHeader title={title} style={{ minHeight: '31px' }} />
    }

    let title
    if ([MESSAGES, RESOURCES, REPORTS].includes(item.type)) {
        const titleMap = {
            [MESSAGES]: i18n.t('Messages'),
            [RESOURCES]: i18n.t('Resources'),
            [REPORTS]: i18n.t('Reports'),
        }
        title = titleMap[item.type]
    } else if (item.type === APP) {
        let appDetails
        const appKey = item.appKey

        if (appKey) {
            appDetails = apps.find((app) => app.key === appKey)
        }

        const hideTitle = appDetails?.settings?.dashboardWidget?.hideTitle
        title = hideTitle ? null : appDetails.name
    }

    return !title ? null : (
        <>
            <ItemHeader title={title} />
            <Divider margin={`0 0 ${spacers.dp4} 0`} />
        </>
    )
}

class ProgressiveLoadingContainer extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        item: PropTypes.object.isRequired,
        apps: PropTypes.array,
        bufferFactor: PropTypes.number,
        className: PropTypes.string,
        dashboardIsCached: PropTypes.bool,
        debounceMs: PropTypes.number,
        forceLoad: PropTypes.bool,
        fullsreenView: PropTypes.bool,
        isOffline: PropTypes.bool,
        style: PropTypes.object,
    }
    static defaultProps = {
        debounceMs: defaultDebounceMs,
        bufferFactor: defaultBufferFactor,
        forceLoad: false,
        fullsreenView: false,
    }

    state = {
        shouldLoad: false,
    }
    containerRef = null
    debouncedCheckShouldLoad = null
    handlerOptions = { passive: true }
    observer = null
    isObserving = null

    checkShouldLoad() {
        if (!this.containerRef) {
            return
        }

        // force load item regardless of its position
        if (this.forceLoad && !this.state.shouldLoad) {
            this.setState({ shouldLoad: true })
            if (!this.props.isOffline || this.props.dashboardIsCached) {
                this.removeHandler()
            }
            return
        }

        // when in fullscreen view, load is not based on
        // position relative to viewport but instead on forceLoad only
        if (this.props.fullsreenView) {
            return
        }

        const bufferPx = this.props.bufferFactor * window.innerHeight
        const rect = this.containerRef.getBoundingClientRect()

        // load item if it is near viewport
        if (
            rect.bottom > -bufferPx &&
            rect.top < window.innerHeight + bufferPx
        ) {
            this.setState({ shouldLoad: true })
            if (!this.props.isOffline || this.props.dashboardIsCached) {
                this.removeHandler()
            }
        }
    }

    registerHandler() {
        this.debouncedCheckShouldLoad = debounce(
            () => this.checkShouldLoad(),
            this.props.debounceMs
        )

        Array.from(
            document.getElementsByClassName('dashboard-scroll-container')
        ).forEach((container) => {
            container.addEventListener(
                'scroll',
                this.debouncedCheckShouldLoad,
                this.handlerOptions
            )
        })

        const mutationCallback = (mutationsList) => {
            const styleChanged = mutationsList.find(
                (mutation) => mutation.attributeName === 'style'
            )

            if (styleChanged) {
                this.debouncedCheckShouldLoad()
            }
        }

        this.observer = new MutationObserver(mutationCallback)
        this.observer.observe(this.containerRef, observerConfig)
        this.isObserving = true
    }

    removeHandler() {
        Array.from(
            document.getElementsByClassName('dashboard-scroll-container')
        ).forEach((container) => {
            container.removeEventListener(
                'scroll',
                this.debouncedCheckShouldLoad,
                this.handlerOptions
            )
        })

        this.observer.disconnect()
        this.isObserving = false
    }

    componentDidMount() {
        this.registerHandler()
        this.checkShouldLoad()
    }

    componentDidUpdate() {
        if (this.props.forceLoad && !this.state.shouldLoad) {
            this.checkShouldLoad()
        }
    }

    componentWillUnmount() {
        this.removeHandler()
    }

    render() {
        const {
            children,
            className,
            style,
            apps,
            item,
            dashboardIsCached,
            isOffline,
            ...props
        } = this.props

        const eventProps = pick(props, [
            'onMouseDown',
            'onTouchStart',
            'onMouseUp',
            'onTouchEnd',
        ])

        const renderContent = this.state.shouldLoad || props.forceLoad

        const getContent = () => {
            if (isOffline && !dashboardIsCached && this.isObserving !== false) {
                return !renderContent ? null : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                        }}
                    >
                        {getItemHeader({ item, apps })}
                        <CenteredContent>
                            <div>{i18n.t('Not available offline')}</div>
                        </CenteredContent>
                    </div>
                )
            } else {
                return renderContent && children
            }
        }

        return (
            <div
                ref={(ref) => (this.containerRef = ref)}
                style={style}
                className={className}
                data-test={`dashboarditem-${item.id}`}
                {...eventProps}
            >
                {getContent()}
            </div>
        )
    }
}

export default ProgressiveLoadingContainer
