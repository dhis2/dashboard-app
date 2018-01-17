import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ItemHeader from '../ItemHeader';
// import MessageItemHeaderButtons from './MessageItemHeaderButtons';
import { fromMessages } from '../../reducers';
import { colors } from '../../colors';
import { formatDate, sortByDate } from '../../util';

import './MessagesItem.css';

const style = {
    button: {
        background: 'none !important',
        border: 'none',
        color: colors.darkGrey,
        cursor: 'pointer',
        font: 'inherit',
        fontSize: '12px',
        height: '14px',
        lineJeight: '14px',
        marginRight: '10px',
        padding: '0 !important',
    },
    activeButton: {
        fontWeight: 'bold',
        textDecoration: 'underline',
    },
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
        filter: 'all',
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

    filterAll = () => {
        this.setState({ filter: 'all' });
    };

    filterUnread = () => {
        this.setState({ filter: 'unread' });
    };

    render() {
        const activeStyle = Object.assign({}, style.button, style.activeButton);

        const allButtonStyle =
            this.state.filter === 'all' ? activeStyle : style.button;
        const unreadButtonStyle =
            this.state.filter === 'unread' ? activeStyle : style.button;

        const actionButtons = !this.props.editMode ? (
            <Fragment>
                <button
                    className="messages-action-button"
                    type="button"
                    style={allButtonStyle}
                    onClick={this.filterAll}
                >
                    All
                </button>
                <button
                    className="messages-action-button"
                    type="button"
                    style={unreadButtonStyle}
                    onClick={this.filterUnread}
                >
                    Unread
                </button>
            </Fragment>
        ) : null;

        const { messages } = this.props;
        const filteredMessages = messages.filter(msg => {
            return this.state.filter === 'unread' ? msg.read === false : true;
        });
        const messageItems = sortByDate(
            filteredMessages,
            'lastUpdated',
            false
        ).map(msg => {
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
                            {formatDate(msg.lastUpdated, this.state.uiLocale)}
                        </div>
                        <a href={this.conversationHref(msg.id)}>
                            <span style={style.title}>{msg.displayName}</span>
                        </a>
                    </div>
                </li>
            );
        });

        return (
            <Fragment>
                <ItemHeader title="Messages" actionButtons={actionButtons} />
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
