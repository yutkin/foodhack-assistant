import React, { Component } from 'react';
import {
  Platform,
  // View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = {
  text: {
    marginLeft: 8,
    marginRight: 30,
    marginBottom: 20,
    fontSize: 28,
    fontWeight: 'bold',
  },
};

/* eslint-disable react/prefer-stateless-function */
export default class Title extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    style: PropTypes.object,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    return (
      <Text style={{ ...styles.text, ...this.props.style }}>{this.props.text}</Text>
    );
  }
}
