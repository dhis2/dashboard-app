import React, { Component } from 'react';
import TextField from 'd2-ui/lib/text-field/TextField';
import Button from 'd2-ui/lib/button/Button';
import { colors } from '../colors';

const style = {
    button: {
        height: '30px',
        width: '16.84px',
        color: colors.charcoalGrey,
        fontFamily: 'inherit',
        fontSize: '13px',
        lineHeight: '15px',
    },
    container: {
        marginBottom: '5px',
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
        newText: '',
    };

    updateNewText = newText => {
        this.setState({ newText });
    };

    onClick = () => {
        this.props.onPost(this.state.newText);
        this.setState({ newText: '' });
    };

    render() {
        return (
            <div style={style.container}>
                <div style={style.textField}>
                    <TextField
                        multiLine
                        value={this.state.newText}
                        rows={1}
                        rowsMax={8}
                        fullWidth
                        style={style.text}
                        placeholder={this.props.placeholder}
                        onChange={this.updateNewText}
                    />
                </div>
                <Button style={style.button} onClick={this.onClick}>
                    {this.props.postText}
                </Button>
            </div>
        );
    }
}

export default InputField;
