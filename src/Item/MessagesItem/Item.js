import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ItemHeader from '../ItemHeader';
import { fromMessages } from '../../reducers';
import { colors } from '../../colors';
import { formatDate, sortByDate } from '../../util';

const style = {
    list: {
        listStyleType: 'none',
        paddingLeft: '0px',
    },
    listitem: {
        borderBottom: `1px solid ${colors.lightGrey}`,
        paddingBottom: '10px',
        margin: '0 5px 10px 5px',
    },
    line: {
        backgroundColor: `${colors.lightGrey}`,
        border: 'none',
        height: '1px',
        margin: '0px 0px 5px 0px',
    },
    date: {
        color: colors.mediumGrey,
        float: 'right',
        fontSize: '12px',
        lineHeight: '14px',
        textAlign: 'right',
    },
    title: {
        color: colors.darkGrey,
        fontSize: '13px',
        lineHeight: '17px',
    },
    author: {
        color: colors.darkGrey,
        fontSize: '12px',
        lineHeight: '14px',
    },
};

class MessagesItem extends Component {
    state = {
        uiLocale: '',
    };

    async componentDidMount() {
        const uiLocale = await this.context.d2.currentUser.userSettings.get(
            'keyUiLocale'
        );

        this.setState({ uiLocale });
    }

    conversationHref = id => {
        return `${
            this.context.baseUrl
        }/dhis-web-messaging/readMessage.action?id=${id}`;
    };

    render() {
        const { messages } = this.props;
        const messageItems = sortByDate(messages, 'lastUpdated', false).map(
            msg => {
                const listItemStyle = Object.assign({}, style.listitem, {
                    fontWeight: msg.read ? 'normal' : 'bold',
                });
                return (
                    <li style={listItemStyle} key={msg.id}>
                        <div>
                            <div style={style.author}>
                                {msg.userFirstname} {msg.userSurname} ({
                                    msg.messageCount
                                })
                            </div>
                            <div style={style.date}>
                                {formatDate(
                                    msg.lastUpdated,
                                    this.state.uiLocale
                                )}
                            </div>
                            <a href={this.conversationHref(msg.id)}>
                                <span style={style.title}>
                                    {msg.displayName}
                                </span>
                            </a>
                        </div>
                    </li>
                );
            }
        );

        return (
            <Fragment>
                <ItemHeader title="Messages" />
                <hr style={style.line} />
                <div className="dashboard-item-content">
                    <ul style={style.list}>{messageItems}</ul>
                </div>
            </Fragment>
        );
    }
}

MessagesItem.contextTypes = {
    d2: PropTypes.object,
    baseUrl: PropTypes.string,
};

const mapStateToProps = state => {
    return {
        messages: Object.values(fromMessages.sGetMessages(state)),
    };
};

const MessagesContainer = connect(mapStateToProps, null)(MessagesItem);

export default MessagesContainer;
