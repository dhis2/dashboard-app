import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import classes from './styles/ControlBar.module.css'

//Matches the height of .dragHandle in ControlBar.module.css
export const DRAG_HANDLE_HEIGHT = 7

class ControlBar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dragging: false,
        }
    }

    onStartDrag = () => {
        this.setState({ dragging: true })
        window.addEventListener('mousemove', this.onDrag)
        window.addEventListener('mouseup', this.onEndDrag)
    }

    onDrag = event => {
        event.preventDefault()
        event.stopPropagation()

        const newHeight = event.clientY

        if (
            this.props.onChangeHeight &&
            newHeight !== this.props.height &&
            newHeight > 0
        ) {
            requestAnimationFrame(() => {
                this.props.onChangeHeight(newHeight)
            })
        }
    }

    onEndDrag = () => {
        this.setState({ dragging: false })
        window.removeEventListener('mousemove', this.onDrag)
        window.removeEventListener('mouseup', this.onEndDrag)

        if (this.props.onEndDrag) {
            this.props.onEndDrag()
        }
    }

    render() {
        const height = Math.max(this.props.height, 0) + DRAG_HANDLE_HEIGHT

        const rootClass = cx(
            classes.root,
            this.state.dragging && classes.dragging,
            this.props.isExpanded && classes.expanded
        )

        return (
            <div style={{ height }} className={rootClass}>
                {this.props.children}
                {typeof this.props.onChangeHeight === 'function' && (
                    <div
                        className={classes.draghandle}
                        onMouseDown={this.onStartDrag}
                        data-testid="controlbar-drag-handle"
                    />
                )}
            </div>
        )
    }
}

ControlBar.propTypes = {
    children: PropTypes.node.isRequired,
    height: PropTypes.number.isRequired,
    isExpanded: PropTypes.bool,
    onChangeHeight: PropTypes.func,
    onEndDrag: PropTypes.func,
}

ControlBar.defaultProps = {
    onChangeHeight: null,
    onEndDrag: null,
}

export default ControlBar
