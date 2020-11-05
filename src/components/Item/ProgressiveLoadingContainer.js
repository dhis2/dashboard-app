import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import pick from 'lodash/pick'

const defaultDebounceMs = 100
const defaultBufferFactor = 0.25

class ProgressiveLoadingContainer extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        bufferFactor: PropTypes.number,
        className: PropTypes.string,
        debounceMs: PropTypes.number,
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

        document
            .getElementsByClassName('dashboard-wrapper')[0]
            ?.addEventListener(
                'scroll',
                this.shouldLoadHandler,
                this.handlerOptions
            )
    }

    removeHandler() {
        document
            .getElementsByClassName('dashboard-wrapper')[0]
            ?.removeEventListener(
                'scroll',
                this.shouldLoadHandler,
                this.handlerOptions
            )
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
                data-test={`dhis2-dashboard-dashboard-item-prog-${props.itemId}`}
                {...eventProps}
            >
                {shouldLoad && children}
            </div>
        )
    }
}

export default ProgressiveLoadingContainer
