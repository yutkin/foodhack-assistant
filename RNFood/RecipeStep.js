import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CardWithImage from './CardWithImage';
import Title from './Title';


const styles = {
  container: {
    flex: 1,
  },
  step: {
    marginBottom: 25,
  },
  stepTitle: {
  },
  microsteps: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 40,
  },
  microstep: {
    fontSize: 22,
  },
};

/* eslint-disable react/prefer-stateless-function */
export default class RecipeStep extends Component {
  render() {
    const { photo, microsteps, index } = this.props;

    return (
      <View style={styles.container}>
        <CardWithImage image={photo} />
        <View style={styles.step}>
          <Title
            text={`Шаг ${index}:`}
            style={styles.stepTitle}
          />
          <View style={styles.microsteps}>
            {microsteps.map(microstep => (
              <Text
                key={microstep}
                style={styles.microstep}
              >
                {`\u2022 ${microstep}`}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  }
}
