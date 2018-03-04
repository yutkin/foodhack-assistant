/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Title from './Title';
import CardWithImage from './CardWithImage';
import recipesData from './stubs/recipes';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: 16,
    paddingRight: 16,
    // marginTop: 0 - (20 + 64),
  },
  navigationPlaceholder: {
    marginTop: 20 + 64,
  },
});

export default class RecipesList extends Component {
  static navigationOptions = {
    title: null,
    headerBackTitle: 'Назад',
    headerStyle: {
      // position: 'relative',
      // backgroundColor: 'white',
      borderBottomWidth: 0,
      // opacity: 0,
    },
    headerTransparent: true,
  };

  // constructor(props) {
  //   super(props);

  //   console.log('wow', recipesData);
  // }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.navigationPlaceholder} />
        <Title text="Меню" />

        {recipesData.map(recipe => (
          <TouchableOpacity
            onPress={() => navigate('Recipe', recipe)}
          >
            <CardWithImage
              key={recipe.id}
              title={recipe.name}
              image={recipe.photo}
              // TODO: add subtitle
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
}
