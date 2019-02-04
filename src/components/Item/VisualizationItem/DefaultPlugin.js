import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'd2-i18n';

import * as pluginManager from './plugin';
import { getBaseUrl, orObject } from '../../../modules/util';

const pluginCredentials = d2 => {
    return {
        baseUrl: getBaseUrl(d2),
        auth: d2.Api.getApi().defaultHeaders.Authorization,
    };
};

class DefaultPlugin extends Component {
    pluginCredentials = null;

    shouldPluginReload = prevProps => {
        // TODO - fix this hack, to handle bug with multiple
        // rerendering while switching between dashboards.
        //
        // To determine if the rendering is happening because of a
        // dashboard switch, check if the item reference has changed.
        const reloadAllowed = this.props.item === prevProps.item;

        const filterChanged = prevProps.itemFilter !== this.props.itemFilter;
        const vis = orObject(this.props.visualization);
        const prevVis = orObject(prevProps.visualization);
        const visChanged =
            vis.id !== prevVis.id || vis.activeType !== prevVis.activeType;

        return reloadAllowed && (visChanged || filterChanged);
    };

    reloadPlugin = prevProps => {
        if (
            pluginManager.pluginIsAvailable(
                this.props.item,
                this.props.visualization
            ) &&
            this.shouldPluginReload(prevProps)
        ) {
            const prevVis = orObject(prevProps.visualization);
            const currentVis = this.props.visualization;

            const useActiveType =
                currentVis.activeType !== prevVis.activeType ||
                currentVis.activeType !== this.props.item.type
                    ? true
                    : false;

            if (
                useActiveType ||
                this.props.itemFilter !== prevProps.itemFilter
            ) {
                pluginManager.unmount(
                    this.props.item,
                    prevVis.activeType || this.props.item.type
                );

                pluginManager.load(
                    this.props.item,
                    this.pluginCredentials,
                    useActiveType ? currentVis.activeType : null,
                    this.props.itemFilter
                );
            }
        }
    };

    componentDidMount() {
        this.pluginCredentials = pluginCredentials(this.context.d2);

        if (
            pluginManager.pluginIsAvailable(
                this.props.item,
                this.props.visualization
            )
        ) {
            pluginManager.load(
                this.props.item,
                this.pluginCredentials,
                !this.props.editMode
                    ? orObject(this.props.visualization).activeType
                    : null,
                this.props.itemFilter
            );
        }
    }

    componentDidUpdate(prevProps) {
        this.reloadPlugin(prevProps);
    }

    getActiveType = () =>
        this.props.visualization.activeType || this.props.item.type;

    onSelectVisualization = activeType => {
        // Cancel request if type is already active
        if (activeType === this.getActiveType()) {
            return;
        }

        pluginManager.unmount(
            this.props.item,
            this.props.visualization.activeType || this.props.item.type
        );

        this.props.onSelectVisualization(
            this.props.visualization.id,
            this.props.item.type,
            activeType
        );
    };

    render() {
        const { classes, item, visualization } = this.props;
        const pluginIsAvailable = pluginManager.pluginIsAvailable(
            item,
            visualization
        );

        return !pluginIsAvailable ? (
            <div className={classes.textDiv}>
                {i18n.t('Unable to load the plugin for this item')}
            </div>
        ) : null;
    }
}

DefaultPlugin.contextTypes = {
    d2: PropTypes.object,
};

DefaultPlugin.propTypes = {
    itemFilter: PropTypes.object,
    visualization: PropTypes.object,
};

DefaultPlugin.defaultProps = {
    itemFilter: {},
    visualization: {},
};

export default DefaultPlugin;
