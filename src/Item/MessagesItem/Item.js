import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from 'd2-i18n';

import ItemHeader from '../ItemHeader';
import { fromMessages } from '../../reducers';
import Line from '../../widgets/Line';
import { formatDate } from '../../util';

import './MessagesItem.css';

const messageTypes = {
    PRIVATE: 'Private',
    VALIDATION_RESULT: 'Validation',
    TICKET: 'Ticket',
    SYSTEM: 'System',
};

const style = {
    list: {
        listStyleType: 'none',
        paddingLeft: '0px',
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

    messageHref = msg =>
        `${this.context.baseUrl}/dhis-web-messaging/#/${msg.messageType}/${
            msg.id
        }`;

    getMessageSender = msg => {
        const latestMsg = msg.messages.slice(-1)[0];
        return latestMsg.sender ? latestMsg.sender.displayName : '';
    };

    getMessageItems = () => {
        return this.props.messages.map((msg, i) => {
            const redirectToMsg = () => {
                if (!this.props.editMode) {
                    document.location.href = this.messageHref(msg.id);
                }
            };

            const from =
                msg.messageType === 'PRIVATE'
                    ? this.getMessageSender(msg)
                    : messageTypes[msg.messageType];

            const editClass = !this.props.editMode ? 'view' : null;
            const readClass = !msg.read ? 'unread' : null;
            const latestMsg = msg.messages.slice(-1)[0];
            const msgDate = latestMsg.lastUpdated;

            return (
                <li
                    className={`message-item ${editClass}`}
                    key={msg.id}
                    onClick={redirectToMsg}
                >
                    <p className={`message-title ${readClass}`}>
                        {msg.displayName} ({msg.messageCount})
                    </p>
                    <p className="message-sender">
                        {from} - {formatDate(msgDate, this.state.uiLocale)}
                    </p>
                    <p className="message-snippet">{latestMsg.text}</p>
                </li>
            );
        });
    };

    render() {
        const messageItems = this.getMessageItems();

        return (
            <Fragment>
                <ItemHeader title={i18n.t('Messages')} />
                <Line />
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
