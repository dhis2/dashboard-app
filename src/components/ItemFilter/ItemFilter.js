import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import { OrgUnitTreeMultipleRoots } from '@dhis2/d2-ui-org-unit-tree';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import FlatButton from '../../widgets/FlatButton';
import PrimaryButton from '../../widgets/PrimaryButton';
import { apiFetchOrgUnits } from '../../api/orgUnits';
import {
    acSetItemFilter,
    FILTER_USER_ORG_UNIT,
} from '../../actions/itemFilter';
import { sGetItemFilterRoot } from '../../reducers/itemFilter';
import D2TextLink from '../../widgets/D2TextLink';

const style = {
    container: {
        height: '500px',
        overflowY: 'auto',
        border: '1px solid #eee',
        padding: '10px 7px',
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

    onDeselectAll = () => {
        this.setState({
            selected: [],
        });
    };

    onSubmit = () => {
        this.props.acSetItemFilter(FILTER_USER_ORG_UNIT, this.state.selected);
        this.props.onRequestClose();
    };

    renderOrgUnitTree = () => {
        return (
            <Fragment>
                <div
                    style={{
                        fontSize: '13px',
                        marginTop: '5px',
                        marginBottom: '16px',
                    }}
                >
                    <SvgIcon
                        icon="Info"
                        style={{
                            fill: '#888',
                            position: 'relative',
                            top: '7px',
                            marginRight: '5px',
                        }}
                    />
                    Filtering only applies to favorites with "User org units"
                    set
                </div>
                <div style={style.container}>
                    <div style={{ padding: '1px 0 12px 6px' }}>
                        <D2TextLink
                            text="Deselect all"
                            onClick={this.onDeselectAll}
                            style={{ color: '#006ed3' }}
                            hoverStyle={{ color: '#3399f8' }}
                        />
                    </div>
                    <OrgUnitTreeMultipleRoots
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
        const actions = [
            <FlatButton onClick={this.props.onRequestClose}>Cancel</FlatButton>,
            <PrimaryButton onClick={this.onSubmit}>Save</PrimaryButton>,
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
    selected: sGetItemFilterRoot(state)[FILTER_USER_ORG_UNIT] || [],
});

const ItemFilterCt = connect(
    mapStateToProps,
    { acSetItemFilter }
)(ItemFilter);

export default ItemFilterCt;
