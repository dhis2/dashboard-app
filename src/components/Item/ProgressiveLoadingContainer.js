import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import pick from 'lodash/pick';

const defaultDebounceMs = 100;
const defaultBufferFactor = 0.25;

class ProgressiveLoadingContainer extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        bufferFactor: PropTypes.number,
        className: PropTypes.string,
        debounceMs: PropTypes.number,
        forceLoad: PropTypes.bool,
        style: PropTypes.object,
    };
    static defaultProps = {
        debounceMs: defaultDebounceMs,
        bufferFactor: defaultBufferFactor,
    };

    state = {
        shouldLoad: false,
    };
    containerRef = null;
    shouldLoadHandler = null;

    checkShouldLoad() {
        const bufferPx = this.props.bufferFactor * window.innerHeight;

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
        this.checkShouldLoad();
    }

    componentWillUnmount() {
        this.removeHandler();
    }

    render() {
        const { children, className, style, forceLoad, ...props } = this.props;
        const { shouldLoad } = this.state;

        const loadit = forceLoad || shouldLoad;

        const eventProps = pick(props, [
            'onMouseDown',
            'onTouchStart',
            'onMouseUp',
            'onTouchEnd',
        ]);

        return (
            <div
                ref={ref => (this.containerRef = ref)}
                style={style}
                className={className}
                {...eventProps}
            >
                {loadit && children}
            </div>
        );
    }
}

export default ProgressiveLoadingContainer;
