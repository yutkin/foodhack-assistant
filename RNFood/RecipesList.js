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

export default class RecipesList extends Component {
  constructor(props) {
    super(props);

    console.log('wow');
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <Button
          onPress={() => navigate('Recipe')}
          title="Go to Recipe"
          color="#841584"
        />
      </View>
    );
  }
}
