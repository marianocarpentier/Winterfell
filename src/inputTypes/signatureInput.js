import React from 'react';

export default class SignatureInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value.type ? this.props.value.value : this.props.value
    };
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    }, this.props.onChange.bind(null, {
      type: 'signature',
      value: e.target.value
    }));
  }

  render() {
    return (
      <input
        type="text"
        name={this.props.name}
        id={this.props.id}
        aria-labelledby={this.props.labelId}
        className={this.props.classes.signature}
        placeholder={this.props.placeholder}
        value={this.state.value}
        required={this.props.required
          ? 'required'
          : undefined}
        onChange={this.handleChange.bind(this)}
        onFocus={this.props.onFocus.bind(null, this.props.id)}
        onBlur={this.props.onBlur.bind(null, this.state.value)}
        onKeyDown={this.props.onKeyDown}
      />
    );
  }
}

SignatureInput.defaultProps = {
  classes: {},
  name: '',
  id: '',
  value: '',
  placeholder: '',
  onChange: () => {
  },
  onBlur: () => {
  },
  onKeyDown: () => {
  },
  onFocus: () => {
  }
};
