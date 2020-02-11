import React, { Component } from 'react';
import PropTypes from 'prop-types';

import i18n from '@dhis2/d2-i18n';

import * as pluginManager from './plugin';
import { getBaseUrl, orObject } from '../../../modules/util';
import { getDefaultView } from '../../../modules/visualizationViewTypes';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';

const pluginCredentials = d2 => {
    return {
        baseUrl: getBaseUrl(d2),
        auth: d2.Api.getApi().defaultHeaders.Authorization,
    };
};

class DefaultPlugin extends Component {
    pluginCredentials = null;

    constructor(props, context) {
        super(props);

        this.d2 = context.d2;
    }

    shouldPluginReload = prevProps => {
        // TODO - fix this hack, to handle bug with multiple
        // rerendering while switching between dashboards.
        //
        // To determine if the rendering is happening because of a
        // dashboard switch, check if the item reference has changed.
        const reloadAllowed = this.props.item === prevProps.item;

        const filtersChanged = prevProps.itemFilters !== this.props.itemFilters;
        const vis = orObject(this.props.visualization);
        const prevVis = orObject(prevProps.visualization);
        const visChanged =
            vis.id !== prevVis.id || vis.activeView !== prevVis.activeView;

        return reloadAllowed && (visChanged || filtersChanged);
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

            const useActiveView =
                currentVis.activeView !== prevVis.activeView ||
                currentVis.activeView !== getDefaultView(this.props.item.type);

            if (
                useActiveView ||
                this.props.itemFilters !== prevProps.itemFilters
            ) {
                pluginManager.unmount(
                    this.props.item,
                    prevVis.activeView || getDefaultView(this.props.item.type)
                );

                pluginManager.load(this.props.item, this.props.visualization, {
                    credentials: this.pluginCredentials,
                    activeView: useActiveView ? currentVis.activeView : null,
                });
            }
        }
    };

    componentDidMount() {
        this.pluginCredentials = pluginCredentials(this.d2);

        if (
            pluginManager.pluginIsAvailable(
                this.props.item,
                this.props.visualization
            )
        ) {
            pluginManager.load(this.props.item, this.props.visualization, {
                credentials: this.pluginCredentials,
                activeView: !this.props.editMode ? this.getActiveView() : null,
            });
        }
    }

    componentDidUpdate(prevProps) {
        this.reloadPlugin(prevProps);
    }

    getActiveView = () =>
        this.props.visualization.activeView ||
        getDefaultView(this.props.item.type);

    render() {
        const { classes, item, visualization, style } = this.props;
        const pluginIsAvailable = pluginManager.pluginIsAvailable(
            item,
            visualization
        );

        return pluginIsAvailable ? (
            <div id={getGridItemDomId(item.id)} style={style} />
        ) : (
            <div className={classes.textDiv}>
                {i18n.t('Unable to load the plugin for this item')}
            </div>
        );
    }
}

DefaultPlugin.contextTypes = {
    d2: PropTypes.object,
};

DefaultPlugin.propTypes = {
    classes: PropTypes.object,
    editMode: PropTypes.bool,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    style: PropTypes.object,
    visualization: PropTypes.object,
};

DefaultPlugin.defaultProps = {
    style: {},
    item: {},
    itemFilters: {},
    visualization: {},
};

export default DefaultPlugin;
