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
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default class Recipe extends Component {
  static navigationOptions = {
    title: 'Recipe',
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
