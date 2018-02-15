import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTreeMultipleRoots.component';
import { apiFetchOrgUnits } from '../api/orgUnits';
import { acSetItemFilter, FILTER_USER_ORG_UNIT } from '../actions/itemFilter';
import { sGetFromState } from '../reducers/itemFilter';
import { colors } from '../colors';

const style = {
    container: {
        height: '500px',
        overflowY: 'auto',
    },
    button: {
        color: colors.white,
    },
};

class ItemFilter extends Component {
    state = {
        roots: [],
        selected: [],
    };

    componentDidMount() {
        apiFetchOrgUnits().then(roots => {
            this.setState({ roots });
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ selected: nextProps.selected });
    }

    onSelectOrgUnit = (e, orgUnit) => {
        let selected;

        if (this.state.selected.includes(orgUnit.path)) {
            selected = this.state.selected.filter(ou => ou !== orgUnit.path);
        } else {
            selected = this.state.selected.concat(orgUnit.path);
        }

        this.setState({ selected });
    };

    onSubmit = () => {
        this.props.acSetItemFilter(FILTER_USER_ORG_UNIT, this.state.selected);
        this.props.onRequestClose();
    };

    renderOrgUnitTree = () => {
        // const selected = this.state.selected.map(s => s.path);
        return (
            <Fragment>
                <p>Applies to favorites with "User org units" set</p>
                <div style={style.container}>
                    <OrgUnitTree
                        roots={this.state.roots}
                        selected={this.state.selected}
                        onSelectClick={this.onSelectOrgUnit}
                        initiallyExpanded={this.state.selected}
                        hideCheckboxes
                    />
                </div>
            </Fragment>
        );
    };

    render() {
        const actions = [
            <FlatButton label="Cancel" onClick={this.props.onRequestClose} />,
            <FlatButton
                label="Save"
                backgroundColor={colors.royalBlue}
                hoverColor={colors.lightBlue}
                style={style.button}
                onClick={this.onSubmit}
            />,
        ];

        return (
            <Dialog
                title="Organisation unit filter"
                actions={actions}
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.onRequestClose}
            >
                {this.renderOrgUnitTree()}
            </Dialog>
        );
    }
}

const mapStateToProps = state => ({
    selected: sGetFromState(state)[FILTER_USER_ORG_UNIT] || [],
});

const ItemFilterCt = connect(mapStateToProps, { acSetItemFilter })(ItemFilter);

export default ItemFilterCt;
