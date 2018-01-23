import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListItem as MUIListItem } from 'material-ui/List';
import Button from 'd2-ui/lib/button/Button';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import ItemHeader from '../ItemHeader';
import { sGetEditDashboard } from '../../reducers/editDashboard';
import { itemTypeMap } from '../../util';
import { tRemoveListItemContent } from './actions';

const ListItem = (props, context) => {
    const { item, editMode, tRemoveListItemContent } = props;

    let contentItems = item[itemTypeMap[item.type].endPointName] || [];

    // avoid showing duplicates
    contentItems = item[itemTypeMap[item.type].endPointName].filter(
        (item, index, array) =>
            array.findIndex(el => el.id === item.id) === index
    );

    const title = () => {
        const type = itemTypeMap[item.type].endPointName;

        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const getLink = id => {
        let url;

        switch (item.type) {
            case 'REPORTS':
                url = `dhis-web-reporting/getReportParams.action?mode=report&uid=${id}`;
                break;
            case 'RESOURCES':
                url = `api/documents/${id}/data`;
                break;
            case 'USERS':
                url = `dhis-web-messaging/profile.action?uid=${id}`;
                break;
            default:
                break;
        }

        return `${context.baseUrl}/${url}`;
    };

    const removeContent = contentToRemove => () => {
        tRemoveListItemContent(item, contentToRemove);
    };

    return (
        <Fragment>
            <ItemHeader title={title()} />
            <List className="dashboard-item-content">
                {contentItems.map(contentItem => (
                    <MUIListItem
                        key={contentItem.id}
                        primaryText={
                            <a
                                style={{ textDecoration: 'none' }}
                                href={getLink(contentItem.id)}
                            >
                                {contentItem.name}
                            </a>
                        }
                        rightIconButton={
                            editMode ? (
                                <Button onClick={removeContent(contentItem)}>
                                    <SvgIcon icon="Delete" />
                                </Button>
                            ) : null
                        }
                    />
                ))}
            </List>
        </Fragment>
    );
};

ListItem.contextTypes = {
    baseUrl: PropTypes.string,
};

const ListItemContainer = connect(
    state => ({
        editDashboard: sGetEditDashboard(state),
    }),
    {
        tRemoveListItemContent,
    }
)(ListItem);

export default ListItemContainer;
