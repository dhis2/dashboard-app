import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const FilterCard = props => (
    <Card>
        <CardHeader
            title={props.title}
            actAsExpander={true}
            showExpandableButton={true}
        />
        <CardText expandable={true}>
            <div>Show orgunit tree</div>
            <FlatButton label="Save filter" />
        </CardText>
    </Card>
);

export default FilterCard;
