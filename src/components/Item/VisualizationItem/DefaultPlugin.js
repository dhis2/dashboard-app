import React, { Component } from 'react'
import PropTypes from 'prop-types'

import i18n from '@dhis2/d2-i18n'

import NoVisualizationMessage from './NoVisualizationMessage'
import * as pluginManager from './modules/plugin'
import { getBaseUrl, orObject } from '../../../modules/util'
import { getGridItemDomId } from '../../ItemGrid/gridUtil'

const pluginCredentials = d2 => {
    return {
        baseUrl: getBaseUrl(d2),
        auth: d2.Api.getApi().defaultHeaders.Authorization,
    }
}

class DefaultPlugin extends Component {
    pluginCredentials = null

    constructor(props, context) {
        super(props)

        this.d2 = context.d2
    }

    shouldPluginReload = prevProps => {
        // TODO - fix this hack, to handle bug with multiple
        // rerendering while switching between dashboards.
        //
        // To determine if the rendering is happening because of a
        // dashboard switch, check if the item reference has changed.
        const reloadAllowed = this.props.item === prevProps.item

        const filtersChanged = prevProps.itemFilters !== this.props.itemFilters
        const vis = orObject(this.props.visualization)
        const prevVis = orObject(prevProps.visualization)
        const visChanged =
            vis.id !== prevVis.id || vis.activeType !== prevVis.activeType

        return reloadAllowed && (visChanged || filtersChanged)
    }

    reloadPlugin = prevProps => {
        if (
            pluginManager.pluginIsAvailable(
                this.props.item,
                this.props.visualization
            ) &&
            this.shouldPluginReload(prevProps)
        ) {
            if (
                this.props.activeType !== prevProps.activeType ||
                this.props.itemFilters !== prevProps.itemFilters
            ) {
                pluginManager.unmount(this.props.item, prevProps.activeType)

                pluginManager.load(this.props.item, this.props.visualization, {
                    credentials: this.pluginCredentials,
                    activeType: this.props.activeType,
                })
            }
        }
    }

    componentDidMount() {
        this.pluginCredentials = pluginCredentials(this.d2)

        if (
            pluginManager.pluginIsAvailable(
                this.props.item,
                this.props.visualization
            )
        ) {
            pluginManager.load(this.props.item, this.props.visualization, {
                credentials: this.pluginCredentials,
                activeType: this.props.activeType,
                options: this.props.options,
            })
        }
    }

    componentDidUpdate(prevProps) {
        this.reloadPlugin(prevProps)
    }

    componentWillUnmount() {
        if (
            pluginManager.pluginIsAvailable(
                this.props.item,
                this.props.visualization
            )
        ) {
            pluginManager.unmount(this.props.item, this.props.activeType)
        }
    }

    render() {
        const { item, visualization, style } = this.props

        return pluginManager.pluginIsAvailable(item, visualization) ? (
            <div id={getGridItemDomId(item.id)} style={style} />
        ) : (
            <NoVisualizationMessage
                message={i18n.t('Unable to load the plugin for this item')}
            />
        )
    }
}

DefaultPlugin.contextTypes = {
    d2: PropTypes.object,
}

DefaultPlugin.propTypes = {
    activeType: PropTypes.string,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    options: PropTypes.object,
    style: PropTypes.object,
    visualization: PropTypes.object,
}

DefaultPlugin.defaultProps = {
    style: {},
    item: {},
    itemFilters: {},
    options: {},
    visualization: {},
}

export default DefaultPlugin
