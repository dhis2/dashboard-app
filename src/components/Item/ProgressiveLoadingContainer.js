import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

const defaultDebounceMs = 100;
const defaultBufferPx = 0;
const defaultInitialBufferFactor = 0.5;

class ProgressiveLoadingContainer extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        debounceMs: PropTypes.number,
        bufferPx: PropTypes.number,
        initialBufferFactor: PropTypes.number,
    };
    static defaultProps = {
        debounceMs: defaultDebounceMs,
        bufferPx: defaultBufferPx,
        initialBufferFactor: defaultInitialBufferFactor,
    };

    state = {
        shouldLoad: false,
    };
    containerRef = null;
    shouldLoadHandler = null;

    checkShouldLoad(customBufferPx) {
        const bufferPx = customBufferPx || this.props.bufferPx;

        if (!this.containerRef) {
            return;
        }

        const rect = this.containerRef.getBoundingClientRect();
        if (
            rect.bottom > -bufferPx &&
            rect.top < window.innerHeight + bufferPx
        ) {
            this.setState({
                shouldLoad: true,
            });

            this.removeHandler();
        }
    }

    registerHandler() {
        this.shouldLoadHandler = debounce(
            () => this.checkShouldLoad(),
            this.props.debounceMs
        );

        window.addEventListener('scroll', this.shouldLoadHandler);
    }
    removeHandler() {
        window.removeEventListener('scroll', this.shouldLoadHandler);
    }

    componentDidMount() {
        this.registerHandler();

        const initialBufferPx = this.props.initialBufferFactor
            ? this.props.initialBufferFactor * window.innerHeight
            : undefined;
        this.checkShouldLoad(initialBufferPx);
    }

    componentWillUnmount() {
        this.removeHandler();
    }

    render() {
        const {
            children,
            debounceMs,
            bufferPx,
            initialBufferFactor,
            ...props
        } = this.props;
        const { shouldLoad } = this.state;

        return (
            <div ref={ref => (this.containerRef = ref)} {...props}>
                {shouldLoad && children}
            </div>
        );
    }
}

export default ProgressiveLoadingContainer;
