'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDatepicker = require('react-datepicker');

var _reactDatepicker2 = _interopRequireDefault(_reactDatepicker);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('react-datepicker/dist/react-datepicker.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DateInput = function (_React$Component) {
  _inherits(DateInput, _React$Component);

  function DateInput(props) {
    _classCallCheck(this, DateInput);

    var _this = _possibleConstructorReturn(this, (DateInput.__proto__ || Object.getPrototypeOf(DateInput)).call(this, props));

    _this.state = {
      value: _this.props.value.type ? (0, _moment2.default)(_this.props.value.value) : _this.props.value
    };

    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(DateInput, [{
    key: 'handleChange',
    value: function handleChange(date) {
      this.setState({
        value: date
      }, this.props.onChange.bind(null, { type: 'date', value: date }));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _onFocus = this.props.onFocus;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_reactDatepicker2.default, {
          name: '' + this.props.name,
          id: '' + this.props.id,
          'aria-labelledby': '' + this.props.labelId,
          className: this.props.classes.input,
          selected: this.state.value,
          onSelect: this.props.onBlur,
          onFocus: function onFocus() {
            return _onFocus(_this2.props.id);
          },
          onChange: this.handleChange,
          dateFormat: 'LL'
        })
      );
    }
  }]);

  return DateInput;
}(_react2.default.Component);

exports.default = DateInput;


DateInput.defaultProps = {
  classes: {},
  name: '',
  id: '',
  value: (0, _moment2.default)(),
  onChange: function onChange() {},
  onBlur: function onBlur() {},
  onFocus: function onFocus() {}
};