import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import pick from 'lodash/pick'

const defaultDebounceMs = 100
const defaultBufferFactor = 0.25

const config = { attributes: true, childList: false, subtree: false }

class ProgressiveLoadingContainer extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        bufferFactor: PropTypes.number,
        className: PropTypes.string,
        debounceMs: PropTypes.number,
        itemId: PropTypes.string,
        style: PropTypes.object,
    }
    static defaultProps = {
        debounceMs: defaultDebounceMs,
        bufferFactor: defaultBufferFactor,
    }

    state = {
        shouldLoad: false,
    }
    containerRef = null
    shouldLoadHandler = null
    handlerOptions = { passive: true }

    callback = mutationsList => {
        const styleChanged = mutationsList.find(
            mutation => mutation.attributeName === 'style'
        )

        if (styleChanged) {
            setTimeout(() => this.checkShouldLoad(), 200)
        }
    }

    observer = new MutationObserver(this.callback)

    checkShouldLoad() {
        if (!this.containerRef) {
            return
        }

        const bufferPx = this.props.bufferFactor * window.innerHeight
        const rect = this.containerRef.getBoundingClientRect()

        if (
            rect.bottom > -bufferPx &&
            rect.top < window.innerHeight + bufferPx
        ) {
            this.setState({
                shouldLoad: true,
            })

            this.removeHandler()
        }
    }

    registerHandler() {
        this.shouldLoadHandler = debounce(
            () => this.checkShouldLoad(),
            this.props.debounceMs
        )

        Array.from(
            document.getElementsByClassName('dashboard-scroll-container')
        ).forEach(container => {
            container.addEventListener(
                'scroll',
                this.shouldLoadHandler,
                this.handlerOptions
            )
        })

        const targetNode = document.querySelector(
            `.reactgriditem-${this.props.itemId}`
        )

        this.observer.observe(targetNode, config)
    }

    removeHandler() {
        Array.from(
            document.getElementsByClassName('dashboard-scroll-container')
        ).forEach(container => {
            container.removeEventListener(
                'scroll',
                this.shouldLoadHandler,
                this.handlerOptions
            )
        })

        this.observer.disconnect()
    }

    componentDidMount() {
        this.registerHandler()
        this.checkShouldLoad()
    }

    componentWillUnmount() {
        this.removeHandler()
    }

    render() {
        const { children, className, style, ...props } = this.props
        const { shouldLoad } = this.state

        const eventProps = pick(props, [
            'onMouseDown',
            'onTouchStart',
            'onMouseUp',
            'onTouchEnd',
        ])

        return (
            <div
                ref={ref => (this.containerRef = ref)}
                style={style}
                className={className}
                data-test={`dashboarditem-${props.itemId}`}
                {...eventProps}
            >
                {shouldLoad && children}
            </div>
        )
    }
}

export default ProgressiveLoadingContainer
