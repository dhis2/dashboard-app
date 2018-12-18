import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'd2-ui/lib/text-field/TextField';
import Button from 'd2-ui/lib/button/Button';
import { colors } from '../../../../modules/colors';

import { Editor as RichTextEditor } from '@dhis2/d2-ui-rich-text';
import MentionsWrapper from '@dhis2/d2-ui-mentions-wrapper';

const style = {
    button: {
        height: '30px',
        width: '16.84px',
        top: '10px',
        left: '3px',
        color: colors.charcoalGrey,
        fontFamily: 'inherit',
        fontSize: '13px',
        lineHeight: '15px',
    },
    container: {
        marginBottom: '5px',
        width: '100%',
        display: 'inline-flex',
    },
    text: {
        fontSize: '14px',
        fontStretch: 'normal',
    },
    textField: {
        width: '80%',
        display: 'inline-block',
    },
};

class InputField extends Component {
    state = {
        newText: this.props.text || '',
    };

    updateNewText = newText => {
        this.setState({ newText });
    };

    onClick = () => {
        this.props.onSubmit(this.state.newText);
        this.setState({ newText: '' });
    };

    render() {
        return (
            <div style={style.container}>
                <div style={style.textField}>
                    <MentionsWrapper
                        d2={this.context.d2}
                        onUserSelect={this.updateNewText}
                    >
                        <RichTextEditor onEdit={this.updateNewText}>
                            <TextField
                                multiline
                                value={this.state.newText}
                                rows={1}
                                rowsMax={8}
                                fullWidth
                                style={style.text}
                                placeholder={this.props.placeholder}
                                onChange={this.updateNewText}
                            />
                        </RichTextEditor>
                    </MentionsWrapper>
                </div>
                <Button
                    disabled={!this.state.newText.length}
                    style={style.button}
                    onClick={this.onClick}
                >
                    {this.props.postText}
                </Button>
            </div>
        );
    }
}

InputField.contextTypes = {
    d2: PropTypes.object,
};

InputField.defaultProps = {
    text: null,
    placeholder: null,
    postText: null,
    onSubmit: null,
};

InputField.propTypes = {
    text: PropTypes.string,
    placeholder: PropTypes.string,
    postText: PropTypes.string,
    onSubmit: PropTypes.func,
};

export default InputField;
