/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default class Recipe extends Component {
  static navigationOptions = {
    title: 'Recipe',
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <Text>Some Text</Text>

        <Button
          onPress={() => navigate('InteractiveRecipe')}
          title="Enter Interactive Mode"
          color="#841584"
        />
      </View>
    );
  }
}
