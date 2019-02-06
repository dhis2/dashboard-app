import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

const defaultDebounceThresholdMs = 100;
const defaultWindowBufferPx = 0;

class ProgressiveLoadingContainer extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        debounceThresholdMs: PropTypes.number,
        windowBufferPx: PropTypes.number,
    };
    static defaultProps = {
        debounceThresholdMs: defaultDebounceThresholdMs,
        windowBufferPx: defaultWindowBufferPx,
    };

    state = {
        shouldLoad: false,
    };
    containerRef = null;
    checkShouldLoad = () => {
        if (!this.containerRef) {
            return;
        }
        console.log(this.containerRef.getBoundingClientRect());
        const rect = this.containerRef.getBoundingClientRect();
        if (
            rect.bottom > -this.props.windowBufferPx &&
            rect.top < window.innerHeight + this.props.windowBufferPx
        ) {
            this.setState({
                shouldLoad: true,
            });

            this.removeHandler();
        }
    };

    registerHandler() {
        this.checkShouldLoad = debounce(
            this.checkShouldLoad,
            this.props.debounceThresholdMs
        );

        window.addEventListener('scroll', this.checkShouldLoad);
    }
    removeHandler() {
        window.removeEventListener('scroll', this.checkShouldLoad);
    }

    componentDidMount() {
        this.registerHandler();
        this.checkShouldLoad();
    }

    componentWillUnmount() {
        this.removeHandler();
    }

    render() {
        const {
            children,
            debounceThresholdMs,
            windowBufferPx,
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
