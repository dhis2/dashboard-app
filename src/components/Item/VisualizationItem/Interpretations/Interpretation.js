import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Parser as RichTextParser } from '@dhis2/d2-ui-rich-text';
import i18n from 'd2-i18n';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import { sGetUserId, sGetIsSuperuser } from '../../../../reducers/user';
import { colors } from '../../../../modules/colors';
import { formatDate, sortByDate } from '../../../../modules/util';
import { getLink } from '../plugin';
import {
    tLikeInterpretation,
    tUnlikeInterpretation,
    tAddInterpretationComment,
    tUpdateInterpretation,
    tDeleteInterpretationComment,
    tDeleteInterpretation,
    tUpdateInterpretationComment,
} from './actions';
import InputField from './InputField';

import './Interpretation.css';

const actionButtonClass = 'interpretation-action-button';
const style = {
    author: {
        color: colors.darkGrey,
        fontSize: '13px',
        fontWeight: '500',
        lineHeight: '15px',
    },
    created: {
        color: colors.mediumGrey,
        float: 'right',
        fontSize: '12px',
        lineHeight: '14px',
        textAlign: 'right',
    },
    deleteButton: {
        color: colors.red,
    },
    icon: {
        height: '12px',
        marginBottom: '-2px',
        paddingRight: '2px',
        width: '12px',
    },
    likes: {
        margin: '0 10px 0 0',
        color: colors.darkGrey,
        fontSize: '12px',
        lineHeight: '14px',
    },
    line: {
        backgroundColor: `${colors.lightGrey}`,
        border: 'none',
        height: '1px',
        margin: '-1px 0px 0px',
    },
    list: {
        listStyleType: 'none',
        marginTop: '10px',
        marginLeft: '37px',
        paddingLeft: '0px',
    },
    text: {
        color: colors.darkGrey,
        fontSize: '13px',
        lineHeight: '17px',
        whiteSpace: 'pre-line',
        wordWrap: 'break-word',
    },
};

const deleteButtonIconStyle = Object.assign({}, style.icon, {
    fill: colors.red,
});

const DeleteButton = ({ action }) => (
    <button
        className={actionButtonClass}
        style={style.deleteButton}
        onClick={action}
    >
        <SvgIcon style={deleteButtonIconStyle} icon="Delete" />
        {i18n.t('Delete')}
    </button>
);

const EditButton = ({ action, text }) => (
    <button className={actionButtonClass} onClick={action}>
        <SvgIcon style={style.icon} icon="Create" />
        {text}
    </button>
);

class Interpretation extends Component {
    state = {
        showCommentField: false,
        uiLocale: '',
        visualizerHref: '',
        editId: '',
    };

    componentDidMount() {
        this.context.d2.currentUser.userSettings
            .get('keyUiLocale')
            .then(uiLocale => this.setState({ uiLocale }));

        const visualizerHref = `${getLink(
            this.props.object,
            this.context.d2
        )}/interpretation/${this.props.interpretation.id}`;
        this.setState({ visualizerHref });
    }

    userLikesInterpretation = () => {
        return this.props.interpretation.likedBy.find(liker =>
            this.userIsOwner(liker.id)
        );
    };

    toggleInterpretationLike = () => {
        const { id } = this.props.interpretation;

        this.userLikesInterpretation()
            ? this.props.unlikeInterpretation(id)
            : this.props.likeInterpretation(id);
    };

    toggleCommentField = () => {
        this.setState({ showCommentField: !this.state.showCommentField });
    };

    postComment = text => {
        const { id } = this.props.interpretation;
        this.props.addComment({ id, text });
        this.toggleCommentField();
    };

    submitComment = text => {
        if (this.state.editId === '') {
            this.postComment(text);
        } else {
            const { id } = this.props.interpretation;
            id === this.state.editId
                ? this.props.updateInterpretation({ id, text })
                : this.props.updateInterpretationComment({
                      id,
                      commentId: this.state.editId,
                      text,
                  });
            this.toggleEdit(this.state.editId);
        }
    };

    renderCommentOrEditField = item => {
        return this.state.editId === item.id ? (
            <InputField
                text={item.text}
                placeholder={i18n.t('Edit your interpretation')}
                postText={i18n.t('Update')}
                onSubmit={this.submitComment}
            />
        ) : (
            <RichTextParser style={style.text}>{item.text}</RichTextParser>
        );
    };

    toggleEdit = commentId => {
        this.state.editId === commentId
            ? this.setState({ editId: '' })
            : this.setState({ editId: commentId });
    };

    deleteComment = commentId => {
        const { id } = this.props.interpretation;
        this.props.deleteComment({ id, commentId });
    };

    deleteInterpretation = () => {
        const data = {
            id: this.props.interpretation.id,
            objectId: this.props.objectId,
            objectType: this.props.object.type,
        };
        this.props.deleteInterpretation(data);
    };

    hasDeleteAccess = ownerId => {
        return this.userIsOwner(ownerId) || this.props.userIsSuperuser;
    };

    userIsOwner = ownerId => ownerId === this.props.userId;

    getEditText = id =>
        id && id === this.state.editId ? i18n.t('Cancel edit') : i18n.t('Edit');

    renderActions() {
        const likes =
            this.props.interpretation.likedBy.length === 1
                ? i18n.t('like')
                : i18n.t('likes');

        const thumbsUpIcon = this.userLikesInterpretation()
            ? Object.assign({}, style.icon, { fill: colors.lightGreen })
            : style.icon;

        const likeText = this.userLikesInterpretation()
            ? i18n.t('You like this')
            : i18n.t('Like');

        return (
            <div>
                <a
                    href={this.state.visualizerHref}
                    style={{
                        height: 16,
                        color: '#494949',
                        fontSize: '12px',
                        marginRight: '10px',
                    }}
                >
                    <SvgIcon style={style.icon} icon="Launch" />
                    {i18n.t('View in Visualizer')}
                </a>
                {this.userIsOwner(this.props.interpretation.user.id) && (
                    <EditButton
                        action={() =>
                            this.toggleEdit(this.props.interpretation.id)
                        }
                        text={this.getEditText(this.props.interpretation.id)}
                    />
                )}
                <button
                    className={actionButtonClass}
                    onClick={this.toggleCommentField}
                >
                    <SvgIcon style={style.icon} icon="Reply" />
                    {i18n.t('Reply')}
                </button>
                <button
                    className={actionButtonClass}
                    onClick={this.toggleInterpretationLike}
                >
                    <SvgIcon style={thumbsUpIcon} icon="ThumbUp" />
                    {likeText}
                </button>
                <span style={style.likes}>
                    {this.props.interpretation.likedBy.length} {likes}
                </span>
                {this.hasDeleteAccess(this.props.interpretation.user.id) && (
                    <DeleteButton action={this.deleteInterpretation} />
                )}
            </div>
        );
    }

    renderComments() {
        if (!this.props.interpretation.comments.length) {
            return null;
        }

        const comments = sortByDate(
            this.props.interpretation.comments,
            'created'
        ).map(comment => (
            <li
                className="comment-container"
                style={style.comment}
                key={comment.id}
            >
                <div>
                    <span style={style.author}>{comment.user.displayName}</span>
                    <span style={style.created}>
                        {formatDate(comment.created, this.state.uiLocale)}
                    </span>
                </div>
                {this.renderCommentOrEditField(comment)}
                {this.userIsOwner(comment.user.id) && (
                    <EditButton
                        action={() => this.toggleEdit(comment.id)}
                        text={this.getEditText(comment.id)}
                    />
                )}
                {this.hasDeleteAccess(comment.user.id) && (
                    <DeleteButton
                        action={() => this.deleteComment(comment.id)}
                    />
                )}
            </li>
        ));

        return <ul style={style.list}>{comments}</ul>;
    }

    render() {
        const interpretationBody = item => {
            return (
                <div>
                    <div>
                        <span style={style.author}>
                            {item.user.displayName}
                        </span>
                        <span style={style.created}>
                            {formatDate(item.created, this.state.uiLocale)}
                        </span>
                    </div>
                    {this.renderCommentOrEditField(item)}
                </div>
            );
        };

        return (
            <div>
                <div className="interpretation-container">
                    {interpretationBody(this.props.interpretation)}
                    {this.renderActions()}
                </div>
                {this.renderComments()}
                {this.state.showCommentField ? (
                    <div style={{ marginLeft: '37px' }}>
                        <InputField
                            placeholder={i18n.t('Add your reply')}
                            onSubmit={this.submitComment}
                            postText={i18n.t('Reply')}
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userId: sGetUserId(state),
    userIsSuperuser: sGetIsSuperuser(state),
});

const mapDispatchToProps = dispatch => ({
    likeInterpretation: data => dispatch(tLikeInterpretation(data)),
    unlikeInterpretation: data => dispatch(tUnlikeInterpretation(data)),
    addComment: data => dispatch(tAddInterpretationComment(data)),
    updateInterpretation: data => dispatch(tUpdateInterpretation(data)),
    updateInterpretationComment: data =>
        dispatch(tUpdateInterpretationComment(data)),
    deleteComment: data => dispatch(tDeleteInterpretationComment(data)),
    deleteInterpretation: data => dispatch(tDeleteInterpretation(data)),
});

Interpretation.contextTypes = {
    d2: PropTypes.object,
};

const InterpretationContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Interpretation);

export default InterpretationContainer;
