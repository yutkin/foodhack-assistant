/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
} from 'react-native';
// import PropTypes from 'prop-types';

import Title from './Title';
import CardWithImage from './CardWithImage';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export default class Recipe extends Component {
  static navigationOptions = {
    title: 'Recipe',
  };

  render() {
    const { navigate, state: { params } } = this.props.navigation;
    const { name, photo } = params;

    return (
      <ScrollView style={styles.container}>
        <Title text={name} />
        <CardWithImage
          image={photo}
        />

        <Button
          onPress={() => navigate('InteractiveRecipe')}
          title="Enter Interactive Mode"
          color="#841584"
        />
      </ScrollView>
    );
  }
}
