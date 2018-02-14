import React, { Component, Fragment } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTreeMultipleRoots.component';
import { apiGetOrgUnits } from '../api/orgUnits';
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
        apiGetOrgUnits().then(roots => {
            this.setState({ roots });
        });
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
        //TODO: dispatch action to add selected org units to itemFilter store
        this.props.onRequestClose();
    };

    renderOrgUnitTree = () => {
        return (
            <Fragment>
                <p>Applies to favorites with "User org units" set</p>
                <div style={style.container}>
                    <OrgUnitTree
                        roots={this.state.roots}
                        selected={this.state.selected}
                        onSelectClick={this.onSelectOrgUnit}
                        hideCheckboxes
                    />
                </div>
            </Fragment>
        );
    };

    render() {
        console.log('selected', this.state.selected);

        const actions = [
            <FlatButton label="Cancel" onClick={this.props.onRequestClose} />,
            <FlatButton
                label="Save"
                backgroundColor={colors.royalBlue}
                hoverColor={colors.lightBlue}
                style={style.button}
                disabled={!this.state.selected.length}
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

export default ItemFilter;
