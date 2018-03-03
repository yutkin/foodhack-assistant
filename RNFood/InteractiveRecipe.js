/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {};
export default class Recipe extends Component<Props> {
  static navigationOptions = {
    title: 'Interactive Mode',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Some Text</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
