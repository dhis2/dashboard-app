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

    checkShouldLoad() {
        const bufferPx = this.props.bufferFactor * window.innerHeight

        if (!this.containerRef) {
            return
        }

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

        const containers = [
            window, // this is probably unnecessary
            ...document.getElementsByClassName('app-shell-app'),
        ]
        containers.forEach(container => {
            container.addEventListener('scroll', this.shouldLoadHandler)
        })
    }
    removeHandler() {
        const containers = [
            window, // this is probably unnecessary
            ...document.getElementsByClassName('app-shell-app'),
        ]
        containers.forEach(container => {
            container.removeEventListener('scroll', this.shouldLoadHandler)
        })
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
                {...eventProps}
            >
                {shouldLoad && children}
            </div>
        )
    }
}

export default ProgressiveLoadingContainer
