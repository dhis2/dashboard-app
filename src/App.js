import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './App.css';
import './styles/gridstack-overrides.css';

import { getValueFromState } from './reducers';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import isFunction from 'd2-utilizr/lib/isFunction';

const $ = global.jQuery;

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

const data = [
    {x: 0, y: 0, width: 20, height: 15, text: "plugin item 1", id: "fzgIcU3hVFH", type: "REPORTTABLE"},
    {x: 20, y: 0, width: 20, height: 5, text: "plugin item 2", id: "DkPKc1EUmC2", type: "CHART"},
    {x: 20, y: 4, width: 20, height: 5, text: "plugin item 3", id: "hewtA7a025J", type: "CHART"},
    {x: 20, y: 8, width: 20, height: 5, text: "plugin item 4", id: "hrDweynvx7G", type: "REPORTTABLE"}
];

// TODO, add to plugin instead
global.reportTablePlugin.type = 'REPORTTABLE';
global.chartPlugin.type = 'CHART';

let grid;
let cache;

function getConfig() {
    const elements = Array.prototype.slice.call($('.grid-stack > .grid-stack-item'));
    const configObjects = [];
    let node;

    elements.forEach(function(element) {
        element = $(element);

        node = element.data('_gridstack_node');
        console.log("node", node);

        configObjects.push({
            x: node.x,
            y: node.y,
            width: node.width,
            height: node.height
        });
    });

    console.log("configObjects", configObjects);

    return configObjects;
}

function setConfig(config) {
    if (!config) {
        return;
    }

    grid.removeAll();

    config.forEach(function(node) {
        grid.addWidget($(
            '<div data-gs-id="' + node.id + '" data-gs-type="' + node.type + '" style="background-color:#fff">' +
                '<div class="grid-stack-item-content">' +
                    '<div class="dashboard-item-header" style="padding:2px">(' + node.text + ')</div>' +
                    '<div class="dashboard-item-content" id="plugin-' + node.id + '"></div>' +
                '</div>' +
            '</div>'),
            node.x, node.y, node.width, node.height);
    });
}

function storeConfig(config) {
    cache = config || getConfig();
}

function restoreConfig() {
    setConfig(cache);

    // plugins
    [global.reportTablePlugin, global.chartPlugin].forEach(plugin => {
        plugin.url = '//localhost:8080';
        plugin.username = 'admin';
        plugin.password = 'district';
        plugin.loadingIndicator = true;

        data.filter(d => d.type === plugin.type).map(d => ({id: d.id, el: "plugin-" + d.id, type: d.type})).forEach(d => plugin.add(d));

        plugin.load();

        data.forEach(d => {
            (function(el) {
                console.log(el);
            })(document.getElementById('plugin-' + d.id));
        });
    });
}

function init() {
    const el = $('.grid-stack');

    const itemResize = (e) => {
        setTimeout(() => {
            const el = document.getElementById('plugin-' + e.target.dataset.gsId);

            if (el && isFunction(el.setViewportSize)) {
                el.setViewportSize($(e.target).width() - 30, $(e.target).height() - 16);
            }
        }, 10);
    };

    const options = {
        verticalMargin: 10,
        width: 50
    };

    el.gridstack(options);

    el.on('resizestop', itemResize);

    grid = el.data('gridstack');

    storeConfig(data);

    restoreConfig();
}

const MyCmp = (props, context) => {
    console.log("<inside stateless sub component>", "props", props, "context", context);
    return <div style={{padding: "30px"}} onClick={props.klikk}>React provider context: {context.d2.currentUser.name}<br/>My prop: {props.myProp}</div>;
};

MyCmp.contextTypes = {
    d2: PropTypes.object
};

const mapStateToProps = (state) => ({
    myProp: getValueFromState(state)
});

const mapDispatchToProps = (dispatch) => ({
    klikk: () => dispatch({
        type: 'INCREMENT_VALUE'
    })
});

const MyCmpContainer = connect(mapStateToProps, mapDispatchToProps)(MyCmp);

// not using redux yet
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {id: 2};
        console.log("constructor (state: " + this.state);
    }
    componentWillMount() {
        console.log("componentWillMount");
    }
    render() {
        console.log("render (state: ", this.state, "props: ", this.props);
        return (
            <div>
                <HeaderBar />
                <MyCmpContainer />
                <div className="grid-stack"></div>
            </div>
        );
    }
    getChildContext() {
        console.log("getChildContext");
        return {
            d2: this.props.d2
        };
    }
    componentDidMount() {
        console.log("componentDidMount");
        init();

        const { store } = this.context;
        //const { d2 } = this.props;

        store.dispatch({
            type: 'SELECT_DASHBOARD',
            dashboard: {
                id: 1
            }
        });
    }
    shouldComponentUpdate() {
        console.log("componentShouldUpdate");
    }
}

App.contextTypes = {
    store: PropTypes.object
};

App.childContextTypes = {
    d2: PropTypes.object
};

export default App;
