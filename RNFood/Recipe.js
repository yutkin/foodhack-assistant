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
  TouchableOpacity,
} from 'react-native';

import Title from './Title';
import CardWithImage from './CardWithImage';
import RecipeStep from './RecipeStep';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 16,
    paddingRight: 16,
    // marginTop: 0 - (20 + 64),
  },
  button: {
    backgroundColor: '#FC786F',
    borderRadius: 20,
    paddingTop: 15,
    paddingBottom: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  navigationPlaceholder: {
    marginTop: 20 + 64,
  },
});

export default class Recipe extends Component {
  static navigationOptions = {
    title: null,
    headerBackTitle: 'Назад',
    headerTintColor: '#FF5145',
    headerStyle: {
      // position: 'relative',
      // backgroundColor: 'white',
      borderBottomWidth: 0,
      // opacity: 0,
    },
    headerTransparent: true,
  };

  render() {
    const { navigate, state: { params } } = this.props.navigation;
    const { name, photo, steps } = params;

    const interactiveProps = {
      microsteps: steps.reduce((all, { photo: stepPhoto, microsteps }) => (
        all.concat(microsteps.map(text => ({ photo: stepPhoto, text })))
      ), []),
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.navigationPlaceholder} />

        <Title text={name} />
        <CardWithImage image={photo} />

        <TouchableOpacity
          onPress={() => navigate('InteractiveRecipe', interactiveProps)}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              Готовить вместе с ассистентом
            </Text>
          </View>
        </TouchableOpacity>

        {steps.map((step, i) => (
          <RecipeStep
            key={i} // eslint-disable-line react/no-array-index-key
            index={i + 1}
            {...step}
          />
        ))}
      </ScrollView>
    );
  }
}
